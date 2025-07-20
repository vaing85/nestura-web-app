import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password reset successful. You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6} p={3} bgcolor="#fff" borderRadius={2} boxShadow={2}>
      <Typography variant="h5" mb={2}>Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Reset Password'}
        </Button>
      </form>
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
