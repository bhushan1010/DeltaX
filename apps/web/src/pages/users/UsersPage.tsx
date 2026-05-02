import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addUser, updateUserInList, deleteUser } from '../../store/slices/usersSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../../store/slices/authSlice';

export default function UsersPage() {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.users);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Sales Agent' as const,
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'Sales Agent',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: User = {
      id: editingUser?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    if (editingUser) {
      dispatch(updateUserInList(userData));
      toast.success('User updated successfully');
    } else {
      dispatch(addUser(userData));
      toast.success('User created successfully');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
      toast.success('User deleted successfully');
    }
  };

  if (currentUser?.role !== 'Business Manager') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Access denied. Only Business Managers can view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          style={{ background: '#4f46e5', borderRadius: '8px' }}
        >
          <Plus size={20} className="mr-2" />
          Add User
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} style={{ borderRadius: '8px' }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback
                    style={{
                      background: user.role === 'Business Manager' ? '#f59e0b' : '#818cf8',
                      color: 'white',
                    }}
                  >
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenModal(user)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <h3 className="font-bold mb-1 text-foreground">{user.name}</h3>
              <p className="text-sm mb-3 text-muted-foreground">{user.email}</p>
              <Badge
                style={{
                  background: user.role === 'Business Manager' ? '#fef3c7' : '#e0e7ff',
                  color: user.role === 'Business Manager' ? '#f59e0b' : '#4f46e5',
                  borderRadius: '8px',
                }}
              >
                {user.role}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales Agent">Sales Agent</SelectItem>
                  <SelectItem value="Business Manager">Business Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" style={{ background: '#4f46e5' }}>
                {editingUser ? 'Update User' : 'Add User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
