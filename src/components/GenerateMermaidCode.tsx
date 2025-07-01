import type { Node } from "@xyflow/react";
import type { Edge } from "../types/Edge";

const GenerateMermaidCode = (
  nodes: Node[],
  edges: Edge[],
  linebreak: string
) => {
  const mermaidText = ["flowchart TD"]; //change to toggleable TD/LR
  nodes.forEach((item: Node) => {
    mermaidText.push(
      `${item.id}@{ shape: ${item.data.shape}, label: "${item.data.label}"}`
    );
  });

  edges.forEach((item: Edge) => {
    mermaidText.push(`${item.source} --> ${item.target}`);
  });
  const mermaidCode = mermaidText.join(linebreak);
  console.log(mermaidCode);
  return mermaidCode;
};

export default GenerateMermaidCode;
