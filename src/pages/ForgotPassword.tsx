import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('If this email is registered, a reset link has been sent.');
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6} p={3} bgcolor="#fff" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
        </Button>
      </form>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
