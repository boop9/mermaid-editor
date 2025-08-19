import type { Node } from "@xyflow/react";
import type { MermaidEdge } from "../types/MermaidEdge";

const GenerateMermaidCode = (
  nodes: Node[],
<<<<<<< HEAD
  edges: MermaidEdge[],
=======
  edges:  MermaidEdge[],
>>>>>>> 06e13dac106bf2f1c01f4d3be6f171bb062bfdc6
  linebreak: string
) => {
  const mermaidText = ["flowchart TD"]; //change to toggleable TD/LR
  nodes.forEach((item: Node) => {
    mermaidText.push(
      `${item.id}@{ shape: ${item.data.shape}, label: "${item.data.label}"}`
    );
  });

  edges.forEach((item: MermaidEdge) => {
<<<<<<< HEAD
    mermaidText.push(`${item.source} --> ${item.target}`);
=======
    mermaidText.push(`${item.source} -${item.label}-> ${item.target}`);
>>>>>>> 06e13dac106bf2f1c01f4d3be6f171bb062bfdc6
  });
  const mermaidCode = mermaidText.join(linebreak);
  console.log(mermaidCode);
  return mermaidCode;
};

export default GenerateMermaidCode;
