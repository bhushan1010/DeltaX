import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTasks } from '../../store/slices/taskSlice';
import { Button } from '../../components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { taskApi, projectApi } from '../../services/api';
import { toast } from 'sonner';

export default function ProjectDetailPage({ onNavigate, projectId }: { onNavigate: (page: string) => void, projectId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const [project, setProject] = useState<any>(null);
  
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject();
      dispatch(fetchTasks(parseInt(projectId)));
    }
  }, [projectId, dispatch]);

  const loadProject = async () => {
    try {
      const res = await projectApi.getProjectById(parseInt(projectId));
      setProject(res.data);
    } catch (err) {
      toast.error('Failed to load project details');
      onNavigate('projects');
    }
  };

  const handleCreateTask = async () => {
    try {
      if (!newTaskTitle) {
        toast.error('Task title is required');
        return;
      }
      await taskApi.createTask({
        title: newTaskTitle,
        description: newTaskDesc,
        projectId: parseInt(projectId)
      });
      toast.success('Task created successfully');
      setIsCreatingTask(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      dispatch(fetchTasks(parseInt(projectId)));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      dispatch(fetchTasks(parseInt(projectId)));
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  if (!project) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  const columns = [
    { id: 'TODO', label: 'To Do' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'REVIEW', label: 'Review' },
    { id: 'DONE', label: 'Done' }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => onNavigate('projects')}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setIsCreatingTask(true)} className="gap-2">
            <Plus size={16} /> Add Task
          </Button>
        </div>
      </div>

      {isCreatingTask && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Task Title</label>
              <input
                type="text"
                className="w-full rounded-md border border-border bg-background px-3 py-2"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full rounded-md border border-border bg-background px-3 py-2"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setIsCreatingTask(false)}>Cancel</Button>
              <Button onClick={handleCreateTask}>Save Task</Button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Kanban Board (CSS Grid) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 overflow-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="bg-muted/30 rounded-lg p-4 flex flex-col min-h-[500px]">
            <h3 className="font-semibold mb-4 flex justify-between items-center text-sm uppercase tracking-wider text-muted-foreground">
              {column.label}
              <span className="bg-background px-2 py-1 rounded text-xs">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </h3>
            
            <div className="space-y-3 flex-1">
              {tasks.filter(t => t.status === column.id).map(task => (
                <div key={task.id} className="bg-card border border-border p-4 rounded shadow-sm">
                  <h4 className="font-medium mb-2">{task.title}</h4>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
                  
                  <select 
                    className="w-full text-xs bg-background border border-border rounded p-1"
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
