import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import {
  Button,
  TextField,
  Box,
  Typography,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Select,
  FormControl,
  InputAdornment,
  Skeleton,
} from '@mui/material';
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  MoreVertical,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { fetchLeads, setLeadsFilters, setLeadsPagination } from '../store/slices/leadsSlice';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors: Record<string, { bg: string; text: string }> = {
  new: { bg: '#3b82f620', text: '#3b82f6' },
  contacted: { bg: '#8b5cf620', text: '#8b5cf6' },
  qualified: { bg: '#10b98120', text: '#10b981' },
  negotiation: { bg: '#f59e0b20', text: '#f59e0b' },
  converted: { bg: '#05966920', text: '#059669' },
  not_interested: { bg: '#6b728020', text: '#6b7280' },
  lost: { bg: '#ef444420', text: '#ef4444' },
};

const sourceIcons: Record<string, string> = {
  website: '🌐',
  referral: '🤝',
  facebook: '📘',
  google: '🔍',
  offline: '📍',
};

const mockLeads = [
  { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone: '+1 234 567 8901', source: 'website', status: 'new', priority: 3, assigned_to: { full_name: 'Jane Wilson' }, last_contacted: '2 hours ago' },
  { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone: '+1 234 567 8902', source: 'referral', status: 'qualified', priority: 5, assigned_to: { full_name: 'John Smith' }, last_contacted: '1 day ago' },
  { id: 3, first_name: 'Bob', last_name: 'Johnson', email: 'bob.johnson@example.com', phone: '+1 234 567 8903', source: 'facebook', status: 'contacted', priority: 2, assigned_to: null, last_contacted: '3 hours ago' },
  { id: 4, first_name: 'Alice', last_name: 'Brown', email: 'alice.brown@example.com', phone: '+1 234 567 8904', source: 'google', status: 'negotiation', priority: 4, assigned_to: { full_name: 'Bob Wilson' }, last_contacted: '5 hours ago' },
  { id: 5, first_name: 'Charlie', last_name: 'Davis', email: 'charlie.davis@example.com', phone: '+1 234 567 8905', source: 'offline', status: 'converted', priority: 1, assigned_to: { full_name: 'Alice Brown' }, last_contacted: '2 days ago' },
  { id: 6, first_name: 'Diana', last_name: 'Evans', email: 'diana.evans@example.com', phone: '+1 234 567 8906', source: 'website', status: 'new', priority: 3, assigned_to: { full_name: 'Jane Wilson' }, last_contacted: '1 hour ago' },
  { id: 7, first_name: 'Edward', last_name: 'Foster', email: 'edward.foster@example.com', phone: '+1 234 567 8907', source: 'referral', status: 'qualified', priority: 4, assigned_to: null, last_contacted: '3 days ago' },
  { id: 8, first_name: 'Fiona', last_name: 'Garcia', email: 'fiona.garcia@example.com', phone: '+1 234 567 8908', source: 'google', status: 'contacted', priority: 2, assigned_to: { full_name: 'John Smith' }, last_contacted: '4 hours ago' },
];

const filterOptions = {
  status: ['new', 'contacted', 'qualified', 'negotiation', 'converted', 'not_interested', 'lost'],
  source: ['website', 'referral', 'facebook', 'google', 'offline'],
  priority: ['1', '2', '3', '4', '5'],
};

const LeadListing: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leads, loading, pagination, filters } = useSelector((state: RootState) => state.leads);
  
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const actualLeads = leads.length > 0 ? leads : mockLeads;
  const total = leads.length > 0 ? pagination.total : mockLeads.length;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLeadsFilters({ search: e.target.value }));
  };

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const handleFilterSelect = (filterType: string, value: string) => {
    const current = filters[filterType as keyof typeof filters] as string[];
    const newFilters = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    dispatch(setLeadsFilters({ [filterType]: newFilters }));
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === actualLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(actualLeads.map((l: any) => l.id));
    }
  };

  const handleSelectLead = (id: number) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setLeadsPagination({ page: newPage }));
  };

  const handleRowsPerPageChange = (limit: number) => {
    dispatch(setLeadsPagination({ limit, page: 1 }));
  };

  const EmptyState = () => (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          opacity: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Search size={48} style={{ color: 'var(--color-primary-500)', opacity: 0.5 }} />
      </Box>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        No leads found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
        {filters.search || filters.status.length || filters.source.length
          ? 'Try adjusting your filters to see more results.'
          : "Start by creating your first lead to get started."}
      </Typography>
      <Button
        variant="contained"
startIcon={<Plus size={18} />}
        onClick={() => {}}
      >
        Create First Lead
      </Button>
    </Box>
  );

  const SkeletonRow = () => (
    <TableRow>
      <TableCell padding="checkbox"><Skeleton variant="rectangular" width={20} height={20} /></TableCell>
      <TableCell><Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}><Skeleton variant="circular" width={32} height={32} /><Skeleton width={120} /></Box></TableCell>
      <TableCell><Skeleton width={160} /></TableCell>
      <TableCell><Skeleton width={100} /></TableCell>
      <TableCell><Skeleton width={80} /></TableCell>
      <TableCell><Skeleton width={60} /></TableCell>
      <TableCell><Skeleton width={80} /></TableCell>
      <TableCell><Skeleton width={40} /></TableCell>
    </TableRow>
  );

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
          Leads
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track all your leads in one place.
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ p: 2, mb: 3, borderRadius: 2 }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          {/* Search */}
          <TextField
            placeholder="Search leads..."
            value={filters.search}
            onChange={handleSearch}
            size="small"
            sx={{ minWidth: 280 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
                endAdornment: filters.search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => dispatch(setLeadsFilters({ search: '' }))}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />

          {/* Status Filter */}
          <Box sx={{ position: 'relative' }}>
            <Button
              variant="outlined"
              startIcon={<Filter size={16} />}
              onClick={() => handleFilterClick('status')}
              sx={{
                borderColor: filters.status.length ? 'primary.main' : 'divider',
                bgcolor: filters.status.length ? 'primary.main' : 'transparent',
                color: filters.status.length ? 'white' : 'text.primary',
              }}
            >
              Status
              {filters.status.length > 0 && (
                <Chip label={filters.status.length} size="small" sx={{ ml: 1, height: 18, bgcolor: 'white', color: 'primary.main' }} />
              )}
            </Button>
            <AnimatePresence>
              {activeFilter === 'status' && (
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  sx={{ position: 'absolute', top: '100%', left: 0, mt: 1, p: 2, zIndex: 100, minWidth: 180 }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {filterOptions.status.map((status) => (
                      <Chip
                        key={status}
                        label={status.replace('_', ' ')}
                        size="small"
                        onClick={() => handleFilterSelect('status', status)}
                        sx={{
                          bgcolor: filters.status.includes(status) ? statusColors[status]?.bg : 'transparent',
                          color: filters.status.includes(status) ? statusColors[status]?.text : 'text.secondary',
                          border: '1px solid',
                          borderColor: filters.status.includes(status) ? statusColors[status]?.text : 'divider',
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              )}
            </AnimatePresence>
          </Box>

          {/* Source Filter */}
          <Box sx={{ position: 'relative' }}>
            <Button variant="outlined" onClick={() => handleFilterClick('source')} sx={{ borderColor: filters.source.length ? 'primary.main' : 'divider' }}>
              Source {filters.source.length > 0 && `(${filters.source.length})`}
            </Button>
            <AnimatePresence>
              {activeFilter === 'source' && (
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  sx={{ position: 'absolute', top: '100%', left: 0, mt: 1, p: 2, zIndex: 100, minWidth: 180 }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {filterOptions.source.map((source) => (
                      <Chip
                        key={source}
                        label={source}
                        size="small"
                        onClick={() => handleFilterSelect('source', source)}
                        sx={{
                          bgcolor: filters.source.includes(source) ? '#4f46e515' : 'transparent',
                          border: '1px solid',
                          borderColor: filters.source.includes(source) ? 'primary.main' : 'divider',
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              )}
            </AnimatePresence>
          </Box>

          {/* Priority Filter */}
          <Box sx={{ position: 'relative' }}>
            <Button variant="outlined" onClick={() => handleFilterClick('priority')}>
              Priority
            </Button>
          </Box>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Actions */}
          <Button variant="contained" startIcon={<Plus size={18} />} sx={{ borderRadius: '8px' }}>
            New Lead
          </Button>
          <IconButton onClick={() => dispatch(fetchLeads({ page: pagination.page, limit: pagination.limit }))}>
            <RefreshCw size={18} />
          </IconButton>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedLeads.length === actualLeads.length && actualLeads.length > 0}
                    indeterminate={selectedLeads.length > 0 && selectedLeads.length < actualLeads.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <TableSortLabel>Lead</TableSortLabel>
                </TableCell>
                <TableCell>Contact Info</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>
                  <TableSortLabel>Status</TableSortLabel>
                </TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Last Activity</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : actualLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              ) : (
                actualLeads.map((lead: any, idx: number) => (
                  <TableRow
                    key={lead.id}
                    component={motion.tr}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    sx={{
                      '&:nth-of-type(even)': { bgcolor: 'background.default' },
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
                          {lead.first_name[0]}{lead.last_name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {lead.first_name} {lead.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {sourceIcons[lead.source] || '📌'} {lead.source}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{lead.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{lead.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      {lead.assigned_to ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 10 }}>{lead.assigned_to.full_name.split(' ').map((n: string) => n[0]).join('')}</Avatar>
                          <Typography variant="body2">{lead.assigned_to.full_name}</Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status.replace('_', ' ')}
                        size="small"
                        sx={{
                          bgcolor: statusColors[lead.status]?.bg,
                          color: statusColors[lead.status]?.text,
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Box
                            key={star}
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: star <= lead.priority ? 'warning.main' : 'divider',
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{lead.last_contacted}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: 'success.main' }}>
                          <Phone size={16} />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVertical
                            size={16}
                            onClick={(e) => setMenuAnchor(e.currentTarget as unknown as HTMLElement)}
                          />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rows per page:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 70 }}>
              <Select
                value={pagination.limit}
                onChange={(e) => handleRowsPerPageChange(e.target.value as number)}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="body2" color="text.secondary">
              {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, total)} of {total}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>
              <ChevronLeft size={18} />
            </IconButton>
            <Typography variant="body2">{pagination.page}</Typography>
            <IconButton size="small" disabled={pagination.page * pagination.limit >= total} onClick={() => handlePageChange(pagination.page + 1)}>
              <ChevronRight size={18} />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedLeads.length > 0 && (
          <Paper
            component={motion.div}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            sx={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              px: 3,
              py: 2,
              borderRadius: 2,
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              zIndex: 1200,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {selectedLeads.length} selected
            </Typography>
            <Button size="small" variant="outlined">Assign</Button>
            <Button size="small" variant="outlined">Change Status</Button>
            <Button size="small" variant="outlined" startIcon={<Download size={14} />}>Export</Button>
            <Button size="small" color="error" startIcon={<Trash2 size={14} />}>Delete</Button>
            <IconButton size="small" onClick={() => setSelectedLeads([])}>
              <X size={18} />
            </IconButton>
          </Paper>
        )}
      </AnimatePresence>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Eye size={16} style={{ marginRight: 8 }} /> View
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Edit size={16} style={{ marginRight: 8 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <Mail size={16} style={{ marginRight: 8 }} /> Email
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>
          <Trash2 size={16} style={{ marginRight: 8 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LeadListing;