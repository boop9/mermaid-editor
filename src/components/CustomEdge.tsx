import { BaseEdge, EdgeLabelRenderer, getStraightPath, useReactFlow, type EdgeProps } from "@xyflow/react";
import type { MermaidEdge } from "../types/MermaidEdge";
import TextareaAutosize from 'react-textarea-autosize';
import Cookies from "universal-cookie";

const cookies = new Cookies

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps<MermaidEdge>) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
    const { updateEdgeData } = useReactFlow();

    data.text = cookies.get(`edge-label-${id}`)

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newLabel = e.target.value;
    updateEdgeData(id, {

        label: newLabel,
    });
    console.log("edge label change");
    cookies.set(`edge-label-${id}`,newLabel)
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <TextareaAutosize value={label} onChange={handleTextChange} className="absolute hover:border-gray-100 hover:border-1 w-36 h-7 rounded-sm resize-none overflow-hidden field-sizing-content text-white text-center" style={{pointerEvents: "all", transform: `translate(-50%,-50%) translate(${labelX}px, ${labelY}px)`}}>
        </TextareaAutosize>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
