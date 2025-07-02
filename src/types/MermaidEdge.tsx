import type { Edge } from "@xyflow/react";

export type Edge = Edge<
  {
    id: string;
    source: string;
    target: string;
  },
  "mermaid-edge"
>;
