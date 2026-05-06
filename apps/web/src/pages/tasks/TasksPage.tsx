import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchAllTasks, fetchTaskStats } from '../../store/slices/taskSlice';
import { taskApi, userApi, projectApi } from '../../services/api';
import { toast } from 'sonner';
import { canDeleteTask } from '../../lib/utils';
import { Plus, Trash2, Pencil, CheckCircle2, Clock, CircleDot, ListTodo, AlertTriangle, X } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  TODO: {
    label: 'To Do',
    color: '#64748b',
    bg: '#f1f5f9',
    icon: <ListTodo size={14} />,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: '#3b82f6',
    bg: '#eff6ff',
    icon: <CircleDot size={14} />,
  },
  REVIEW: {
    label: 'Review',
    color: '#f59e0b',
    bg: '#fffbeb',
    icon: <Clock size={14} />,
  },
  DONE: {
    label: 'Done',
    color: '#10b981',
    bg: '#ecfdf5',
    icon: <CheckCircle2 size={14} />,
  },
};



interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  dueDate: string;
  status: string;
}

const EMPTY_FORM: TaskFormData = {
  title: '',
  description: '',
  projectId: '',
  assigneeId: '',
  dueDate: '',
  status: 'TODO',
};

export default function TasksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, stats, isLoading } = useSelector((state: RootState) => state.tasks);
  const user = useSelector((state: RootState) => state.auth.user);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState<TaskFormData>(EMPTY_FORM);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAllTasks());
    dispatch(fetchTaskStats());
    // load users and projects for the form dropdowns
    userApi.getUsers().then(r => setAllUsers(r.data)).catch(() => {});
    projectApi.getProjects().then(r => setAllProjects(r.data)).catch(() => {});
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchAllTasks());
    dispatch(fetchTaskStats());
  };

  const openCreate = () => {
    setEditingTask(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      projectId: task.project?.id?.toString() || '',
      assigneeId: task.assignee?.id?.toString() || '',
      dueDate: task.due_date ? task.due_date.substring(0, 10) : '',
      status: task.status || 'TODO',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Task title is required');
      return;
    }
    if (!editingTask && !formData.projectId) {
      toast.error('Project is required');
      return;
    }
    try {
      if (editingTask) {
        await taskApi.updateTask(editingTask.id, {
          title: formData.title,
          description: formData.description,
          status: formData.status,
          due_date: formData.dueDate || null,
          assignee: formData.assigneeId ? { id: parseInt(formData.assigneeId) } : null,
        });
        toast.success('Task updated');
      } else {
        await taskApi.createTask({
          title: formData.title,
          description: formData.description,
          projectId: parseInt(formData.projectId),
          assigneeId: formData.assigneeId ? parseInt(formData.assigneeId) : undefined,
          dueDate: formData.dueDate || undefined,
        });
        toast.success('Task created');
      }
      setShowModal(false);
      refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskApi.deleteTask(taskId);
      toast.success('Task deleted');
      refresh();
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      refresh();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const isOverdue = (task: any) =>
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'DONE';

  const filtered = tasks.filter(t => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterProject && t.project?.id?.toString() !== filterProject) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all tasks across your projects.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
          style={{ background: '#4f46e5' }}
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats?.total ?? 0, color: '#6366f1', bg: '#eef2ff' },
          { label: 'In Progress', value: stats?.inProgress ?? 0, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'My Tasks', value: stats?.myTasks ?? 0, color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Overdue', value: stats?.overdue ?? 0, color: '#ef4444', bg: '#fef2f2' },
        ].map(k => (
          <div key={k.label} className="bg-card border border-border rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: k.bg }}>
              <span className="text-lg font-bold" style={{ color: k.color }}>{k.value}</span>
            </div>
            <span className="text-sm text-muted-foreground">{k.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {allProjects.map((p: any) => (
            <option key={p.id} value={p.id.toString()}>{p.name}</option>
          ))}
        </select>
        {(filterStatus || filterProject) && (
          <button
            onClick={() => { setFilterStatus(''); setFilterProject(''); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X size={13} /> Clear
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Task Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <ListTodo className="mx-auto h-10 w-10 text-muted-foreground opacity-30 mb-3" />
          <p className="text-muted-foreground">No tasks found. Create one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Task', 'Project', 'Assignee', 'Status', 'Due Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(task => (
                <tr key={task.id} className="bg-card hover:bg-muted/20 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {isOverdue(task) && (
                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.project?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {task.assignee?.full_name || task.assignee?.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded border border-border bg-background text-xs px-1.5 py-0.5"
                      value={task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {task.due_date ? (
                      <span
                        className="text-xs"
                        style={{ color: isOverdue(task) ? '#ef4444' : undefined }}
                      >
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(task)}
                        className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                        title="Edit task"
                      >
                        <Pencil size={14} />
                      </button>
                      {canDeleteTask(user?.role) && (
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500"
                          title="Delete task"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={formData.title}
                  onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                  placeholder="Task title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  value={formData.description}
                  onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {!editingTask && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Project <span className="text-red-500">*</span></label>
                    <select
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={formData.projectId}
                      onChange={e => setFormData(f => ({ ...f, projectId: e.target.value }))}
                    >
                      <option value="">Select project</option>
                      {allProjects.map((p: any) => (
                        <option key={p.id} value={p.id.toString()}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={formData.status}
                    onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                  >
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assignee</label>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={formData.assigneeId}
                    onChange={e => setFormData(f => ({ ...f, assigneeId: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {allUsers.map((u: any) => (
                      <option key={u.id} value={u.id.toString()}>
                        {u.full_name || u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={formData.dueDate}
                    onChange={e => setFormData(f => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md text-white font-medium"
                  style={{ background: '#4f46e5' }}
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
