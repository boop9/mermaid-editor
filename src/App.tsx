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
import type { MermaidType } from "./types/MermaidType";
import Cookies from "universal-cookie";
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from "react-zoom-pan-pinch";
import CustomEdge from "./components/CustomEdge";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const cookies = new Cookies();

const initialNodes: MermaidType[] = [
  {
    id: "1",
    position: { x: 300, y: 300 },
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
    position: { x: 300, y: 400 },
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
  { id: "e1-2", source: "1", target: "2", type: "mermaidedge" },
];

const nodeTypes = {
  mermaidnode: MermaidNode,
};

const edgeTypes = {
  mermaidedge: CustomEdge,
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
  const { updateNodeData } = useReactFlow();

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
    console.log("saving cookies");
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
          updateNodeData(sourceId, {
            data: {
              sourceConnections: (sourceNode?.data.sourceConnections ?? 0) + 1,
            },
          });
          updateNodeData(targetId, {
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
          data: { label: ``, shape: `rect` },
          origin: [0.5, 0.0],
          type: "mermaidnode",
        };

        const newEdge: MermaidEdge = {
          id: `e${connectionState.fromNode.id}-${id}`,
          source: isFromSource ? connectionState.fromHandle.nodeId : newNode.id,
          target: isFromSource ? newNode.id : connectionState.fromHandle.nodeId,
          type: "mermaidedge",
        };

        addNodes(newNode);
        addEdges(newEdge);
      }
    },
    [screenToFlowPosition, addEdges, addNodes]
  );

  const TransformControls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();

    return (
      <div className="tools absolute left-0 bottom-0">
        <button onClick={() => zoomIn()}>+</button>
        <button onClick={() => zoomOut()}>-</button>
        <button onClick={() => resetTransform()}>x</button>
      </div>
    );
  };

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
          id="clear-nodes"
          onClick={() => {
            setNodes(initialNodes);
            setEdges(initialEdges);
            idRef.current = 3;
          }}
          className="fixed bottom-5 left-15"
        >
          Clear
        </button>
        <div className="flex flex-col flex-1 w-1/2 max-w-100 resize-none border-l-2 border-gray-600">
          <div className="mermaid-viewport relative flex justify-center border-b-1 border-gray-600">
            <TransformWrapper
              initialScale={1}
              limitToBounds={true}
              initialPositionX={200}
              initialPositionY={100}
            >
              {() => (
                <>
                  <TransformComponent
                    wrapperClass="bg-gray-700 w-full h-full"
                    wrapperStyle={{ width: "100%" }}
                  >
                    <div className="h-150 flex justify-center relative">
                      <MermaidComponent
                        source={GenerateMermaidCode(nodes, edges, ";")}
                        id="1"
                      ></MermaidComponent>
                    </div>
                  </TransformComponent>
                  <TransformControls />
                </>
              )}
            </TransformWrapper>
          </div>

          <div className="flex-1">
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
