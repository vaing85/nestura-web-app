import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert } from '@mui/material';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: { name: string; email: string };
  token: string;
  onProfileUpdated: (profile: { name: string; email: string }) => void;
}

const API_URL = process.env.REACT_APP_API_URL;

export default function EditProfileModal({ open, onClose, profile, token, onProfileUpdated }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        onProfileUpdated({ name, email });
        onClose();
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box bgcolor="#fff" p={4} borderRadius={2} boxShadow={3} maxWidth={400} mx="auto" mt={10}>
        <Typography variant="h6" mb={2}>Edit Profile</Typography>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" />
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </Box>
      </Box>
    </Modal>
  );
}
