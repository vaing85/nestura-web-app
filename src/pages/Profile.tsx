import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Avatar, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

const API_URL = process.env.REACT_APP_API_URL;

export default function Profile() {
  const { token, user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [changePwOpen, setChangePwOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (err) {
        setError('Network error');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!profile) return null;

  return (
    <Box maxWidth={500} mx="auto" mt={4} p={3} bgcolor="#fff" borderRadius={2} boxShadow={2}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ width: 64, height: 64, mr: 2 }} />
        <Box>
          <Typography variant="h6">{profile.name}</Typography>
          <Typography color="text.secondary">{profile.email}</Typography>
          <Typography color="text.secondary" fontSize={14}>
            Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Button variant="outlined" sx={{ mr: 2, mb: 2 }} onClick={() => setEditOpen(true)}>Edit Profile</Button>
      <Button variant="outlined" color="secondary" sx={{ mb: 2 }} onClick={() => setChangePwOpen(true)}>Change Password</Button>
      <Button variant="contained" color="error" onClick={logout} sx={{ float: 'right' }}>Logout</Button>
      <Divider sx={{ my: 3 }} />
      {profile.role === 'owner' && (
        <Box>
          <Typography variant="subtitle1" mb={1}>My Properties</Typography>
          <Typography color="text.secondary">(Property management coming soon)</Typography>
        </Box>
      )}
      {profile.role === 'booker' && (
        <Box>
          <Typography variant="subtitle1" mb={1}>My Bookings</Typography>
          <Typography color="text.secondary">(Booking history coming soon)</Typography>
        </Box>
      )}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={{ name: profile.name, email: profile.email }}
        token={token || ''}
        onProfileUpdated={updated => setProfile({ ...profile, ...updated })}
      />
      <ChangePasswordModal
        open={changePwOpen}
        onClose={() => setChangePwOpen(false)}
        token={token || ''}
      />
    </Box>
  );
}
