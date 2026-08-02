import type { ProgramRoadmap } from './api';

/**
 * A degree the planner can be scoped to, plus the catalog courses that belong
 * to it.
 *
 * The public API has no "courses in this program" endpoint, but a program's
 * roadmap already carries every course grouped by requirement phase, so the
 * set is derived from that rather than adding a backend route.
 */
export interface ProgramOption {
  id: string;
  abbreviation: string;
  name: string;
  /** Distinct course ids across every roadmap phase. Empty means "unknown". */
  courseIds: string[];
}

export function courseIdsFromRoadmap(roadmap: ProgramRoadmap): string[] {
  return [...new Set(roadmap.phases.flatMap((phase) => phase.courses.map((c) => c.id)))];
}

/**
 * Course ids to scope the planner to, or `null` for "do not scope".
 *
 * A program with no roadmap courses would otherwise filter the entire planner
 * down to nothing, which reads as a broken page rather than as missing data —
 * so an empty set deliberately means "show everything".
 */
export function scopeFor(program: ProgramOption | null | undefined): Set<string> | null {
  if (!program || program.courseIds.length === 0) return null;
  return new Set(program.courseIds);
}
