import { BaseEdge, getStraightPath, type EdgeProps } from "@xyflow/react";
import type { MermaidEdge } from "../types/MermaidEdge";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<MermaidEdge>) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
};

export default CustomEdge;
