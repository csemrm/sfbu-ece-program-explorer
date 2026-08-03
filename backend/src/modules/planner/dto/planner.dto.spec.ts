import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EvaluatePlanDto } from './planner.dto';

const uuid = (n: number) =>
  `00000000-0000-4000-8000-${n.toString().padStart(12, '0')}`;

const validate = (body: unknown) =>
  validateSync(plainToInstance(EvaluatePlanDto, body), {
    whitelist: true,
    forbidNonWhitelisted: false,
  });

/** Flattened constraint messages, including nested term errors. */
const messages = (errors: ReturnType<typeof validate>): string[] =>
  errors.flatMap((e) => [
    ...Object.values(e.constraints ?? {}),
    ...(e.children ?? []).flatMap((c) =>
      (c.children ?? []).flatMap((cc) => Object.values(cc.constraints ?? {})),
    ),
  ]);

describe('EvaluatePlanDto', () => {
  it('accepts a whole term schedule, not just a student course load', () => {
    // The planner evaluates every offered course so it can show what is blocked
    // before the student commits. Fall 2026 alone publishes 96 offerings, and a
    // 30-element cap rejected all three degrees the moment it was seeded in full.
    const errors = validate({
      completedCourseIds: [],
      terms: [{ courseIds: Array.from({ length: 96 }, (_, i) => uuid(i)) }],
    });
    expect(messages(errors)).toEqual([]);
  });

  it('still rejects an implausibly large term', () => {
    const errors = validate({
      completedCourseIds: [],
      terms: [{ courseIds: Array.from({ length: 201 }, (_, i) => uuid(i)) }],
    });
    expect(messages(errors)).toContain(
      'courseIds must contain no more than 200 elements',
    );
  });

  it('rejects a course id that is not a uuid', () => {
    const errors = validate({
      completedCourseIds: [],
      terms: [{ courseIds: ['not-a-uuid'] }],
    });
    expect(messages(errors).join(' ')).toMatch(/must be a UUID/);
  });

  it('accepts an optional programId and termId', () => {
    const errors = validate({
      completedCourseIds: [uuid(1)],
      terms: [{ courseIds: [uuid(2)], termId: uuid(3) }],
      programId: uuid(4),
    });
    expect(messages(errors)).toEqual([]);
  });

  it('rejects a programId that is not a uuid', () => {
    const errors = validate({
      completedCourseIds: [],
      terms: [{ courseIds: [uuid(1)] }],
      programId: 'BSCS',
    });
    expect(messages(errors).join(' ')).toMatch(/programId must be a UUID/);
  });
});
