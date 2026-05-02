import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Edit,
  FileText,
  Paperclip,
  TrendingUp,
  Flag,
} from 'lucide-react';
import { motion } from 'framer-motion';

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: '#3b82f620', text: '#3b82f6' },
  contacted: { bg: '#8b5cf620', text: '#8b5cf6' },
  qualified: { bg: '#10b98120', text: '#10b981' },
  negotiation: { bg: '#f59e0b20', text: '#f59e0b' },
  converted: { bg: '#05966920', text: '#059669' },
  not_interested: { bg: '#6b728020', text: '#6b7280' },
  lost: { bg: '#ef444420', text: '#ef4444' },
};

const activityTypes: Record<string, { color: string; icon: React.ReactNode }> = {
  call: { color: '#10b981', icon: <Phone size={14} /> },
  email: { color: '#4f46e5', icon: <Mail size={14} /> },
  meeting: { color: '#f59e0b', icon: <Calendar size={14} /> },
  note: { color: '#8b5cf6', icon: <FileText size={14} /> },
  status_change: { color: '#64748b', icon: <TrendingUp size={14} /> },
  assignment: { color: '#06b6d4', icon: <User size={14} /> },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
    {value === index && children}
  </Box>
);

const mockLead = {
  id: '1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  source: 'website',
  status: 'qualified',
  priority: 85,
  interested_car_model: 'Tesla Model 3',
  budget_min: 35000,
  budget_max: 45000,
  preferred_contact_time: 'Afternoon',
  financing_needed: true,
  trade_in_vehicle: 'Honda Civic 2018',
  assigned_to: {
    id: '2',
    full_name: 'Jane Smith',
    email: 'jane.smith@hsrmotors.com',
  },
  assigned_at: '2026-05-01T10:30:00Z',
  lead_score: 78,
  tags: ['high-value', 'electric-vehicle', 'test-drive'],
  notes: 'Interested in test drive next week. Asked about charging infrastructure. Budget allows for premium trim.',
  first_contacted_at: '2026-04-25T14:00:00Z',
  last_contacted_at: '2026-05-01T09:15:00Z',
  expected_close_date: '2026-06-15',
  created_at: '2026-04-25T14:00:00Z',
  updated_at: '2026-05-01T09:15:00Z',
};

const activities = [
  { id: 1, type: 'call', user: 'Jane Smith', action: 'Phone call', detail: 'Discussed financing options', outcome: 'Positive, follow-up scheduled', date: 'May 1, 2026 • 9:15 AM' },
  { id: 2, type: 'email', user: 'Jane Smith', action: 'Sent email', detail: 'Sent brochure and pricing details', outcome: 'Lead opened email', date: 'Apr 30, 2026 • 2:30 PM' },
  { id: 3, type: 'meeting', user: 'Jane Smith', action: 'Scheduled test drive', detail: 'Test drive scheduled for May 5', outcome: 'Confirmed', date: 'Apr 28, 2026 • 11:00 AM' },
  { id: 4, type: 'status_change', user: 'System', action: 'Status changed', detail: 'From contacted to qualified', outcome: 'Lead score increased to 78', date: 'Apr 27, 2026 • 4:00 PM' },
  { id: 5, type: 'assignment', user: 'System', action: 'Assigned to', detail: 'Jane Smith', outcome: '', date: 'May 1, 2026 • 10:30 AM' },
  { id: 6, type: 'note', user: 'Jane Smith', action: 'Added note', detail: 'Lead prefers afternoon appointments', outcome: '', date: 'Apr 25, 2026 • 2:00 PM' },
];

const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setLead(mockLead);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lead) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" gutterBottom>Lead not found</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} variant="text">
            Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Lead Details
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Edit size={16} />}>
          Edit
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Main Content */}
        <Box sx={{ flex: 8 }}>
          {/* Lead Header Card */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 3, mb: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {lead.first_name[0]}{lead.last_name[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
<Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {lead.first_name} {lead.last_name}
                  </Typography>
                  <Chip
                    label={lead.source}
                    size="small"
                    sx={{ bgcolor: '#4f46e515', color: '#4f46e5' }}
                  />
                  <Chip
                    label={lead.status}
                    size="small"
                    sx={{
                      bgcolor: statusColors[lead.status]?.bg,
                      color: statusColors[lead.status]?.text,
                      textTransform: 'capitalize',
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Mail size={16} />
                    <Typography variant="body2">{lead.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone size={16} />
                    <Typography variant="body2">{lead.phone}</Typography>
                  </Box>
                </Box>
              </Box>
              {/* Lead Score Gauge */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                  <CircularProgress
                    variant="determinate"
                    value={lead.lead_score}
                    size={70}
                    thickness={6}
                    sx={{
                      color: lead.lead_score >= 70 ? '#10b981' : lead.lead_score >= 40 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {lead.lead_score}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Lead Score
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                px: 2,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
              }}
            >
              <Tab label="Overview" />
              <Tab label="Activity" />
              <Tab label="Notes" />
              <Tab label="Files" />
              <Tab label="Related" />
            </Tabs>
          </Paper>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Lead Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Interested Car Model</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{lead.interested_car_model}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Budget Range</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${lead.budget_min?.toLocaleString()} - ${lead.budget_max?.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Preferred Contact Time</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{lead.preferred_contact_time}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Financing Needed</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{lead.financing_needed ? 'Yes' : 'No'}</Typography>
                </Box>
                <Box sx={{ gridColumn: 'span 2' }}>
                  <Typography variant="caption" color="text.secondary">Trade-in Vehicle</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{lead.trade_in_vehicle || 'None'}</Typography>
                </Box>
              </Box>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Activity Timeline</Typography>
              <Box sx={{ position: 'relative', ml: 3 }}>
                {/* Timeline line */}
                <Box sx={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, bgcolor: 'divider' }} />
                {activities.map((activity, idx) => (
                  <Box
                    key={activity.id}
                    component={motion.div}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    sx={{ position: 'relative', mb: 3, pl: 4 }}
                  >
                    {/* Timeline dot */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 2,
                        top: 4,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        bgcolor: activityTypes[activity.type]?.color || '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {activityTypes[activity.type]?.icon}
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.action}</Typography>
                        <Chip
                          label={activity.type.replace('_', ' ')}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: 10,
                            bgcolor: `${activityTypes[activity.type]?.color}20`,
                            color: activityTypes[activity.type]?.color,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">{activity.detail}</Typography>
                      {activity.outcome && (
                        <Typography variant="caption" sx={{ color: 'success.main' }}>
                          Outcome: {activity.outcome}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {activity.date}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                Add Activity
              </Button>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Notes</Typography>
                <Button size="small" variant="outlined">Add Note</Button>
              </Box>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
                <Typography variant="body2">{lead.notes}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Added by Jane Smith • May 1, 2026
                </Typography>
              </Box>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', border: '2px dashed', borderColor: 'divider' }}>
                <Paperclip size={32} style={{ color: '#94a3b8' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  No files attached yet
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 2 }}>
                  Upload File
                </Button>
              </Paper>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Related Leads</Typography>
              <Typography variant="body2" color="text.secondary">No related leads found</Typography>
            </Paper>
          </TabPanel>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 4 }}>
          {/* Quick Actions */}
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{ p: 3, mb: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Quick Actions</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button variant="contained" startIcon={<Phone size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Call
              </Button>
              <Button variant="outlined" startIcon={<Mail size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Email
              </Button>
              <Button variant="outlined" startIcon={<MessageSquare size={18} />} sx={{ justifyContent: 'flex-start' }}>
                SMS
              </Button>
              <Button variant="outlined" startIcon={<Calendar size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Schedule
              </Button>
              <Button variant="contained" color="success" startIcon={<TrendingUp size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Convert
              </Button>
              <Button variant="outlined" color="error" startIcon={<Flag size={18} />} sx={{ justifyContent: 'flex-start' }}>
                Mark Lost
              </Button>
            </Box>
          </Paper>

          {/* Assignment */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Assignment</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {lead.assigned_to.full_name.split(' ').map((n: string) => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{lead.assigned_to.full_name}</Typography>
                <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Since {new Date(lead.assigned_at).toLocaleDateString()}
            </Typography>
          </Paper>

          {/* Tags */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {lead.tags.map((tag: string) => (
                <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#4f46e515', color: '#4f46e5' }} />
              ))}
              <Chip label="+ Add" size="small" variant="outlined" sx={{ cursor: 'pointer' }} />
            </Box>
          </Paper>

          {/* Status Workflow */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Status</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={lead.status}
                sx={{
                  bgcolor: statusColors[lead.status]?.bg,
                  color: statusColors[lead.status]?.text,
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Expected close: {new Date(lead.expected_close_date).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LeadDetails;