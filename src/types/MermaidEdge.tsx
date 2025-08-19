import type { Edge } from "@xyflow/react";

export type MermaidEdge = Edge<
  {
   text:string;
   linetype: string;
  },
  "mermaidedge"
>;
