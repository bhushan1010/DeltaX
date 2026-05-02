import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addLead, updateLead } from '../../store/slices/leadsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
}

export default function LeadFormModal({ isOpen, onClose, leadId }: LeadFormModalProps) {
  const dispatch = useDispatch();
  const leads = useSelector((state: RootState) => state.leads.leads);
  const users = useSelector((state: RootState) => state.users.users);
  const editingLead = leadId ? leads.find(l => l.id === leadId) : null;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    source: 'Website' as const,
    status: 'New' as const,
    assignedTo: '',
    vehicleInterest: '',
    budget: '',
    notes: '',
  });

  useEffect(() => {
    if (editingLead) {
      setFormData({
        name: editingLead.name,
        phone: editingLead.phone,
        email: editingLead.email,
        address: editingLead.address || '',
        source: editingLead.source,
        status: editingLead.status,
        assignedTo: editingLead.assignedTo,
        vehicleInterest: editingLead.vehicleInterest || '',
        budget: editingLead.budget?.toString() || '',
        notes: editingLead.notes || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        source: 'Website',
        status: 'New',
        assignedTo: users[0]?.id || '',
        vehicleInterest: '',
        budget: '',
        notes: '',
      });
    }
  }, [editingLead, users, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedUser = users.find(u => u.id === formData.assignedTo);

    const leadData = {
      id: editingLead?.id || Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      source: formData.source,
      status: formData.status,
      assignedTo: formData.assignedTo,
      assignedToName: assignedUser?.name || '',
      vehicleInterest: formData.vehicleInterest,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      notes: formData.notes,
      createdAt: editingLead?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingLead) {
      dispatch(updateLead(leadData));
      toast.success('Lead updated successfully');
    } else {
      dispatch(addLead(leadData));
      toast.success('Lead created successfully');
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingLead ? 'Edit Lead' : 'Create New Lead'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Select
                value={formData.source}
                onValueChange={(value: any) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Showroom">Showroom</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To *</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
              >
                <SelectTrigger id="assignedTo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleInterest">Vehicle Interest</Label>
              <Input
                id="vehicleInterest"
                value={formData.vehicleInterest}
                onChange={(e) => setFormData({ ...formData, vehicleInterest: e.target.value })}
                placeholder="e.g., 2024 Honda Accord"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="35000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" style={{ background: '#4f46e5' }}>
              {editingLead ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
