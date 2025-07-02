import type { Edge } from "@xyflow/react";

export type MermaidEdge = Edge<
  {
    id: string;
    source: string;
    target: string;
  },
  "mermaid-edge"
>;
