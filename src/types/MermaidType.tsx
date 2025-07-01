import type { Node } from "@xyflow/react";

export type MermaidType = Node<
  {
    shape: string;
    label: string;
    sourceConnections: number;
    targetConnections: number;
  },
  "mermaidnode"
>;
