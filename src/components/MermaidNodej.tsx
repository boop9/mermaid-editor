import type { NodeProps } from "@xyflow/react";
import type { MermaidType } from "../types/MermaidType";
import { Handle, useReactFlow } from "@xyflow/react";
import { Position } from "@xyflow/react";
<<<<<<< HEAD
import MermaidComponent from "./MermaidComponent";
import { useEffect, useState } from "react";
=======
import TextareaAutosize from 'react-textarea-autosize';

const DEFAULT_HANDLE_STYLE = {
  width: 10,
  height: 10,
  backgroundClip: "padding-box",
  left: "50%",
}
>>>>>>> 06e13dac106bf2f1c01f4d3be6f171bb062bfdc6

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
<<<<<<< HEAD
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
=======
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
>>>>>>> 06e13dac106bf2f1c01f4d3be6f171bb062bfdc6
  );
};

export default MermaidNode;
