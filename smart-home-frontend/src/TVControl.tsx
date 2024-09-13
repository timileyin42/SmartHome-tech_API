import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

// Define the expected response type
interface TVControlResponse {
  message: string;
}

const TVControl: React.FC = () => {
  const [action, setAction] = useState<string>('on');
  const [volume, setVolume] = useState<number>(10);
  const [channel, setChannel] = useState<number>(1);
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTVAction = async () => {
    setLoading(true);
    setError(null);
    setResponseMessage('');

    try {
      const payload: any = { action };

      if (action === 'volume_up' || action === 'volume_down') {
        payload.volume = volume;
      } else if (action === 'change_channel') {
        payload.channel = channel;
      }

      const response = await axios.post<TVControlResponse>(
        'http://localhost:3000/api/tv/control',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // JWT token
            'Content-Type': 'application/json',
          },
        }
      );

      setResponseMessage(response.data.message || 'Action successful');
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to control the TV.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handling
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && typeof err === 'object' && 'response' in err) {
      // Use type assertion for AxiosError
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred.');
    } else {
      setError('An unknown error occurred.');
    }
    setResponseMessage(''); // Clear previous success message
  };

  return (
    <div>
      <h2>TV Control</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}

      <div>
        <label htmlFor="action">Action: </label>
        <select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          disabled={loading} // Disable while loading
        >
          <option value="on">Turn On</option>
          <option value="off">Turn Off</option>
          <option value="volume_up">Volume Up</option>
          <option value="volume_down">Volume Down</option>
          <option value="change_channel">Change Channel</option>
        </select>
      </div>

      {(action === 'volume_up' || action === 'volume_down') && (
        <div>
          <label htmlFor="volume">Volume: </label>
          <input
            id="volume"
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            disabled={loading}
          />
        </div>
      )}

      {action === 'change_channel' && (
        <div>
          <label htmlFor="channel">Channel: </label>
          <input
            id="channel"
            type="number"
            value={channel}
            onChange={(e) => setChannel(Number(e.target.value))}
            disabled={loading}
          />
        </div>
      )}

      <button onClick={handleTVAction} disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
};

export default TVControl;

