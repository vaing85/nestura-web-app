import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token); // Only pass token, user will be fetched
        navigate('/profile');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="login-form">
      <Typography variant="h5" className="login-title">Login</Typography>
      <TextField label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} fullWidth margin="normal" />
      <TextField label="Password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} fullWidth margin="normal" />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} className="login-submit">
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      <Box mt={2} textAlign="center">
        <Link to="/forgot-password">Forgot Password?</Link>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
