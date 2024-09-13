import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const CameraControl: React.FC = () => {
  const [action, setAction] = useState<string>('on');
  const [duration, setDuration] = useState<number | ''>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCameraAction = async () => {
    setLoading(true);
    try {
      const response = await axios.post<{ message: string }>('http://localhost:3000/api/devices/camera/control', {
        action,
        duration: action === 'record' ? duration : undefined, // Only send duration for 'record' action
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
        },
      });

      setResponseMessage(response.data.message);
      setError(''); // Clear any previous errors
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to control camera.');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Error handling function
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (isAxiosError(err)) {
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
    setResponseMessage(''); // Clear any previous success message
  };

  // Type guard to check if error is AxiosError
  function isAxiosError(err: any): err is AxiosError {
    return err.isAxiosError === true;
  }

  return (
    <div>
      <h2>Camera Control</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
      {loading && <p>Processing...</p>}

      <div>
        <label htmlFor="action">Action: </label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="on">Turn On</option>
          <option value="off">Turn Off</option>
          <option value="record">Record</option>
          <option value="snapshot">Take Snapshot</option>
        </select>
      </div>

      {action === 'record' && (
        <div>
          <label htmlFor="duration">Duration (in seconds): </label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>
      )}

      <button onClick={handleCameraAction} disabled={loading}>Submit</button>
    </div>
  );
};

export default CameraControl;

