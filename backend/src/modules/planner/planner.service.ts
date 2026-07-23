import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import {
  CorequisiteStatus,
  EvaluatePlanDto,
  EvaluatedCourseDto,
  EvaluatedTermDto,
  MissingPrerequisiteDto,
  OfferedTermRefDto,
  PlanEvaluationDto,
  PlannerCourseRefDto,
  SuggestedCourseDto,
} from './dto/planner.dto';

const MAX_SUGGESTIONS = 20;

@Injectable()
export class PlannerService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Prerequisite)
    private readonly prereqRepo: Repository<Prerequisite>,
    @InjectRepository(Corequisite)
    private readonly coreqRepo: Repository<Corequisite>,
    @InjectRepository(AcademicTerm)
    private readonly termRepo: Repository<AcademicTerm>,
    @InjectRepository(CourseOffering)
    private readonly offeringRepo: Repository<CourseOffering>,
  ) {}

  /**
   * Evaluate a multi-term registration plan against prerequisite and
   * corequisite rules. Purely computational — no state is stored.
   *
   * A course in term N is eligible when every prerequisite is already
   * satisfied by the completed set plus all earlier terms, and no
   * corequisite is left unscheduled.
   *
   * Eligibility is deliberately independent of availability: a term may
   * optionally bind to an AcademicTerm, in which case each course is also
   * checked against that term's curated offerings and reported via
   * `offered`. `registrable` combines the two. Unbound terms report
   * `offered: null` and behave exactly as they did before offerings existed.
   */
  async evaluate(dto: EvaluatePlanDto): Promise<PlanEvaluationDto> {
    // The catalog is small, so loading it whole is cheaper and simpler than
    // per-course lookups, and it also powers the suggestion pass.
    const [courses, prereqs, coreqs] = await Promise.all([
      this.courseRepo.find(),
      this.prereqRepo.find(),
      this.coreqRepo.find(),
    ]);

    const courseMap = new Map(courses.map((c) => [c.id, c]));

    // Fail loudly on unknown IDs rather than silently ignoring them.
    const referenced = new Set<string>([
      ...dto.completedCourseIds,
      ...dto.terms.flatMap((t) => t.courseIds),
    ]);
    const unknown = [...referenced].filter((id) => !courseMap.has(id));
    if (unknown.length) {
      throw new BadRequestException(
        `Unknown course id(s): ${unknown.join(', ')}`,
      );
    }

    const { termNames, offeredByTerm } = await this.loadOfferings(dto);

    const prereqMap = groupBy(
      prereqs,
      (p) => p.courseId,
      (p) => p.prerequisiteCourseId,
    );
    const coreqMap = groupBy(
      coreqs,
      (c) => c.courseId,
      (c) => c.corequisiteCourseId,
    );

    const ref = (id: string): PlannerCourseRefDto => {
      const c = courseMap.get(id)!;
      return {
        id: c.id,
        courseCode: c.courseCode,
        title: c.title,
        creditHours: Number(c.creditHours),
        level: c.level,
      };
    };

    const completedSet = new Set(dto.completedCourseIds);

    // Map every planned course to the (first) term it appears in, so we can
    // flag prerequisites that are scheduled too late.
    const termOfCourse = new Map<string, number>();
    dto.terms.forEach((t, i) => {
      for (const id of t.courseIds) {
        if (!termOfCourse.has(id)) termOfCourse.set(id, i + 1);
      }
    });

    // Courses considered "done" going into the current term. Starts as the
    // completed set and accumulates each term as we walk forward.
    const satisfied = new Set(completedSet);
    const evaluatedTerms: EvaluatedTermDto[] = [];

    dto.terms.forEach((term, index) => {
      const termNo = index + 1;
      const sameTerm = new Set(term.courseIds);
      // Only bound terms carry offering data; otherwise every course in this
      // slot reports offered = null.
      const offeredHere = term.termId ? offeredByTerm.get(term.termId) : null;
      const termName = term.termId
        ? (termNames.get(term.termId) ?? null)
        : null;

      const courseResults = term.courseIds.map(
        (courseId): EvaluatedCourseDto => {
          const course = courseMap.get(courseId)!;
          const prereqIds = prereqMap.get(courseId) ?? [];
          const coreqIds = coreqMap.get(courseId) ?? [];

          const satisfiedPrerequisites: PlannerCourseRefDto[] = [];
          const missingPrerequisites: MissingPrerequisiteDto[] = [];
          for (const pid of prereqIds) {
            if (satisfied.has(pid)) {
              satisfiedPrerequisites.push(ref(pid));
            } else {
              const laterTerm = termOfCourse.get(pid);
              missingPrerequisites.push({
                ...ref(pid),
                // Only an ordering conflict if the prereq is in this term or later.
                plannedInLaterTerm:
                  laterTerm && laterTerm >= termNo ? laterTerm : null,
              });
            }
          }

          const corequisites = coreqIds.map((cid) => {
            let status: CorequisiteStatus;
            if (satisfied.has(cid)) status = 'completed';
            else if (sameTerm.has(cid)) status = 'same-term';
            else status = 'unmet';
            return { ...ref(cid), status };
          });

          const eligible =
            missingPrerequisites.length === 0 &&
            corequisites.every((c) => c.status !== 'unmet');

          const offered = offeredHere ? offeredHere.has(courseId) : null;

          return {
            courseId,
            courseCode: course.courseCode,
            title: course.title,
            creditHours: Number(course.creditHours),
            level: course.level,
            eligible,
            offered,
            registrable: eligible && offered !== false,
            alreadyCompleted: completedSet.has(courseId),
            satisfiedPrerequisites,
            missingPrerequisites,
            corequisites,
            reason: buildReason(
              eligible,
              missingPrerequisites,
              corequisites,
              completedSet.has(courseId),
              offered,
              termName,
            ),
          };
        },
      );

      evaluatedTerms.push({
        term: termNo,
        termId: term.termId ?? null,
        termName,
        termCredits: round1(
          courseResults.reduce((sum, c) => sum + c.creditHours, 0),
        ),
        courses: courseResults,
      });

      // Everything planned this term counts as completed for later terms.
      for (const id of term.courseIds) satisfied.add(id);
    });

    // Suggestions: courses not yet taken/planned whose prerequisites are all
    // satisfied once the entire plan is done. Each is annotated with the bound
    // terms that actually offer it, and those are surfaced first — an
    // unofferable suggestion is not actionable this year.
    const boundTerms = dto.terms
      .filter((t) => t.termId)
      .map((t) => ({ termId: t.termId!, termName: termNames.get(t.termId!) }))
      .filter((t): t is OfferedTermRefDto => t.termName != null);

    const offeredIn = (courseId: string): OfferedTermRefDto[] => {
      const seen = new Set<string>();
      return boundTerms.filter((t) => {
        if (seen.has(t.termId)) return false;
        seen.add(t.termId);
        return offeredByTerm.get(t.termId)?.has(courseId) ?? false;
      });
    };

    const suggestions: SuggestedCourseDto[] = courses
      .filter((c) => !satisfied.has(c.id))
      .filter((c) =>
        (prereqMap.get(c.id) ?? []).every((pid) => satisfied.has(pid)),
      )
      .map((c) => ({ ...ref(c.id), offeredInTerms: offeredIn(c.id) }))
      .sort(
        (a, b) =>
          Number(b.offeredInTerms.length > 0) -
            Number(a.offeredInTerms.length > 0) ||
          a.courseCode.localeCompare(b.courseCode),
      )
      .slice(0, MAX_SUGGESTIONS);

    const totalPlannedCredits = round1(
      evaluatedTerms.reduce((sum, t) => sum + t.termCredits, 0),
    );
    const allEligible = evaluatedTerms.every((t) =>
      t.courses.every((c) => c.eligible),
    );
    const allOffered = evaluatedTerms.every((t) =>
      t.courses.every((c) => c.offered !== false),
    );

    return {
      terms: evaluatedTerms,
      suggestions,
      totalPlannedCredits,
      allEligible,
      allOffered,
    };
  }

  /**
   * Resolve the academic terms referenced by the plan and the set of courses
   * each one offers. Unknown term IDs fail loudly, matching how unknown course
   * IDs are handled — silently dropping the binding would downgrade a real
   * offering check into a vacuous pass.
   */
  private async loadOfferings(dto: EvaluatePlanDto): Promise<{
    termNames: Map<string, string>;
    offeredByTerm: Map<string, Set<string>>;
  }> {
    const termNames = new Map<string, string>();
    const offeredByTerm = new Map<string, Set<string>>();

    const termIds = [
      ...new Set(dto.terms.filter((t) => t.termId).map((t) => t.termId!)),
    ];
    if (!termIds.length) return { termNames, offeredByTerm };

    const terms = await this.termRepo.find({ where: { id: In(termIds) } });
    const found = new Set(terms.map((t) => t.id));
    const missing = termIds.filter((id) => !found.has(id));
    if (missing.length) {
      throw new BadRequestException(
        `Unknown academic term id(s): ${missing.join(', ')}`,
      );
    }

    for (const t of terms) {
      termNames.set(t.id, t.name);
      offeredByTerm.set(t.id, new Set());
    }

    const offerings = await this.offeringRepo.find({
      where: { termId: In(termIds) },
    });
    for (const o of offerings) {
      offeredByTerm.get(o.termId)?.add(o.courseId);
    }

    return { termNames, offeredByTerm };
  }
}

function groupBy<T>(
  rows: T[],
  key: (row: T) => string,
  value: (row: T) => string,
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const row of rows) {
    const k = key(row);
    const list = map.get(k);
    if (list) list.push(value(row));
    else map.set(k, [value(row)]);
  }
  return map;
}

function buildReason(
  eligible: boolean,
  missing: MissingPrerequisiteDto[],
  coreqs: { courseCode: string; status: CorequisiteStatus }[],
  alreadyCompleted: boolean,
  offered: boolean | null,
  termName: string | null,
): string {
  // "Not offered" is a scheduling fact, not a readiness failure, so it is
  // reported alongside the prerequisite verdict rather than replacing it.
  const notOffered = offered === false;
  const where = termName ? ` in ${termName}` : ' in the selected term';

  if (eligible) {
    if (notOffered) {
      return `Prerequisites satisfied, but this course is not offered${where}.`;
    }
    if (alreadyCompleted) {
      return 'Eligible, but you have already marked this course as completed.';
    }
    return 'Eligible — all prerequisites are satisfied.';
  }

  const parts: string[] = [];
  if (missing.length) {
    const items = missing.map((m) =>
      m.plannedInLaterTerm
        ? `${m.courseCode} (planned in term ${m.plannedInLaterTerm}, which is too late)`
        : m.courseCode,
    );
    parts.push(
      `missing prerequisite${missing.length > 1 ? 's' : ''}: ${items.join(', ')}`,
    );
  }
  const unmetCoreqs = coreqs
    .filter((c) => c.status === 'unmet')
    .map((c) => c.courseCode);
  if (unmetCoreqs.length) {
    parts.push(
      `corequisite${unmetCoreqs.length > 1 ? 's' : ''} not scheduled: ${unmetCoreqs.join(', ')}`,
    );
  }
  if (notOffered) {
    parts.push(`it is also not offered${where}`);
  }
  return `Not eligible — ${parts.join('; ')}.`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
