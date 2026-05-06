import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTaskStats } from '../../store/slices/taskSlice';
import { fetchProjects } from '../../store/slices/projectSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle, Clock, AlertCircle, ListTodo, Users, FolderKanban } from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { stats } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);

  useEffect(() => {
    dispatch(fetchTaskStats());
    dispatch(fetchProjects());
  }, [dispatch]);

  const taskStatusData = stats ? [
    { name: 'To Do', value: stats.todo, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgress, color: '#3b82f6' },
    { name: 'Review', value: stats.review, color: '#f59e0b' },
    { name: 'Done', value: stats.done, color: '#10b981' },
  ] : [];

  // Compute completion rate across all projects' tasks
  const completionRate = stats && stats.total > 0
    ? ((stats.done / stats.total) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}! Here's your overview.</p>
      </div>

      {/* Task KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats?.total || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#e0e7ff' }}>
                <ListTodo size={24} style={{ color: '#4f46e5' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Tasks</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats?.myTasks || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#dbeafe' }}>
                <Users size={24} style={{ color: '#3b82f6' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats?.inProgress || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#fef3c7' }}>
                <Clock size={24} style={{ color: '#f59e0b' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stats?.overdue || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#fee2e2' }}>
                <AlertCircle size={24} style={{ color: '#ef4444' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card style={{ borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Progress */}
        <Card style={{ borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">To Do</span>
                  <span className="text-sm font-medium">{stats?.todo || 0}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${stats?.total ? (stats.todo / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="text-sm font-medium">{stats?.inProgress || 0}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats?.total ? (stats.inProgress / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Review</span>
                  <span className="text-sm font-medium">{stats?.review || 0}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${stats?.total ? (stats.review / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">Done</span>
                  <span className="text-sm font-medium">{stats?.done || 0}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats?.total ? (stats.done / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row — G6 fix: replaced Leads/Conversion Rate with Projects KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#dcfce7' }}>
                <CheckCircle size={24} style={{ color: '#10b981' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold text-foreground">{stats?.done || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* G6 fix: Projects count instead of Leads */}
        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#ede9fe' }}>
                <FolderKanban size={24} style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Projects</p>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* G6 fix: Completion Rate instead of Conversion Rate */}
        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#d1fae5' }}>
                <AlertCircle size={24} style={{ color: '#059669' }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
