import type { NodeProps } from "@xyflow/react";
import type { MermaidType } from "../types/MermaidType";
import { Handle, useReactFlow } from "@xyflow/react";
import { Position } from "@xyflow/react";

const MermaidNode = (props: NodeProps<MermaidType>) => {
  const { updateNode } = useReactFlow();
  console.log(props.data.label);

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
    <>
      <textarea
        value={props.data.label}
        onChange={handleTextChange}
        placeholder={props.id}
        className="flex whitespace-nowrap resize-none overflow-hidden text-center w-full h-full border-2 rounded-xl bg-gray-600 text-gray-200 border-sky-600 focus:outline-0 focus:border-orange-500 focus:caret-amber-400"
      ></textarea>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </>
  );
};

export default MermaidNode;
