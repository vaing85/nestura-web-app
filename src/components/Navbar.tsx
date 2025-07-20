import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar className="navbar-toolbar">
        <Typography variant="h6" component={Link} to="/" className="navbar-link" sx={undefined}>
          Nestura
        </Typography>
        {token ? (
          <Box>
            <Button color="inherit" component={Link} to="/profile" className="navbar-btn">Profile</Button>
            <Button color="inherit" onClick={handleLogout} className="navbar-btn">Logout</Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login" className="navbar-btn">Login</Button>
            <Button color="inherit" component={Link} to="/register" className="navbar-btn">Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
