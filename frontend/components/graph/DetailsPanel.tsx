'use client';

import Link from 'next/link';
import type { GraphNode } from '../../lib/api';

interface Props {
  node: GraphNode | null;
  onClose: () => void;
}

const levelLabel: Record<string, string> = {
  undergraduate: 'Undergraduate',
  graduate: 'Graduate',
};

export function DetailsPanel({ node, onClose }: Props) {
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 z-10 w-72 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className="font-mono font-bold text-gray-800 text-sm">{node.courseCode}</span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="px-4 py-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{node.title}</h3>

        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
            {node.creditHours} credits
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1">
            {levelLabel[node.level] ?? node.level}
          </span>
          {!node.inProgram && (
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-1">
              external
            </span>
          )}
        </div>

        {node.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{node.description}</p>
        )}

        <Link
          href={`/courses/${node.id}`}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 text-white text-xs font-semibold py-2 px-3 hover:bg-blue-700 transition-colors"
        >
          View Course Detail →
        </Link>
      </div>
    </div>
  );
}
