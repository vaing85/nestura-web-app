import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => (
  <nav style={{ padding: '1rem', background: '#f5f5f5' }}>
    <Link to="/" style={{ marginRight: 16 }}>Home</Link>
    <Link to="/login" style={{ marginRight: 16 }}>Login</Link>
    <Link to="/register" style={{ marginRight: 16 }}>Register</Link>
    <Link to="/properties">Properties</Link>
  </nav>
);

export default Navbar;
