import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="LandingPage">
      <div className="tabs">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
      <p>Your gateway to a smarter home experience.</p>
    </div>
  );
};

export default LandingPage;

