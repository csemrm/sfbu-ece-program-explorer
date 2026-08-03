import type { MissingPrerequisite } from './api';

/**
 * Collapses missing prerequisites into the requirements a student actually owes.
 *
 * Alternatives share an `alternativeGroup` — the catalog's "CS250 or CS360" —
 * and taking either one clears the requirement. Listing them flat would read as
 * two separate blockers and overstate what is left to do, so each group folds
 * into a single entry holding its options.
 *
 * Ungrouped rows stand alone: each is required outright and gets its own entry.
 */
export function missingRequirements(missing: MissingPrerequisite[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const p of missing) {
    const key = p.alternativeGroup === null ? `single:${p.id}` : `group:${p.alternativeGroup}`;
    const codes = groups.get(key);
    if (codes) codes.push(p.courseCode);
    else groups.set(key, [p.courseCode]);
  }
  return [...groups.values()];
}

/** The same requirements as prose — "CS250 or CS360, CS515". */
export function formatMissingPrerequisites(missing: MissingPrerequisite[]): string {
  return missingRequirements(missing)
    .map((codes) => codes.join(' or '))
    .join(', ');
}
