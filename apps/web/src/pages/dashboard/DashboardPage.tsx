import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

export default function DashboardPage() {
  const leads = useSelector((state: RootState) => state.leads.leads);
  const user = useSelector((state: RootState) => state.auth.user);

  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors: Record<string, string> = {
    'New': '#3b82f6',
    'Contacted': '#8b5cf6',
    'Qualified': '#10b981',
    'Negotiation': '#f59e0b',
    'Converted': '#059669',
    'Not Interested': '#6b7280',
    'Lost': '#ef4444',
  };

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status],
  }));

  const monthlyData = [
    { month: 'Jan', leads: 45, converted: 12 },
    { month: 'Feb', leads: 52, converted: 15 },
    { month: 'Mar', leads: 48, converted: 14 },
    { month: 'Apr', leads: 61, converted: 18 },
    { month: 'May', leads: 38, converted: 8 },
  ];

  const conversionRate = leads.length > 0
    ? ((leads.filter(l => l.status === 'Converted').length / leads.length) * 100).toFixed(1)
    : '0';

  const totalRevenue = leads
    .filter(l => l.status === 'Converted')
    .reduce((sum, l) => sum + (l.budget || 0), 0);

  const topAgents = [
    { name: 'Sarah Johnson', leads: 24, conversions: 8 },
    { name: 'Mike Chen', leads: 19, conversions: 6 },
    { name: 'Lisa Martinez', leads: 15, conversions: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your performance overview.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {leads.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ background: '#dbeafe' }}>
                <Users size={24} style={{ color: '#3b82f6' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {conversionRate}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ background: '#dcfce7' }}>
                <Target size={24} style={{ color: '#10b981' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  ${(totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ background: '#fef3c7' }}>
                <DollarSign size={24} style={{ color: '#f59e0b' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderRadius: '8px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {leads.filter(l => ['Qualified', 'Negotiation'].includes(l.status)).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                   style={{ background: '#e0e7ff' }}>
                <TrendingUp size={24} style={{ color: '#4f46e5' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <Card style={{ borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card style={{ borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle>Monthly Lead Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  name="Total Leads"
                />
                <Line
                  type="monotone"
                  dataKey="converted"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Converted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Agents */}
      <Card style={{ borderRadius: '8px' }}>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground">Agent Name</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Total Leads</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Conversions</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map((agent, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="py-3 px-4 text-foreground">{agent.name}</td>
                    <td className="py-3 px-4 text-foreground">{agent.leads}</td>
                    <td className="py-3 px-4 text-foreground">{agent.conversions}</td>
                    <td className="py-3 px-4" style={{ color: '#10b981' }}>
                      {((agent.conversions / agent.leads) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
