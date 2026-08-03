import type { ProgramRoadmap } from './api';

/**
 * How firmly a program requires a course.
 *
 * `required` — everyone takes it (Core, Foundation, Preparation, Capstone,
 * General Education). `specialization` — one track or cluster among several.
 * `elective` — any course counting toward an open credit requirement.
 */
export type RequirementTier = 'required' | 'specialization' | 'elective';

const TIER_ORDER: Record<RequirementTier, number> = {
  required: 0,
  specialization: 1,
  elective: 2,
};

/** Rank a course by how firmly its program requires it; lower sorts first. */
export const tierRank = (tier: RequirementTier | undefined): number =>
  tier ? TIER_ORDER[tier] : TIER_ORDER.elective;

/**
 * Classify a requirement group by name.
 *
 * The group name is the only signal the roadmap carries, but the catalog names
 * them consistently: an "Electives" group is an open credit requirement, a
 * "Specialization"/"Cluster" group is one track among alternatives, and
 * everything else — Core, Foundation, Preparation, Capstone, General Education —
 * is taken by every student on the programme.
 */
export function tierForGroup(groupName: string): RequirementTier {
  if (/elective/i.test(groupName)) return 'elective';
  if (/^(specialization|cluster)\b|—/i.test(groupName)) return 'specialization';
  return 'required';
}

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
  /** How firmly the program requires each course, keyed by course id. */
  tiers: Record<string, RequirementTier>;
  /** The requirement group each course sits in, keyed by course id. */
  groups: Record<string, string>;
  /** The group's position in the catalog sequence, keyed by course id. */
  groupOrder: Record<string, number>;
}

export function courseIdsFromRoadmap(roadmap: ProgramRoadmap): string[] {
  return [...new Set(roadmap.phases.flatMap((phase) => phase.courses.map((c) => c.id)))];
}

/**
 * Requirement tier per course id.
 *
 * A course can sit in more than one group — CS550 is both a Data Science
 * specialization course and a cluster course — so the firmest classification
 * wins, which is what a student is actually bound by.
 */
export function tiersFromRoadmap(roadmap: ProgramRoadmap): Record<string, RequirementTier> {
  const placements = placementsFromRoadmap(roadmap);
  return Object.fromEntries(Object.entries(placements).map(([id, p]) => [id, p.tier])) as Record<
    string,
    RequirementTier
  >;
}

/** The requirement group each course sits in, keyed by course id. */
export function groupsFromRoadmap(roadmap: ProgramRoadmap): Record<string, string> {
  const placements = placementsFromRoadmap(roadmap);
  return Object.fromEntries(Object.entries(placements).map(([id, p]) => [id, p.groupName]));
}

/** Each course's group position in the catalog sequence, keyed by course id. */
export function groupOrderFromRoadmap(roadmap: ProgramRoadmap): Record<string, number> {
  const placements = placementsFromRoadmap(roadmap);
  return Object.fromEntries(Object.entries(placements).map(([id, p]) => [id, p.sortOrder]));
}

export interface Placement {
  tier: RequirementTier;
  groupName: string;
  /** The group's position in the catalog's own sequence. */
  sortOrder: number;
}

/**
 * Where each course sits in the programme — its firmest requirement group.
 *
 * A course can appear in several groups (CS550 is both a Data Science
 * specialization course and a cluster course), so the strongest obligation
 * wins: that is the one that actually binds the student.
 */
export function placementsFromRoadmap(roadmap: ProgramRoadmap): Record<string, Placement> {
  const placements: Record<string, Placement> = {};
  for (const phase of roadmap.phases) {
    const tier = tierForGroup(phase.name);
    for (const course of phase.courses) {
      const current = placements[course.id];
      if (!current || tierRank(tier) < tierRank(current.tier)) {
        placements[course.id] = { tier, groupName: phase.name, sortOrder: phase.sortOrder };
      }
    }
  }
  return placements;
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
