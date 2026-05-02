import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateLead } from '../../store/slices/leadsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Mail, Phone, MapPin, DollarSign, Car, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface LeadDetailPageProps {
  onNavigate: (page: string) => void;
  onEdit: () => void;
}

export default function LeadDetailPage({ onNavigate, onEdit }: LeadDetailPageProps) {
  const dispatch = useDispatch();
  const lead = useSelector((state: RootState) => state.leads.selectedLead);

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No lead selected</p>
        <Button onClick={() => onNavigate('leads')} className="mt-4">
          Back to Leads
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    'New': '#3b82f6',
    'Contacted': '#8b5cf6',
    'Qualified': '#10b981',
    'Negotiation': '#f59e0b',
    'Converted': '#059669',
    'Not Interested': '#6b7280',
    'Lost': '#ef4444',
  };

  const timeline = [
    { date: lead.createdAt, event: 'Lead Created', description: `Lead added to system from ${lead.source}` },
    { date: lead.updatedAt, event: 'Status Updated', description: `Status changed to ${lead.status}` },
  ];

  const activities = [
    { id: '1', type: 'call', description: 'Called customer to discuss requirements', date: '2026-05-01T14:30:00Z', user: 'Sarah Johnson' },
    { id: '2', type: 'email', description: 'Sent pricing information for Honda Accord', date: '2026-05-01T16:45:00Z', user: 'Sarah Johnson' },
    { id: '3', type: 'note', description: 'Customer prefers hybrid model, budget flexible', date: '2026-05-02T09:15:00Z', user: 'Sarah Johnson' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('leads')}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{lead.name}</h1>
            <p className="text-muted-foreground">Lead Details</p>
          </div>
        </div>
        <Button
          onClick={onEdit}
          style={{ background: '#4f46e5', borderRadius: '8px' }}
        >
          <Edit size={20} className="mr-2" />
          Edit Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card style={{ borderRadius: '8px' }}>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone size={20} className="mt-1 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-foreground">{lead.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={20} className="mt-1 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground">{lead.email}</p>
                  </div>
                </div>
                {lead.address && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin size={20} className="mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-foreground">{lead.address}</p>
                    </div>
                  </div>
                )}
                {lead.vehicleInterest && (
                  <div className="flex items-start gap-3">
                    <Car size={20} className="mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Interest</p>
                      <p className="text-foreground">{lead.vehicleInterest}</p>
                    </div>
                  </div>
                )}
                {lead.budget && (
                  <div className="flex items-start gap-3">
                    <DollarSign size={20} className="mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="text-foreground">${lead.budget.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
              {lead.notes && (
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-foreground mt-1">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card style={{ borderRadius: '8px' }}>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                    <div className="w-2 h-2 rounded-full mt-2 bg-primary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm mt-1 text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card style={{ borderRadius: '8px' }}>
            <CardHeader>
              <CardTitle>Lead Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className="w-full justify-center py-2"
                style={{
                  background: statusColors[lead.status] + '20',
                  color: statusColors[lead.status],
                  borderRadius: '8px',
                }}
              >
                {lead.status}
              </Badge>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Source</span>
                  <span className="text-foreground">{lead.source}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned To</span>
                  <span className="text-foreground">{lead.assignedToName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card style={{ borderRadius: '8px' }}>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 last:pb-0">
                    <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary" />
                    {idx !== timeline.length - 1 && (
                      <div className="absolute left-1.5 top-5 w-0.5 h-full bg-border" />
                    )}
                    <p className="font-medium text-foreground">{item.event}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <p className="text-xs mt-1 text-muted-foreground/70">
                      {new Date(item.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
