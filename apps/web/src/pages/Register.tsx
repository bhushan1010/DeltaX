import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { Box, Button, Container, CssBaseline, TextField, Typography, Link, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../store/slices/authSlice';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'sales_agent' | 'business_manager' | 'admin'>('sales_agent');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(register({ email, password, fullName, role }) as any);
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
          Create Account
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
              id="fullName"
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
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
              autoComplete="new-password"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value as 'sales_agent' | 'business_manager' | 'admin')}
              >
                <MenuItem value="sales_agent">
                  Sales Agent
                </MenuItem>
                <MenuItem value="business_manager">
                  Business Manager
                </MenuItem>
                <MenuItem value="admin">
                  Admin
                </MenuItem>
              </Select>
              <FormHelperText>
                Select your role in the organization
              </FormHelperText>
            </FormControl>
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
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <Box sx={{ mt: 3 }}>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
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

export default Register;