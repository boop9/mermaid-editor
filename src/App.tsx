import { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  useReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import GenerateMermaidCode from "./components/GenerateMermaidCode";
import type { Node, NodeOrigin, OnEdgesChange } from "@xyflow/react";
import MermaidNode from "./components/MermaidNode";
import MermaidComponent from "./components/MermaidComponent";
import type { MermaidEdge } from "./types/MermaidEdge";
import UpdateNodeData from "./components/UpdateNodeData";
import type { MermaidType } from "./types/MermaidType";
import Cookies from "universal-cookie";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import MermaidViewControls from "./components/MermaidViewControls";
import CustomEdge from "./components/CustomEdge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const cookies = new Cookies();

const initialNodes: MermaidType[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "",
      shape: "rect",
      sourceConnections: 1,
      targetConnections: 0,
    },
    type: "mermaidnode",
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: {
      label: "",
      shape: "rect",
      targetConnections: 1,
      sourceConnections: 0,
    },
    type: "mermaidnode",
  },
];

const initialEdges: MermaidEdge[] = [
  { id: "e1-2", source: "1", target: "2", type: "mermaid-edge" },
];

const nodeTypes = {
  mermaidnode: MermaidNode,
};

const edgeTypes = {
  "mermaid-edge": CustomEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<MermaidType>(
    cookies.get("nodes") || initialNodes
  );
  const [edges, setEdges] = useEdgesState<MermaidEdge>(
    cookies.get("edges") || initialEdges
  );
  const { screenToFlowPosition } = useReactFlow();
  const { addNodes } = useReactFlow();
  const { addEdges } = useReactFlow();
  const { getNode } = useReactFlow();

  const onConnect = useCallback(
    (connection: any) => {
      const edge = { ...connection, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    cookies.set("nodes", nodes);
    cookies.set("edges", edges);
  }, [nodes, edges]);

  const onEdgesChange: OnEdgesChange<MermaidEdge> = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      changes.forEach((change) => {
        if (change.type === "add" && change.item) {
          const sourceNode = getNode(change.item.source) as MermaidType;
          const targetNode = getNode(change.item.target) as MermaidType;
          const sourceId = change.item.source;
          const targetId = change.item.target;
          UpdateNodeData(setNodes, sourceId, {
            data: {
              sourceConnections: (sourceNode?.data.sourceConnections ?? 0) + 1,
            },
          });
          UpdateNodeData(setNodes, targetId, {
            data: {
              sourceConnections: (targetNode?.data.targetConnections ?? 0) + 1,
            },
          });
        }
      });
    },
    [setEdges, getNode, setNodes]
  );

  const idRef = useRef<number>(
    nodes.reduce((max, node) => {
      const num = Number(node.id);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0) + 1
  );
  const getId = () => {
    const newId = idRef.current;
    idRef.current += 1;
    return `${newId}`;
  };

  const onConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      const isFromSource = connectionState.fromHandle.type === "source";
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode: Node = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: "", shape: "rect" },
          origin: [0.5, 0.0],
          type: "mermaidnode",
        };

        const newEdge: MermaidEdge = {
          id: `e${connectionState.fromNode.id}-${id}`,
          source: isFromSource ? connectionState.fromHandle.nodeId : newNode.id,
          target: isFromSource ? newNode.id : connectionState.fromHandle.nodeId,
        };

        addNodes(newNode);
        addEdges(newEdge);
      }
    },
    [screenToFlowPosition, addEdges, addNodes]
  );

  return (
    <>
      <div className="flex resize-none w-screen h-screen">
        <div className="flex-1 w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            colorMode="dark"
            nodeOrigin={nodeOrigin}
            onConnectEnd={onConnectEnd}
          >
            <Controls />
          </ReactFlow>
        </div>

        <button
          id="generate-mermaid-code"
          onClick={() => GenerateMermaidCode(nodes, edges, "\n")}
          title="Convert to Mermaid code"
          className="fixed bottom-5 left-14"
        >
          Convert
        </button>
        <button
          id="clear-nodes"
          onClick={() => {
            setNodes(initialNodes);
            setEdges(initialEdges);
            idRef.current = 3;
          }}
          className="fixed bottom-5 left-45"
        >
          Clear
        </button>
        <div className="flex flex-col flex-1 w-1/2 resize-none border-l-2 border-gray-600">
          <div className="mermaid-viewport relative flex justify-center border-b-1 border-gray-600">
            <TransformWrapper
              initialScale={1}
              limitToBounds={false}
              initialPositionX={200}
              initialPositionY={100}
            >
              {() => (
                <>
                  <MermaidViewControls />
                  <TransformComponent
                    wrapperClass="bg-gray-700 w-full h-full"
                    wrapperStyle={{ width: "100%" }}
                  >
                    <div className="h-150 flex justify-center">
                      <MermaidComponent
                        source={GenerateMermaidCode(nodes, edges, ";")}
                        id="1"
                      ></MermaidComponent>
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </div>

          <SyntaxHighlighter
            language="mermaid"
            style={oneDark}
            className="mermaid-text-box"
            showLineNumbers
            customStyle={{
              marginTop: 0,
              paddingTop: 0,
              height: "100%",
            }}
            wrapLines
          >
            {GenerateMermaidCode(nodes, edges, "\n")}
          </SyntaxHighlighter>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
