import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
}

const API_URL = process.env.REACT_APP_API_URL;

export default function ChangePasswordModal({ open, onClose, token }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box bgcolor="#fff" p={4} borderRadius={2} boxShadow={3} maxWidth={400} mx="auto" mt={10}>
        <Typography variant="h6" mb={2}>Change Password</Typography>
        <TextField label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} fullWidth margin="normal" />
        <TextField label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth margin="normal" />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleChange} disabled={loading}>{loading ? 'Saving...' : 'Change'}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
