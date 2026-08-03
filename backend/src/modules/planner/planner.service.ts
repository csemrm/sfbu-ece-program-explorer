import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import { AcademicTerm } from '../../database/entities/academic-term.entity';
import { CourseOffering } from '../../database/entities/course-offering.entity';
import { ProgramRequirement } from '../../database/entities/program-requirement.entity';
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
    @InjectRepository(ProgramRequirement)
    private readonly requirementRepo: Repository<ProgramRequirement>,
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
    const programCourses = await this.loadProgramCourses(dto.programId);

    // Prerequisites become a list of requirements per course, each of which is a
    // set of interchangeable courses. A row with no alternativeGroup is its own
    // one-course requirement, which is how every prerequisite behaved before
    // alternatives existed.
    const prereqMap = groupRequirements(prereqs);
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
          const requirements = prereqMap.get(courseId) ?? [];
          const coreqIds = coreqMap.get(courseId) ?? [];

          const satisfiedPrerequisites: PlannerCourseRefDto[] = [];
          const missingPrerequisites: MissingPrerequisiteDto[] = [];
          const backgroundPrerequisites: PlannerCourseRefDto[] = [];

          requirements.forEach((requirement, index) => {
            const met = requirement.filter((pid) => satisfied.has(pid));
            if (met.length) {
              // Only the alternative actually taken is reported as satisfied.
              satisfiedPrerequisites.push(...met.map(ref));
              return;
            }

            // Outside the degree only excuses the requirement when *every*
            // alternative is: if one of them belongs to this programme, that is
            // the route the student is expected to take.
            if (
              programCourses &&
              requirement.every((pid) => !programCourses.has(pid))
            ) {
              backgroundPrerequisites.push(...requirement.map(ref));
              return;
            }

            // Alternatives share a group so the caller can render them as one
            // "A or B" requirement rather than two independent blockers.
            const alternativeGroup = requirement.length > 1 ? index : null;
            for (const pid of requirement) {
              const laterTerm = termOfCourse.get(pid);
              missingPrerequisites.push({
                ...ref(pid),
                alternativeGroup,
                // Only an ordering conflict if the prereq is in this term or later.
                plannedInLaterTerm:
                  laterTerm && laterTerm >= termNo ? laterTerm : null,
              });
            }
          });

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

          const offering = offeredHere?.get(courseId) ?? null;
          const offered = offeredHere ? offering !== null : null;
          // A course that runs but is closed cannot be registered for, so it is
          // reported separately from "not offered" — the fix differs: one waits
          // for the registrar, the other for a different term.
          const openForRegistration = offering?.openForRegistration ?? null;

          return {
            courseId,
            courseCode: course.courseCode,
            title: course.title,
            creditHours: Number(course.creditHours),
            level: course.level,
            eligible,
            offered,
            openForRegistration,
            sectionCount: offering?.sectionCount ?? null,
            statusNote: offering?.statusNote ?? null,
            registrable:
              eligible && offered !== false && openForRegistration !== false,
            alreadyCompleted: completedSet.has(courseId),
            satisfiedPrerequisites,
            missingPrerequisites,
            backgroundPrerequisites,
            corequisites,
            reason: buildReason(
              eligible,
              missingPrerequisites,
              corequisites,
              completedSet.has(courseId),
              offered,
              termName,
              openForRegistration,
              offering?.statusNote ?? null,
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
        (prereqMap.get(c.id) ?? []).every((req) =>
          requirementMet(req, satisfied),
        ),
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
   *
   * A term with no offerings at all is omitted from the returned map, so its
   * courses report `offered: null` rather than `false`. An empty schedule means
   * "nobody has curated this term yet", not "this term runs no courses" —
   * reporting the latter would tell a student, with apparent authority, that
   * every course in the catalog is unavailable.
   */
  /**
   * Course ids belonging to a degree, or null when no degree was supplied.
   *
   * Derived from the program's requirement rows, which is the same set the
   * roadmap is built from — there is no separate "courses in this program"
   * table. A program with no course-bearing requirements yields null rather
   * than an empty set, so an unmodelled degree does not silently excuse every
   * prerequisite in the catalog.
   */
  private async loadProgramCourses(
    programId?: string,
  ): Promise<Set<string> | null> {
    if (!programId) return null;

    const rows = await this.requirementRepo
      .createQueryBuilder('req')
      .innerJoin('req.requirementGroup', 'rg')
      .innerJoin('rg.catalogYear', 'cy')
      .where('cy.program_id = :programId', { programId })
      .andWhere('req.course_id IS NOT NULL')
      .select('req.course_id', 'courseId')
      .getRawMany<{ courseId: string }>();

    if (!rows.length) return null;
    return new Set(rows.map((r) => r.courseId));
  }

  private async loadOfferings(dto: EvaluatePlanDto): Promise<{
    termNames: Map<string, string>;
    offeredByTerm: Map<string, Map<string, OfferingStatus>>;
  }> {
    const termNames = new Map<string, string>();
    const offeredByTerm = new Map<string, Map<string, OfferingStatus>>();

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
    }

    const offerings = await this.offeringRepo.find({
      where: { termId: In(termIds) },
    });
    // Built only from rows that exist, so a term with zero offerings never
    // gets an (empty, and therefore falsifying) entry.
    for (const o of offerings) {
      const status: OfferingStatus = {
        openForRegistration: o.openForRegistration,
        sectionCount: o.sectionCount,
        statusNote: o.statusNote,
      };
      const map = offeredByTerm.get(o.termId);
      if (map) map.set(o.courseId, status);
      else offeredByTerm.set(o.termId, new Map([[o.courseId, status]]));
    }

    return { termNames, offeredByTerm };
  }
}

/** One prerequisite requirement: satisfying any listed course satisfies it. */
type PrerequisiteRequirement = string[];

/**
 * Prerequisites per course, as a list of requirements.
 *
 * Rows sharing an alternativeGroup collapse into one requirement holding all of
 * them — "CS250 or CS360". Rows without a group each become a requirement of
 * their own, so they remain individually mandatory.
 */
function groupRequirements(
  rows: {
    courseId: string;
    prerequisiteCourseId: string;
    alternativeGroup?: number | null;
  }[],
): Map<string, PrerequisiteRequirement[]> {
  const byCourse = new Map<string, Map<string, PrerequisiteRequirement>>();
  for (const row of rows) {
    const buckets =
      byCourse.get(row.courseId) ?? new Map<string, PrerequisiteRequirement>();
    // Ungrouped rows get a unique key so they never merge with one another.
    // == null catches undefined as well: a row built without the field must
    // stay individually mandatory, not merge with every other ungrouped row
    // into one OR.
    const key =
      row.alternativeGroup == null
        ? `single:${row.prerequisiteCourseId}`
        : `group:${row.alternativeGroup}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(row.prerequisiteCourseId);
    else buckets.set(key, [row.prerequisiteCourseId]);
    byCourse.set(row.courseId, buckets);
  }
  return new Map(
    [...byCourse].map(([courseId, buckets]) => [
      courseId,
      [...buckets.values()],
    ]),
  );
}

/** A requirement is met when any one of its interchangeable courses is satisfied. */
const requirementMet = (
  requirement: PrerequisiteRequirement,
  satisfied: Set<string>,
): boolean => requirement.some((id) => satisfied.has(id));

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

/** Registration status of one offering, as published by the registrar. */
interface OfferingStatus {
  openForRegistration: boolean;
  sectionCount: number | null;
  statusNote: string | null;
}

function buildReason(
  eligible: boolean,
  missing: MissingPrerequisiteDto[],
  coreqs: { courseCode: string; status: CorequisiteStatus }[],
  alreadyCompleted: boolean,
  offered: boolean | null,
  termName: string | null,
  openForRegistration: boolean | null,
  statusNote: string | null,
): string {
  // "Not offered" is a scheduling fact, not a readiness failure, so it is
  // reported alongside the prerequisite verdict rather than replacing it.
  const notOffered = offered === false;
  const closed = openForRegistration === false;
  const where = termName ? ` in ${termName}` : ' in the selected term';
  // The registrar's own wording beats any category we could invent for it.
  const because = statusNote ? ` (${statusNote})` : '';

  if (eligible) {
    if (notOffered) {
      return `Prerequisites satisfied, but this course is not offered${where}.`;
    }
    if (closed) {
      return `Prerequisites satisfied, but registration is closed${where}${because}.`;
    }
    if (alreadyCompleted) {
      return 'Eligible, but you have already marked this course as completed.';
    }
    return 'Eligible — all prerequisites are satisfied.';
  }

  const parts: string[] = [];
  if (missing.length) {
    // Alternatives share a group and read as one "CS250 or CS360" requirement.
    // Listing them flat would name two courses where the student owes either.
    const groups = new Map<string, MissingPrerequisiteDto[]>();
    for (const m of missing) {
      const key =
        m.alternativeGroup === null
          ? `single:${m.id}`
          : `group:${m.alternativeGroup}`;
      const bucket = groups.get(key);
      if (bucket) bucket.push(m);
      else groups.set(key, [m]);
    }
    const items = [...groups.values()].map((options) =>
      options
        .map((m) =>
          m.plannedInLaterTerm
            ? `${m.courseCode} (planned in term ${m.plannedInLaterTerm}, which is too late)`
            : m.courseCode,
        )
        .join(' or '),
    );
    parts.push(
      `missing prerequisite${items.length > 1 ? 's' : ''}: ${items.join(', ')}`,
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
  } else if (closed) {
    parts.push(`registration is also closed${where}${because}`);
  }
  return `Not eligible — ${parts.join('; ')}.`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
