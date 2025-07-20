import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const API_URL = process.env.REACT_APP_API_URL;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('booker');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token); // Only pass token, user will be fetched
        navigate('/profile');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="register-form">
      <Typography variant="h5" className="register-title">Register</Typography>
      <TextField label="Name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} fullWidth margin="normal" />
      <TextField label="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} fullWidth margin="normal" />
      <TextField label="Password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} fullWidth margin="normal" />
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant={role === 'booker' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setRole('booker')}
          sx={{ mr: 1 }}
        >
          Booker
        </Button>
        <Button
          variant={role === 'owner' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setRole('owner')}
        >
          Owner
        </Button>
      </Box>
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} className="register-submit">
        {loading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
      {error && <Alert severity="error" className="register-error">{error}</Alert>}
    </Box>
  );
}
