import { useCallback, useEffect, useRef, useState } from "react";
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
import type { Edge } from "./types/Edge";
import UpdateNodeData from "./components/UpdateNodeData";
import type { MermaidType } from "./types/MermaidType";
import Cookies from "universal-cookie";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const cookies = new Cookies();

const initialNodes: MermaidType[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "1",
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
      label: "2",
      shape: "rect",
      targetConnections: 1,
      sourceConnections: 0,
    },
    type: "mermaidnode",
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = {
  mermaidnode: MermaidNode,
};

const nodeOrigin: NodeOrigin = [0.5, 0];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<MermaidType>(
    cookies.get("nodes") || initialNodes
  );
  const [edges, setEdges] = useEdgesState<Edge>(
    cookies.get("edges") || initialEdges
  );
  const { screenToFlowPosition } = useReactFlow();
  const { addNodes } = useReactFlow();
  const { addEdges } = useReactFlow();
  const { getNode } = useReactFlow();

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    cookies.set("nodes", nodes);
    cookies.set("edges", edges);
  }, [nodes, edges]);

  const onEdgesChange: OnEdgesChange<Edge> = useCallback(
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
    [setEdges]
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
          data: { label: `${id}`, shape: `rect` },
          origin: [0.5, 0.0],
          type: "mermaidnode",
        };

        const newEdge: Edge = {
          id: `e${connectionState.fromNode.id}-${id}`,
          source: isFromSource ? connectionState.fromHandle.nodeId : newNode.id,
          target: isFromSource ? newNode.id : connectionState.fromHandle.nodeId,
        };

        addNodes(newNode);
        addEdges(newEdge);
      }
    },
    [screenToFlowPosition]
  );

  return (
    <>
      <div className="flex resize-none">
        <div style={{ width: "100vw", height: "100vh" }} className="w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
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
        <div className="flex flex-col w-1/2 resize-none">
          <div className="mermaid-viewport flex justify-center">
            <TransformWrapper
              initialScale={1}
              limitToBounds={false}
              centerOnInit
              initialPositionX={200}
              initialPositionY={100}
            >
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
            </TransformWrapper>
          </div>

          <div className="whitespace-pre-line leading-8 font-mono">
            {GenerateMermaidCode(nodes, edges, "\n")}
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
