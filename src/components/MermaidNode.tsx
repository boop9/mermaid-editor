import type { NodeProps } from "@xyflow/react";
import type { MermaidType } from "../types/MermaidType";
import { Handle, useReactFlow } from "@xyflow/react";
import { Position } from "@xyflow/react";
import TextareaAutosize from 'react-textarea-autosize';

const DEFAULT_HANDLE_STYLE = {
  width: 10,
  height: 10,
  backgroundClip: "padding-box",
  left: "50%",
}

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
      <TextareaAutosize
        value={props.data.label}
        onChange={handleTextChange}
        placeholder={props.id}
        className="flex whitespace-nowrap resize-none overflow-hidden text-center py-3 w-full h-full border-2 rounded-xl bg-gray-600 text-gray-200 border-sky-600 focus:outline-0 focus:border-orange-500 focus:caret-amber-400"
      ></TextareaAutosize>
      <Handle type="source" position={Position.Bottom}         style={{ ...DEFAULT_HANDLE_STYLE
        }}/>
      <Handle type="target" position={Position.Top} style={{...DEFAULT_HANDLE_STYLE}}/>
    </>
  );
};

export default MermaidNode;
