import type { NodeProps } from "@xyflow/react";
import type { MermaidType } from "../types/MermaidType";
import { Handle, useReactFlow } from "@xyflow/react";
import { Position } from "@xyflow/react";
import MermaidComponent from "./MermaidComponent";
import { useEffect, useState } from "react";

const MermaidNode = (props: NodeProps<MermaidType>) => {
  const { updateNode } = useReactFlow();
  const [sourceValue, setSourceValue] = useState("");
  console.log(props.data.label);
  const value = Math.floor(props.data.label.length / 4);

  useEffect(() => {
    const emsp = "\u2003";

    setSourceValue(
      `flowchart TD \n A@{ shape: ${props.data.shape}, label: "${
        emsp.repeat(value) || emsp
      }" }`
    );
  }, [value, props.data.shape]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newLabel = e.target.value;
    updateNode(props.id, {
      data: {
        ...props.data,
        label: newLabel,
      },
    });
  };

  return (
    <div className="flex justify-center content-center">
      <div className="center self-center justify-center">
        <MermaidComponent source={sourceValue} id={props.id}></MermaidComponent>
      </div>
      <textarea
        value={props.data.label}
        onChange={handleTextChange}
        placeholder={props.id}
        className="fixed bottom-10 justify-center self-center content-center  resize-none text-center w-full overflow text-black focus:outline-none z-10"
      ></textarea>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};

export default MermaidNode;
