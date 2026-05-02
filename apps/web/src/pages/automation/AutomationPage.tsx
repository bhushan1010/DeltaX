import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addRule, updateRule, setSelectedRule } from '../../store/slices/automationSlice';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Trigger: Lead Created' },
    position: { x: 250, y: 50 },
    style: { background: '#4f46e5', color: 'white', borderRadius: '8px', padding: '12px' },
  },
];

const initialEdges: Edge[] = [];

export default function AutomationPage() {
  const dispatch = useDispatch();
  const rules = useSelector((state: RootState) => state.automation.rules);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeType, setSelectedNodeType] = useState<'trigger' | 'action'>('trigger');
  const [ruleName, setRuleName] = useState('New Automation Rule');
  const [ruleDescription, setRuleDescription] = useState('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNode = (type: 'trigger' | 'action', label: string) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: type === 'trigger' ? 'input' : 'default',
      data: { label },
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      style: {
        background: type === 'trigger' ? '#4f46e5' : '#10b981',
        color: 'white',
        borderRadius: '8px',
        padding: '12px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    const rule = {
      id: Date.now().toString(),
      name: ruleName,
      description: ruleDescription,
      isActive: true,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addRule(rule));
    toast.success('Automation rule saved successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automation Rules</h1>
          <p className="text-muted-foreground">Create automated workflows for lead management</p>
        </div>
        <Button
          onClick={handleSave}
          style={{ background: '#4f46e5', borderRadius: '8px' }}
        >
          <Save size={20} className="mr-2" />
          Save Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Node Builder Panel */}
        <Card style={{ borderRadius: '8px' }} className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add Nodes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruleDescription">Description</Label>
              <Input
                id="ruleDescription"
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
              />
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium mb-3 text-foreground">Triggers</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('trigger', 'Lead Created')}
                >
                  <Plus size={16} className="mr-2" />
                  Lead Created
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('trigger', 'Status Changed')}
                >
                  <Plus size={16} className="mr-2" />
                  Status Changed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('trigger', 'Lead Assigned')}
                >
                  <Plus size={16} className="mr-2" />
                  Lead Assigned
                </Button>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-medium mb-3 text-foreground">Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('action', 'Send Email')}
                >
                  <Plus size={16} className="mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('action', 'Notify Agent')}
                >
                  <Plus size={16} className="mr-2" />
                  Notify Agent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('action', 'Update Status')}
                >
                  <Plus size={16} className="mr-2" />
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addNode('action', 'Create Task')}
                >
                  <Plus size={16} className="mr-2" />
                  Create Task
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow Canvas */}
        <Card style={{ borderRadius: '8px' }} className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Workflow Canvas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ height: '600px' }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
              >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Rules List */}
      <Card style={{ borderRadius: '8px' }}>
        <CardHeader>
          <CardTitle>Saved Automation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No automation rules created yet. Create your first rule above.
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border border-border rounded"
                  style={{ borderRadius: '8px' }}
                >
                  <div>
                    <h3 className="font-medium text-foreground">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    <p className="text-xs mt-1 text-muted-foreground/70">
                      {rule.nodes.length} nodes, {rule.edges.length} connections
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: rule.isActive ? '#10b981' : '#6b7280' }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
