import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mockUser = {
      id: '1',
      name: formData.name || 'Demo User',
      email: formData.email,
      role: formData.email.includes('admin') ? 'Business Manager' as const : 'Sales Agent' as const,
    };

    const mockToken = 'mock-jwt-token-' + Date.now();

    dispatch(loginSuccess({ user: mockUser, token: mockToken }));
    toast.success(`Welcome back, ${mockUser.name}!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md" style={{ borderRadius: '8px' }}>
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-2 bg-primary">
              <span className="text-2xl font-bold text-white">HSR</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-foreground">LeadFlow Pro</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@hsrmotors.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              style={{
                background: '#4f46e5',
                borderRadius: '8px'
              }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium hover:underline text-primary"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          <div className="mt-6 p-3 rounded bg-muted">
            <p className="text-xs text-muted-foreground">
              <strong>Demo credentials:</strong><br />
              Agent: agent@hsrmotors.com<br />
              Manager: admin@hsrmotors.com<br />
              Password: any
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
