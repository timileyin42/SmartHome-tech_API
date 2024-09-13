import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Importing the CSS for dashboard styling

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to the Smart Home Dashboard!</h1>
      <div className="dashboard-grid">
        <Link to="/weather-control" className="dashboard-item">Weather Control</Link>
        <Link to="/device-control" className="dashboard-item">Device Control</Link>
        <Link to="/automation-rules" className="dashboard-item">Automation Rules</Link>
        <Link to="/camera-control" className="dashboard-item">Camera Control</Link>
        <Link to="/tv-control" className="dashboard-item">TV Control</Link>
        <Link to="/smart-door" className="dashboard-item">Smart Door Control</Link>
      </div>
    </div>
  );
};

export default Dashboard;

