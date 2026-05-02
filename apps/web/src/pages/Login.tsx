import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { Box, Button, Container, CssBaseline, TextField, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/slices/authSlice';

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }) as any);
    if (!result.error) {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 4, mb: 4 }}>
      <CssBaseline />
        <Box
          sx={{
            margin: '0 auto',
            p: 4,
          width: { xs: 320, sm: 360 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in to LeadFlow Pro
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box sx={{ mt: 3 }}>
              <Link href="/register" variant="body2">
                Don&apos;t have an account? Sign up
              </Link>
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            Copyright &copy; {new Date().getFullYear()} HSR Motors
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;