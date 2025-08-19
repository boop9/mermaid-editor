import { BaseEdge, getStraightPath, type EdgeProps } from "@xyflow/react";
import type { MermaidEdge } from "../types/MermaidEdge";
// import Cookies from "universal-cookie";

// const cookies = new Cookies();

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
  //  const { updateEdgeData } = useReactFlow();

  //  data.text = cookies.get(`edge-label-${id}`);

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
};

export default CustomEdge;
