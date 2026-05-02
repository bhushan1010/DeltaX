import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Switch,
} from '@mui/material';
import {
  MoreVertical,
  Phone,
  Mail,
  Plus,
  Zap,
  Filter,
  GripVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  new: { label: 'New Leads', color: '#3b82f6', bg: '#3b82f620' },
  contacted: { label: 'Contacted', color: '#8b5cf6', bg: '#8b5cf620' },
  qualified: { label: 'Qualified', color: '#10b981', bg: '#10b98120' },
  negotiation: { label: 'Negotiation', color: '#f59e0b', bg: '#f59e0b20' },
  converted: { label: 'Converted', color: '#059669', bg: '#05966920' },
  lost: { label: 'Lost', color: '#ef4444', bg: '#ef444420' },
};

const mockLeads = {
  new: [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', source: 'website', priority: 3, assigned: null, days: 2 },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', source: 'referral', priority: 5, assigned: { name: 'Alice Brown', initials: 'AB' }, days: 1 },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', source: 'facebook', priority: 2, assigned: null, days: 3 },
  ],
  contacted: [
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', source: 'google', priority: 4, assigned: { name: 'John Smith', initials: 'JS' }, days: 1 },
    { id: 5, name: 'Charlie Davis', email: 'charlie.davis@example.com', source: 'offline', priority: 3, assigned: { name: 'Jane Wilson', initials: 'JW' }, days: 2 },
  ],
  qualified: [
    { id: 6, name: 'Diana Evans', email: 'diana.evans@example.com', source: 'website', priority: 5, assigned: { name: 'Bob Wilson', initials: 'BW' }, days: 1 },
    { id: 7, name: 'Edward Foster', email: 'edward.foster@example.com', source: 'referral', priority: 4, assigned: { name: 'Alice Brown', initials: 'AB' }, days: 2 },
  ],
  negotiation: [
    { id: 8, name: 'Fiona Garcia', email: 'fiona.garcia@example.com', source: 'google', priority: 4, assigned: { name: 'John Smith', initials: 'JS' }, days: 3 },
  ],
  converted: [
    { id: 9, name: 'George Harris', email: 'george.harris@example.com', source: 'website', priority: 5, assigned: { name: 'Jane Wilson', initials: 'JW' }, days: 0 },
  ],
  lost: [],
};

const sourceIcons: Record<string, string> = {
  website: '🌐',
  referral: '🤝',
  facebook: '📘',
  google: '🔍',
  offline: '📍',
};

const teamMembers = [
  { name: 'John Smith', initials: 'JS', leads: 12, calls: 8, meetings: 3, color: '#4f46e5' },
  { name: 'Jane Wilson', initials: 'JW', leads: 10, calls: 6, meetings: 2, color: '#10b981' },
  { name: 'Alice Brown', initials: 'AB', leads: 8, calls: 5, meetings: 2, color: '#f59e0b' },
  { name: 'Bob Johnson', initials: 'BJ', leads: 6, calls: 4, meetings: 1, color: '#8b5cf6' },
];

const automationRules = [
  { id: 1, name: 'Assign high-value leads to senior agents', active: true, description: 'When lead score >= 80, assign to agent with highest conversion rate' },
  { id: 2, name: 'Follow up on leads not contacted in 24 hours', active: false, description: 'If last_contacted_at is older than 24 hours, create follow-up task' },
  { id: 3, name: 'Send welcome email to new leads', active: true, description: 'When new lead is created, send automated welcome email' },
];

interface LeadCardProps {
  lead: typeof mockLeads.new[0];
  onDragStart?: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onDragStart }) => {
  return (
    <Card
      component={motion.div}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.15)' }}
      sx={{
        mb: 1.5,
        cursor: 'grab',
        border: '1px solid',
        borderColor: 'divider',
        '&:active': { cursor: 'grabbing' },
      }}
      onDragStart={onDragStart}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
          <IconButton size="small" sx={{ color: 'text.secondary', cursor: 'grab', p: 0.5 }}>
            <GripVertical size={14} />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {lead.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {sourceIcons[lead.source]} {lead.source}
            </Typography>
          </Box>
          <IconButton size="small">
            <MoreVertical size={14} />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          {lead.assigned ? (
            <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'primary.main' }}>
              {lead.assigned.initials}
            </Avatar>
          ) : (
            <Chip label="Unassigned" size="small" sx={{ height: 20, fontSize: 10 }} />
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Box
                key={star}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: star <= lead.priority ? 'warning.main' : 'divider',
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" sx={{ flex: 1, minWidth: 0, py: 0.5, fontSize: 11 }}>
            <Phone size={12} style={{ marginRight: 4 }} /> Call
          </Button>
          <Button size="small" sx={{ flex: 1, minWidth: 0, py: 0.5, fontSize: 11 }}>
            <Mail size={12} style={{ marginRight: 4 }} /> Email
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          {lead.days} day{lead.days !== 1 ? 's' : ''} in stage
        </Typography>
      </CardContent>
    </Card>
  );
};

const LeadManagement: React.FC = () => {
  const [leads] = useState(mockLeads);
  const [view, setView] = useState<'kanban' | 'team'>('kanban');

  const getTotalLeads = () => {
    return Object.values(leads).reduce((acc, arr) => acc + arr.length, 0);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Lead Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {getTotalLeads()} total leads across all stages
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={view === 'kanban' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setView('kanban')}
          >
            Kanban
          </Button>
          <Button
            variant={view === 'team' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setView('team')}
          >
            Team
          </Button>
          <Button variant="outlined" startIcon={<Filter size={16} />} size="small">
            Filter
          </Button>
        </Box>
      </Box>

      <AnimatePresence mode="wait">
        {view === 'kanban' ? (
          <Box
            component={motion.div}
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Kanban Board */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                minHeight: 500,
              }}
            >
              {Object.entries(statusConfig).map(([status, config]) => (
                <Box
                  key={status}
                  sx={{
                    minWidth: 280,
                    flexShrink: 0,
                  }}
                >
                  {/* Column Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                      pb: 1.5,
                      borderBottom: '2px solid',
                      borderColor: config.color,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: config.color,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {config.label}
                      </Typography>
                      <Chip
                        label={leads[status as keyof typeof leads].length}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 11,
                          bgcolor: config.bg,
                          color: config.color,
                        }}
                      />
                    </Box>
                    <IconButton size="small">
                      <Plus size={16} />
                    </IconButton>
                  </Box>

                  {/* Column Content */}
                  <Box
                    sx={{
                      minHeight: 400,
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 2,
                    }}
                  >
                    <AnimatePresence>
                      {leads[status as keyof typeof leads].map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))}
                    </AnimatePresence>
                    {leads[status as keyof typeof leads].length === 0 && (
                      <Box
                        sx={{
                          py: 4,
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        <Typography variant="body2">No leads</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Box
            component={motion.div}
            key="team"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Team Overview */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
              {teamMembers.map((member, idx) => (
                <Card
                  key={member.name}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: member.color, fontSize: 16, fontWeight: 600 }}>
                        {member.initials}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Sales Agent</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>{member.leads}</Typography>
                        <Typography variant="caption" color="text.secondary">Leads</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>{member.calls}</Typography>
                        <Typography variant="caption" color="text.secondary">Calls</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.main' }}>{member.meetings}</Typography>
                        <Typography variant="caption" color="text.secondary">Meetings</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Automation Rules */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Zap size={20} style={{ color: '#4f46e5' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Automation Rules</Typography>
                  </Box>
                  <Button variant="contained" size="small" startIcon={<Plus size={16} />}>
                    Add Rule
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {automationRules.map((rule) => (
                    <Box
                      key={rule.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.default',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: rule.active ? 'success.main' : 'text.secondary',
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{rule.name}</Typography>
                        </Box>
                        <Switch size="small" checked={rule.active} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{rule.description}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default LeadManagement;