import type { Node } from "@xyflow/react"


interface Edge {
    id: string;
    source:string;
    target:string;
}

const GenerateMermaidCode = (nodes : Node[], edges : Edge[]) => {
    let mermaidText = ["flowchart TD"] //change to toggleable TD/LR
    nodes.forEach((item:Node) => {
        let nodeText = item.data.label
        switch(item.data.shape) {
            case("rect"):
                mermaidText.push(`${item.id}[${nodeText}]`)
        }
    });

    edges.forEach((item:Edge) => {
        mermaidText.push(`${item.source} --> ${item.target}`)
    });

    console.log(mermaidText.join("\n"))
};

export default GenerateMermaidCode