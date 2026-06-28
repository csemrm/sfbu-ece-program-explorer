'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CourseNode, type CourseNodeData } from './CourseNode';
import { DetailsPanel } from './DetailsPanel';
import type { ProgramGraph, GraphNode } from '../../lib/api';
import { computeLayout } from '../../lib/graphLayout';

const nodeTypes: NodeTypes = { course: CourseNode };

function buildRFNodes(graphData: ProgramGraph): Node[] {
  const edgeList = graphData.edges.map((e) => ({ source: e.sourceId, target: e.targetId }));
  const positions = computeLayout(
    graphData.nodes.map((n) => n.id),
    edgeList,
  );

  return graphData.nodes.map((n) => ({
    id: n.id,
    type: 'course',
    position: positions.get(n.id) ?? { x: 0, y: 0 },
    data: {
      courseCode: n.courseCode,
      title: n.title,
      creditHours: n.creditHours,
      level: n.level,
      inProgram: n.inProgram,
      description: n.description,
    } satisfies CourseNodeData,
  }));
}

function buildRFEdges(graphData: ProgramGraph): Edge[] {
  return graphData.edges.map((e) => ({
    id: e.id,
    source: e.sourceId,
    target: e.targetId,
    data: { relType: e.type },
    style: {
      stroke: '#94a3b8',
      strokeWidth: 1.5,
      ...(e.type === 'corequisite' ? { strokeDasharray: '6 3' } : {}),
    },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
  }));
}

const DEFAULT_EDGE_STYLE = (isCoreq: boolean) => ({
  stroke: '#94a3b8',
  strokeWidth: 1.5,
  ...(isCoreq ? { strokeDasharray: '6 3' } : {}),
});

const HIGHLIGHT_EDGE_STYLE = (isCoreq: boolean) => ({
  stroke: '#3b82f6',
  strokeWidth: 2.5,
  ...(isCoreq ? { strokeDasharray: '6 3' } : {}),
});

interface Props {
  graphData: ProgramGraph;
}

export function GraphCanvas({ graphData }: Props) {
  const initialNodes = useMemo(() => buildRFNodes(graphData), [graphData]);
  const initialEdges = useMemo(() => buildRFEdges(graphData), [graphData]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const found = graphData.nodes.find((n) => n.id === node.id) ?? null;
      setSelectedNode(found);
      setEdges((eds) =>
        eds.map((e) => {
          const connected = e.source === node.id || e.target === node.id;
          const isCoreq = e.data?.relType === 'corequisite';
          return {
            ...e,
            style: connected ? HIGHLIGHT_EDGE_STYLE(isCoreq) : DEFAULT_EDGE_STYLE(isCoreq),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: connected ? '#3b82f6' : '#94a3b8',
            },
          };
        }),
      );
    },
    [graphData.nodes, setEdges],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setEdges((eds) =>
      eds.map((e) => {
        const isCoreq = e.data?.relType === 'corequisite';
        return {
          ...e,
          style: DEFAULT_EDGE_STYLE(isCoreq),
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
        };
      }),
    );
  }, [setEdges]);

  return (
    <div className="relative w-full" style={{ height: '78vh' }}>
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-4 py-3 text-xs space-y-1.5 shadow">
        <p className="font-semibold text-gray-700 mb-2">Legend</p>
        <span className="flex items-center gap-2">
          <span className="w-4 h-3 rounded-sm bg-blue-200 border-2 border-blue-400 inline-block" />
          Undergraduate course
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-3 rounded-sm bg-purple-200 border-2 border-purple-400 inline-block" />
          Graduate course
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 border-t-2 border-gray-400 inline-block" />
          Prerequisite
        </span>
        <span className="flex items-center gap-2">
          <span className="w-6 border-t-2 border-dashed border-gray-400 inline-block" />
          Corequisite
        </span>
      </div>

      <DetailsPanel node={selectedNode} onClose={() => onPaneClick()} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
      >
        <Background gap={16} color="#e5e7eb" />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const d = n.data as CourseNodeData;
            return d.level === 'graduate' ? '#c4b5fd' : '#93c5fd';
          }}
          maskColor="rgba(0,0,0,0.05)"
        />
      </ReactFlow>
    </div>
  );
}
