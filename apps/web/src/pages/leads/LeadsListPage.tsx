import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setFilters, setSelectedLead, deleteLead } from '../../store/slices/leadsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface LeadsListPageProps {
  onNavigate: (page: string, leadId?: string) => void;
  onOpenLeadForm: (leadId?: string) => void;
}

export default function LeadsListPage({ onNavigate, onOpenLeadForm }: LeadsListPageProps) {
  const dispatch = useDispatch();
  const leads = useSelector((state: RootState) => state.leads.leads);
  const filters = useSelector((state: RootState) => state.leads.filters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const statusColors: Record<string, string> = {
    'New': '#3b82f6',
    'Contacted': '#8b5cf6',
    'Qualified': '#10b981',
    'Negotiation': '#f59e0b',
    'Converted': '#059669',
    'Not Interested': '#6b7280',
    'Lost': '#ef4444',
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         lead.phone.includes(filters.search);
    const matchesStatus = filters.status === 'All' || lead.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLead(id));
      toast.success('Lead deleted successfully');
    }
  };

  const handleView = (lead: any) => {
    dispatch(setSelectedLead(lead));
    onNavigate('lead-detail', lead.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads</h1>
          <p className="text-muted-foreground">Manage and track all your leads</p>
        </div>
        <Button
          onClick={() => onOpenLeadForm()}
          style={{ background: '#4f46e5', borderRadius: '8px' }}
        >
          <Plus size={20} className="mr-2" />
          New Lead
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ borderRadius: '8px' }}>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#94a3b8' }}
              />
              <Input
                placeholder="Search by name, email, or phone..."
                value={filters.search}
                onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => dispatch(setFilters({ status: value as any }))}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Not Interested">Not Interested</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card style={{ borderRadius: '8px' }}>
        <CardHeader>
          <CardTitle>
            {filteredLeads.length} {filteredLeads.length === 1 ? 'Lead' : 'Leads'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Source</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Assigned To</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border hover:bg-accent/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{lead.name}</p>
                        {lead.vehicleInterest && (
                          <p className="text-sm text-muted-foreground">{lead.vehicleInterest}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-foreground">{lead.phone}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{lead.source}</td>
                    <td className="py-3 px-4">
                      <Badge
                        style={{
                          background: statusColors[lead.status] + '20',
                          color: statusColors[lead.status],
                          borderRadius: '8px',
                        }}
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground">{lead.assignedToName}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(lead)}
                        >
                          <Eye size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenLeadForm(lead.id)}
                        >
                          <Pencil size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lead.id)}
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No leads found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
