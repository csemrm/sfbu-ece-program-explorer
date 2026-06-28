'use client';

import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';

export type CourseNodeData = {
  courseCode: string;
  title: string;
  creditHours: number;
  level: string;
  inProgram: boolean;
  description: string | null;
};

type CourseNodeType = Node<CourseNodeData, 'course'>;

const levelStyle: Record<string, string> = {
  undergraduate: 'border-blue-400 bg-blue-50',
  graduate: 'border-purple-400 bg-purple-50',
};

const levelBadge: Record<string, string> = {
  undergraduate: 'bg-blue-100 text-blue-700',
  graduate: 'bg-purple-100 text-purple-700',
};

export function CourseNode({ data, selected }: NodeProps<CourseNodeType>) {
  const border = levelStyle[data.level] ?? 'border-gray-300 bg-white';
  const badge = levelBadge[data.level] ?? 'bg-gray-100 text-gray-600';
  const opacity = data.inProgram ? '' : 'opacity-60';

  return (
    <div
      className={`rounded-xl border-2 ${border} ${opacity} shadow-sm px-3 py-2 w-48 ${
        selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2" />

      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="font-mono text-xs font-bold text-gray-800 truncate">
          {data.courseCode}
        </span>
        <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium flex-shrink-0 ${badge}`}>
          {data.creditHours}cr
        </span>
      </div>
      <p className="text-xs text-gray-700 leading-snug line-clamp-2 font-medium">{data.title}</p>

      {!data.inProgram && <span className="mt-1 text-xs text-gray-400 italic block">external</span>}

      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}
