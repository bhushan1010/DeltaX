import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Users, Target, Activity, DollarSign, Phone, Mail, UserPlus } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';
import { motion } from 'framer-motion';

const kpiData = [
  { label: 'Total Leads', value: '1,234', change: 12, positive: true, icon: Users, color: '#4f46e5', sparkline: [40, 35, 50, 45, 60, 55, 70] },
  { label: 'Conversion Rate', value: '24.5%', change: 3.2, positive: true, icon: Target, color: '#10b981', sparkline: [20, 22, 21, 24, 23, 25, 24.5] },
  { label: 'Active Leads', value: '456', change: -2, positive: false, icon: Activity, color: '#f59e0b', sparkline: [50, 48, 52, 45, 47, 44, 46] },
  { label: 'Revenue', value: '$2.4M', change: 8.5, positive: true, icon: DollarSign, color: '#8b5cf6', sparkline: [30, 35, 40, 38, 45, 50, 55] },
];

const funnelData = [
  { name: 'New', value: 400, fill: '#3b82f6' },
  { name: 'Contacted', value: 300, fill: '#8b5cf6' },
  { name: 'Qualified', value: 200, fill: '#10b981' },
  { name: 'Negotiation', value: 100, fill: '#f59e0b' },
  { name: 'Converted', value: 50, fill: '#059669' },
];

const sourceData = [
  { name: 'Website', value: 35, color: '#4f46e5' },
  { name: 'Referral', value: 25, color: '#10b981' },
  { name: 'Facebook', value: 20, color: '#f59e0b' },
  { name: 'Google', value: 15, color: '#8b5cf6' },
  { name: 'Offline', value: 5, color: '#64748b' },
];

const trendData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  new: Math.floor(Math.random() * 20) + 10,
  converted: Math.floor(Math.random() * 10) + 5,
  qualified: Math.floor(Math.random() * 15) + 8,
}));

const leaderboard = [
  { name: 'John Smith', initials: 'JS', leads: 45, conversion: 32, color: '#4f46e5' },
  { name: 'Jane Wilson', initials: 'JW', leads: 38, conversion: 28, color: '#10b981' },
  { name: 'Bob Johnson', initials: 'BJ', leads: 32, conversion: 25, color: '#f59e0b' },
  { name: 'Alice Brown', initials: 'AB', leads: 28, conversion: 22, color: '#8b5cf6' },
  { name: 'Charlie Davis', initials: 'CD', leads: 24, conversion: 18, color: '#64748b' },
];

const activities = [
  { id: 1, user: 'John Smith', initials: 'JS', action: 'assigned', target: 'new lead to Jane', time: '2 min ago', type: 'assign', color: '#4f46e5' },
  { id: 2, user: 'Jane Wilson', initials: 'JW', action: 'updated', target: 'lead status to Qualified', time: '15 min ago', type: 'status', color: '#10b981' },
  { id: 3, user: 'Bob Johnson', initials: 'BJ', action: 'logged', target: 'call with lead', time: '1 hour ago', type: 'call', color: '#f59e0b' },
  { id: 4, user: 'Alice Brown', initials: 'AB', action: 'sent', target: 'email to lead', time: '2 hours ago', type: 'email', color: '#8b5cf6' },
];

const activityIcons: Record<string, React.ReactNode> = {
  assign: <UserPlus size={14} />,
  status: <Target size={14} />,
  call: <Phone size={14} />,
  email: <Mail size={14} />,
};

const KPICard: React.FC<{ data: typeof kpiData[0]; index: number }> = ({ data, index }) => {
  const Icon = data.icon;
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)',
        overflow: 'visible',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 30px -5px ${data.color}30`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              bgcolor: `${data.color}15`,
              color: data.color,
            }}
          >
            <Icon size={20} />
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              bgcolor: data.positive ? '#10b98115' : '#ef444415',
              color: data.positive ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {data.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(data.change)}%
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          {data.label}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 32,
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {data.value}
        </Typography>
        <Box sx={{ mt: 2, height: 30 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.sparkline.map((v, i) => ({ x: i, y: v }))}>
              <defs>
                <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={data.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={data.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke={data.color}
                strokeWidth={2}
                fill={`url(#gradient-${index})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with your leads today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* KPI Cards */}
        {kpiData.map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={kpi.label}>
            <KPICard data={kpi} index={idx} />
          </Grid>
        ))}

        {/* Charts Row */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            sx={{ height: 380 }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Conversion Funnel
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="#64748b" stroke="none" dataKey="name" />
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            sx={{ height: 380 }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Lead Sources
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', height: 'calc(100% - 48px)' }}>
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ flex: 1, pl: 2 }}>
                  {sourceData.map((source) => (
                    <Box key={source.name} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: source.color, mr: 1.5 }} />
                      <Typography variant="body2" sx={{ flex: 1 }}>{source.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{source.value}%</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* New Cards Row */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            sx={{ height: 320 }}
          >
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Lead Trends (30 Days)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: '#4f46e5' }} />
                    <Typography variant="caption" color="text.secondary">New</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: '#10b981' }} />
                    <Typography variant="caption" color="text.secondary">Qualified</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: 2, bgcolor: '#f59e0b' }} />
                    <Typography variant="caption" color="text.secondary">Converted</Typography>
                  </Box>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <Tooltip />
                  <Area type="monotone" dataKey="new" stroke="#4f46e5" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} />
                  <Area type="monotone" dataKey="qualified" stroke="#10b981" fillOpacity={1} fill="url(#colorQualified)" strokeWidth={2} />
                  <Area type="monotone" dataKey="converted" stroke="#f59e0b" fillOpacity={1} fill="url(#colorConverted)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            sx={{ height: 320 }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Team Leaderboard
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {leaderboard.map((member, idx) => (
                  <Box key={member.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      sx={{
                        width: 20,
                        fontWeight: 700,
                        color: idx < 3 ? 'primary.main' : 'text.secondary',
                        fontSize: 14,
                      }}
                    >
                      {idx + 1}
                    </Typography>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: member.color,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {member.initials}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {member.name}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={member.conversion}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': { bgcolor: member.color },
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {member.leads}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.conversion}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Activity Feed */}
        <Grid size={12}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  View All
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activities.map((activity, idx) => (
                  <Box
                    key={activity.id}
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: activity.color,
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {activity.initials}
                      </Avatar>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          p: 0.5,
                          borderRadius: '50%',
                          bgcolor: 'background.paper',
                          border: '2px solid',
                          borderColor: 'background.paper',
                          color: activity.color,
                        }}
                      >
                        {activityIcons[activity.type]}
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 600 }}>{activity.user}</Box>
                        {' '}{activity.action}{' '}
                        <Box component="span" sx={{ color: 'primary.main', fontWeight: 500 }}>
                          {activity.target}
                        </Box>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={activity.type}
                      size="small"
                      sx={{
                        bgcolor: `${activity.color}15`,
                        color: activity.color,
                        fontWeight: 500,
                        fontSize: 11,
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Outlet />
    </Box>
  );
};

export default Dashboard;