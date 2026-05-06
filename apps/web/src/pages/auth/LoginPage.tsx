import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { authApi } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

// ─── Demo credentials ─────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    email: 'admin@deltax.com',
    password: 'Admin@123',
    color: '#ef4444',
    bg: '#fef2f2',
    description: 'Full access — users, projects, tasks',
  },
  {
    role: 'Manager',
    email: 'manager@deltax.com',
    password: 'Manager@123',
    color: '#f59e0b',
    bg: '#fef3c7',
    description: 'Create projects, assign tasks',
  },
  {
    role: 'Lead',
    email: 'lead@deltax.com',
    password: 'Lead@123',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    description: 'Create & manage tasks',
  },
  {
    role: 'Worker',
    email: 'worker@deltax.com',
    password: 'Worker@123',
    color: '#4f46e5',
    bg: '#e0e7ff',
    description: 'View & update own tasks',
  },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setFormData({ ...formData, email: account.email, password: account.password });
    setIsLogin(true);
    toast.info(`Filled credentials for ${account.role}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        dispatch(loginSuccess({
          user: {
            id:    response.data.user.id,
            name:  response.data.user.full_name,
            email: response.data.user.email,
            role:  response.data.user.role,
          },
          token: response.data.accessToken,
        }));
        toast.success(`Welcome back!`);
      } else {
        const response = await authApi.register({
          email:    formData.email,
          password: formData.password,
          fullName: formData.name,
          role:     'worker',
        });

        dispatch(loginSuccess({
          user: {
            id:    response.data.user.id,
            name:  response.data.user.full_name,
            email: response.data.user.email,
            role:  response.data.user.role,
          },
          token: response.data.accessToken,
        }));
        toast.success(`Account created! Welcome, ${response.data.user.full_name}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      }}
    >
      <div className="w-full max-w-md px-4 space-y-4">

        {/* ── Brand header ───────────────────────────────────────── */}
        <div className="text-center mb-2">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            <span className="text-2xl font-black text-white tracking-tight">Δ</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">DeltaX</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Project Management Platform
          </p>
        </div>

        {/* ── Login card ─────────────────────────────────────────── */}
        <Card
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xl text-white">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription style={{ color: 'rgba(255,255,255,0.5)' }}>
              {isLogin ? 'Sign in to your workspace' : 'Join your team on DeltaX'}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-white/80 text-sm">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'white',
                      borderRadius: '10px',
                    }}
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="email" className="text-white/80 text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@deltax.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    borderRadius: '10px',
                  }}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-white/80 text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    borderRadius: '10px',
                  }}
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  borderRadius: '10px',
                  height: '42px',
                  border: 'none',
                  color: 'white',
                  fontSize: '15px',
                  boxShadow: '0 4px 20px rgba(79,70,229,0.4)',
                  transition: 'opacity 0.15s',
                }}
              >
                {isLoading ? 'Signing in…' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-semibold hover:underline"
                style={{ color: '#a5b4fc' }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ── Demo credentials panel ─────────────────────────────── */}
        <Card
          style={{
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} style={{ color: '#fbbf24' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Demo Accounts — click to fill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="text-left p-3 rounded-xl transition-all duration-150 hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${account.color}40`,
                    cursor: 'pointer',
                  }}
                  title={`Login as ${account.role}: ${account.email}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md"
                      style={{
                        background: account.bg,
                        color: account.color,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {account.role}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {account.email}
                  </div>
                  <div className="text-[11px] font-mono truncate" style={{ color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                    Pwd: {account.password}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {account.description}
                  </div>
                </button>
              ))}
            </div>

            <p className="text-center mt-3 text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Clicking a card auto-fills the login form
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
