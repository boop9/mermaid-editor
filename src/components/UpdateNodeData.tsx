import type { MermaidType } from "../types/MermaidType";

const UpdateNodeData = (
  setNodes: (updater: (nodes: MermaidType[]) => MermaidType[]) => void,
  nodeId: string,
  updatedNode: Partial<Omit<MermaidType, "data">> & {
    data?: Partial<MermaidType["data"]>;
  }
) => {
  setNodes((nodes) =>
    nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            ...updatedNode,
            data: {
              ...node.data,
              ...(updatedNode.data ?? {}),
            },
          }
        : node
    )
  );
};

export default UpdateNodeData;
