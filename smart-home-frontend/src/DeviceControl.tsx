import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface Device {
  _id: string;
  name: string;
  status?: string; // Made status optional to match backend
  type: string;
}

const DeviceControl: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [deviceState, setDeviceState] = useState<object | null>(null);

  // Fetch devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Device[]>('http://localhost:3000/api/devices', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        setDevices(response.data);
        setResponseMessage('Devices fetched successfully');
      } catch (err) {
        handleAxiosError(err, 'Error fetching devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  // Handle dropdown action selection
  const handleAction = async () => {
    if (!deviceId) {
      setError('No device selected');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:3000/api/devices/${deviceId}`;
      let method = 'GET';
      let data = {};

      switch (selectedAction) {
        case 'getDevice':
          url += `/${deviceId}`;
          break;
        case 'createDevice':
          method = 'POST';
          data = { name: 'New Device', type: 'Type' }; // Example data
          break;
        case 'updateDevice':
          method = 'PUT';
          data = { name: 'Updated Device' }; // Example data
          break;
        case 'deleteDevice':
          method = 'DELETE';
          break;
        case 'turnOnDevice':
          url += '/on';
          method = 'POST';
          break;
        case 'turnOffDevice':
          url += '/off';
          method = 'POST';
          break;
        case 'setDeviceState':
          url += '/state';
          method = 'POST';
          data = deviceState || {};
          break;
        default:
          throw new Error('Invalid action');
      }

      const response = await axios({ url, method, data, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setResponseMessage((response.data as { message: string }).message || 'Action successful');
    } catch (err) {
      handleAxiosError(err, `Error performing action: ${selectedAction}`);
    } finally {
      setLoading(false);
    }
  };

  // Error handling function
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && (err as { isAxiosError?: boolean }).isAxiosError) {
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
    setResponseMessage(null); // Clear any previous response message
  };

  return (
    <div>
      <h2>Device Control</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}

      <select onChange={(e) => setSelectedAction(e.target.value)} value={selectedAction || ''}>
        <option value="">Select Action</option>
        <option value="getDevices">Get Devices</option>
        <option value="getDevice">Get Device</option>
        <option value="createDevice">Create Device</option>
        <option value="updateDevice">Update Device</option>
        <option value="deleteDevice">Delete Device</option>
        <option value="turnOnDevice">Turn On Device</option>
        <option value="turnOffDevice">Turn Off Device</option>
        <option value="setDeviceState">Set Device State</option>
      </select>

      <input
        type="text"
        placeholder="Device ID"
        value={deviceId || ''}
        onChange={(e) => setDeviceId(e.target.value)}
      />

      {selectedAction === 'setDeviceState' && (
        <input
          type="text"
          placeholder="Device State (JSON)"
          value={JSON.stringify(deviceState || '')}
          onChange={(e) => setDeviceState(JSON.parse(e.target.value))}
        />
      )}

      <button onClick={handleAction}>Perform Action</button>

      {devices.length === 0 && <p>No devices available</p>}
      <ul>
        {devices.map((device) => (
          <li key={device._id}>
            <h3>{device.name}</h3>
            <p>Status: {device.status || 'Unknown'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceControl;

