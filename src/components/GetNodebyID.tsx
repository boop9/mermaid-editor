import type { MermaidType } from "../types/MermaidType";

const GetNodeByID = (id: string, nodes: MermaidType[]) => {
  nodes.map((node) => {
    if (node.id === id) {
      return node;
    }
  });
};

export default GetNodeByID;
