'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { login } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f4eeee' }}>

      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#fff' }}>
        <Toolbar>
          <Image
            src="/images/TT_Logo.png"
            alt="Company Logo"
            width={160}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
          />
        </Toolbar>
      </AppBar>


      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
  
              <Typography
                sx={{ fontWeight: 500}}
              >
                <span style={{ color: 'red' }}>*</span> User Name 
              </Typography>

              <TextField
              
                fullWidth
                placeholder="Email"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Typography
                sx={{ fontWeight: 500, mt: 2}}
              >
                <span style={{ color: 'red' }}>*</span> Password 
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3, backgroundColor: '#007bff', '&:hover': { backgroundColor: '#006ae6' } }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
