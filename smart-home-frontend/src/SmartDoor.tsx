import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Define the expected response type
interface DoorControlResponse {
  message: string;
}

const SmartDoor: React.FC = () => {
  const [action, setAction] = useState<string>('lock');
  const [status, setStatus] = useState<string>('unlocked'); // Default status
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle the door action
  const handleDoorAction = async () => {
    setLoading(true);
    setError(null);
    setResponseMessage(null);

    try {
      const response = await axios.post<DoorControlResponse>(
        'http://localhost:3000/api/smart-door/control',
        { action, status }, // Include status in the payload
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming the JWT token is stored in localStorage
            'Content-Type': 'application/json',
          },
        }
      );

      setResponseMessage(response.data.message || 'Action successful');
    } catch (err) {
      handleAxiosError(err, 'Failed to control the door.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handling
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && (err as { isAxiosError?: boolean }).isAxiosError === true) {
      // Handle AxiosError type
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      // Handle generic errors
      setError(err.message || 'An unexpected error occurred.');
    } else {
      // Handle unknown errors
      setError('An unknown error occurred.');
    }
    setResponseMessage(null); // Clear success message on error
  };

  return (
    <div>
      <h2>Smart Door Control</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}

      <div>
        <label htmlFor="status">Status: </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading} // Disable while loading
        >
          <option value="unlocked">Unlocked</option>
          <option value="locked">Locked</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      <div>
        <label htmlFor="action">Action: </label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          disabled={loading} // Disable while loading
        >
          <option value="lock">Lock</option>
          <option value="unlock">Unlock</option>
        </select>
      </div>

      <button onClick={handleDoorAction} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
};

export default SmartDoor;

