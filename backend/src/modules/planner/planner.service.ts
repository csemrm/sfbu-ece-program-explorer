import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { Prerequisite } from '../../database/entities/prerequisite.entity';
import { Corequisite } from '../../database/entities/corequisite.entity';
import {
  CorequisiteStatus,
  EvaluatePlanDto,
  EvaluatedCourseDto,
  EvaluatedTermDto,
  MissingPrerequisiteDto,
  PlanEvaluationDto,
  PlannerCourseRefDto,
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
  ) {}

  /**
   * Evaluate a multi-term registration plan against prerequisite and
   * corequisite rules. Purely computational — no state is stored.
   *
   * A course in term N is eligible when every prerequisite is already
   * satisfied by the completed set plus all earlier terms, and no
   * corequisite is left unscheduled.
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

          return {
            courseId,
            courseCode: course.courseCode,
            title: course.title,
            creditHours: Number(course.creditHours),
            level: course.level,
            eligible,
            alreadyCompleted: completedSet.has(courseId),
            satisfiedPrerequisites,
            missingPrerequisites,
            corequisites,
            reason: buildReason(
              eligible,
              missingPrerequisites,
              corequisites,
              completedSet.has(courseId),
            ),
          };
        },
      );

      evaluatedTerms.push({
        term: termNo,
        termCredits: round1(
          courseResults.reduce((sum, c) => sum + c.creditHours, 0),
        ),
        courses: courseResults,
      });

      // Everything planned this term counts as completed for later terms.
      for (const id of term.courseIds) satisfied.add(id);
    });

    // Suggestions: courses not yet taken/planned whose prerequisites are all
    // satisfied once the entire plan is done.
    const suggestions = courses
      .filter((c) => !satisfied.has(c.id))
      .filter((c) =>
        (prereqMap.get(c.id) ?? []).every((pid) => satisfied.has(pid)),
      )
      .sort((a, b) => a.courseCode.localeCompare(b.courseCode))
      .slice(0, MAX_SUGGESTIONS)
      .map((c) => ref(c.id));

    const totalPlannedCredits = round1(
      evaluatedTerms.reduce((sum, t) => sum + t.termCredits, 0),
    );
    const allEligible = evaluatedTerms.every((t) =>
      t.courses.every((c) => c.eligible),
    );

    return {
      terms: evaluatedTerms,
      suggestions,
      totalPlannedCredits,
      allEligible,
    };
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
): string {
  if (eligible) {
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
  return `Not eligible — ${parts.join('; ')}.`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
