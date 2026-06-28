const NODE_W = 200;
const NODE_H = 80;
const H_GAP = 100;
const V_GAP = 40;

export function computeLayout(
  nodeIds: string[],
  edges: Array<{ source: string; target: string }>,
): Map<string, { x: number; y: number }> {
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  for (const id of nodeIds) {
    outgoing.set(id, []);
    incoming.set(id, []);
  }

  for (const { source, target } of edges) {
    if (outgoing.has(source) && outgoing.has(target)) {
      outgoing.get(source)!.push(target);
      incoming.get(target)!.push(source);
    }
  }

  // Longest-path level assignment (BFS from roots)
  const level = new Map<string, number>();
  const queue: string[] = [];

  for (const id of nodeIds) {
    if ((incoming.get(id)?.length ?? 0) === 0) {
      level.set(id, 0);
      queue.push(id);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    const nodeLv = level.get(node)!;
    for (const neighbor of outgoing.get(node) ?? []) {
      const newLv = nodeLv + 1;
      if ((level.get(neighbor) ?? -1) < newLv) {
        level.set(neighbor, newLv);
        queue.push(neighbor);
      }
    }
  }

  // Isolated nodes default to level 0
  for (const id of nodeIds) {
    if (!level.has(id)) level.set(id, 0);
  }

  // Group by level and sort within group
  const byLevel = new Map<number, string[]>();
  for (const [id, lv] of level) {
    if (!byLevel.has(lv)) byLevel.set(lv, []);
    byLevel.get(lv)!.push(id);
  }
  for (const ids of byLevel.values()) ids.sort();

  // Assign positions
  const positions = new Map<string, { x: number; y: number }>();
  for (const [lv, ids] of byLevel) {
    ids.forEach((id, i) => {
      positions.set(id, {
        x: lv * (NODE_W + H_GAP),
        y: i * (NODE_H + V_GAP),
      });
    });
  }

  return positions;
}
