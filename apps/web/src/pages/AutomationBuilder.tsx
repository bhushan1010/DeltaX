import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Button, Typography, Paper, TextField, Container } from '@mui/material';
import { Save, Add, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Initial nodes for the visual builder
const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'default',
    position: { x: 250, y: 50 },
    data: { label: 'Trigger: Lead Created' },
    style: { background: '#e0f2fe', border: '1px solid #38bdf8', borderRadius: '8px', padding: '10px' }
  }
];

const initialEdges: Edge[] = [];

const AutomationBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [ruleName, setRuleName] = useState('New Automation Rule');

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addConditionNode = () => {
    const newNode: Node = {
      id: `condition-${nodes.length + 1}`,
      position: { x: 250, y: nodes.length * 100 + 50 },
      data: { label: 'Condition: Lead Score > 80' },
      style: { background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: '10px' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addActionNode = () => {
    const newNode: Node = {
      id: `action-${nodes.length + 1}`,
      position: { x: 250, y: nodes.length * 100 + 50 },
      data: { label: 'Action: Assign to Top Agent' },
      style: { background: '#dcfce7', border: '1px solid #4ade80', borderRadius: '8px', padding: '10px' }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    // Convert nodes and edges into JSON format required by the backend
    const ruleDefinition = {
      name: ruleName,
      trigger_event: 'lead_created', // simplified extraction
      conditions: nodes.filter(n => n.id.startsWith('condition')).map(n => n.data.label),
      actions: nodes.filter(n => n.id.startsWith('action')).map(n => n.data.label),
      is_active: true,
      priority: 1
    };

    console.log('Saving Rule:', ruleDefinition);
    // Here you would call the API to save the rule
    // automationRuleApi.createRule(ruleDefinition);
    
    navigate('/dashboard/lead-management');
  };

  return (
    <Container maxWidth="xl" sx={{ height: '80vh', display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard/lead-management')}>
            Back
          </Button>
          <TextField 
            variant="outlined" 
            size="small" 
            value={ruleName} 
            onChange={(e) => setRuleName(e.target.value)}
            sx={{ minWidth: 300, bgcolor: 'background.paper' }}
          />
        </Box>
        <Button variant="contained" startIcon={<Save />} color="primary" onClick={handleSave}>
          Save Rule
        </Button>
      </Box>

      <Paper sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#ccc" gap={16} />
          <MiniMap />
          <Controls />
          <Panel position="top-right">
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle2">Add Nodes</Typography>
              <Button size="small" variant="outlined" color="warning" onClick={addConditionNode} startIcon={<Add />}>
                Condition
              </Button>
              <Button size="small" variant="outlined" color="success" onClick={addActionNode} startIcon={<Add />}>
                Action
              </Button>
            </Paper>
          </Panel>
        </ReactFlow>
      </Paper>
    </Container>
  );
};

export default AutomationBuilder;