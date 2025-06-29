import type { NodeProps } from "@xyflow/react";
import type { MermaidType } from "../types/MermaidType";
import { Handle, useReactFlow } from "@xyflow/react";
import { Position } from "@xyflow/react";

const MermaidNode = (props : NodeProps<MermaidType>) => {
    const {updateNode} = useReactFlow();
    console.log(props.data.label);
 
    const handleTextChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const newLabel = e.target.value
        updateNode(props.id, {
            data: {
                ...props.data,
                label : newLabel,
            },
        });
    };

    return(
        <>
        <textarea onChange={handleTextChange} placeholder={props.data.label}></textarea>
        <Handle type="source" position= {Position.Bottom} />
        <Handle type="target" position= {Position.Top} />
        </>
    )
}

export default MermaidNode;