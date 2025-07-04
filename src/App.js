
import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Handle,
  Position,
  useReactFlow,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import dagre from 'dagre';

let id = 0;
const getId = () => `node_${id++}`;

const nodeWidth = 172;
const nodeHeight = 36;
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const layoutElements = (nodes, edges, direction = 'LR') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    return node;
  });
};

const CustomNode = ({ data }) => (
  <div className="custom-node">
    <Handle type="target" position={Position.Left} id="left" />
    <div className="custom-label">{data.label}</div>
    <Handle type="source" position={Position.Right} id="right" />
  </div>
);

const nodeTypes = { custom: CustomNode };

function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isValidDag, setIsValidDag] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const { fitView } = useReactFlow();

  const onConnect = useCallback(
    (params) => {
      if (params.source === params.target) return;
      if (params.sourceHandle === params.targetHandle) return;

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'default',
            animated: true,
            markerEnd: {
              type: 'arrowclosed',
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const handleAddNode = () => {
    const label = prompt('Enter node label');
    if (!label) return;
    const newNode = {
      id: getId(),
      type: 'custom',
      data: { label },
      position: { x: Math.random() * 250, y: Math.random() * 250 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDelete = useCallback(
    (event) => {
      if (event.key === 'Delete') {
        setNodes((nds) => nds.filter((n) => !n.selected));
        setEdges((eds) => eds.filter((e) => !e.selected));
      }
    },
    [setNodes, setEdges]
  );

  const validateDag = useCallback(() => {
    if (nodes.length < 2) {
      setIsValidDag(false);
      setValidationMessage('At least two nodes required.');
      return;
    }
    const graph = {};
    nodes.forEach((n) => (graph[n.id] = []));
    edges.forEach((e) => graph[e.source].push(e.target));

    const visited = new Set();
    const stack = new Set();

    const hasCycle = (node) => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      stack.add(node);
      for (const neighbor of graph[node]) {
        if (hasCycle(neighbor)) return true;
      }
      stack.delete(node);
      return false;
    };

    for (const node of nodes.map((n) => n.id)) {
      if (hasCycle(node)) {
        setIsValidDag(false);
        setValidationMessage('Cycle detected in DAG.');
        return;
      }
    }

    const connected = nodes.every((node) =>
      edges.some((e) => e.source === node.id || e.target === node.id)
    );

    if (!connected) {
      setIsValidDag(false);
      setValidationMessage('All nodes must be connected.');
      return;
    }

    setIsValidDag(true);
    setValidationMessage('Valid DAG');
  }, [nodes, edges]);

  useEffect(() => {
    window.addEventListener('keydown', handleDelete);
    return () => window.removeEventListener('keydown', handleDelete);
  }, [handleDelete]);

  useEffect(() => {
    validateDag();
  }, [nodes, edges, validateDag]);

  const handleAutoLayout = () => {
    const laidOutNodes = layoutElements(nodes, edges);
    setNodes([...laidOutNodes]);
    setTimeout(() => fitView(), 100);
  };

  return (
    <div style={{ height: '100vh' }}>
      <button className='addNode' onClick={handleAddNode}>Add Node</button>
      <button className='autoLayout' onClick={handleAutoLayout}>Auto Layout</button>
      <span style={{ marginLeft: 10 }}>
        {isValidDag ? '✅' : '❌'} {validationMessage}
      </span>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}

 function App() {
  return (
    <ReactFlowProvider>
      <FlowEditor />
    </ReactFlowProvider>
  );
}

export default App
