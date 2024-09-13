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

  // Fetch devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Device[]>('/api/devices', {
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

  // Control device function (on/off/state)
  const controlDevice = async (deviceId: string, action: string, state?: object) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/devices/${deviceId}/${action}`;
      let data = state ? state : {};
      const response = await axios.post<{ message: string }>(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setResponseMessage(response.data.message); // Set success message
      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device._id === deviceId ? { ...device, status: action === 'on' ? 'on' : 'off' } : device
        )
      );
    } catch (err) {
      handleAxiosError(err, `Error controlling device: ${deviceId}`);
    } finally {
      setLoading(false);
    }
  };

  // Error handling function
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && typeof (err as { isAxiosError?: boolean }).isAxiosError === 'boolean') {
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

  // Turn on the device
  const turnOnDevice = (deviceId: string) => {
    controlDevice(deviceId, 'on');
  };

  // Turn off the device
  const turnOffDevice = (deviceId: string) => {
    controlDevice(deviceId, 'off');
  };

  // Handle device state updates (e.g., brightness, temperature, etc.)
  const setDeviceState = (deviceId: string, state: object) => {
    controlDevice(deviceId, 'state', state);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (responseMessage) return <p style={{ color: 'green' }}>{responseMessage}</p>;

  return (
    <div>
      <h2>Device Control</h2>
      {devices.length === 0 && <p>No devices available</p>}
      <ul>
        {devices.map((device) => (
          <li key={device._id}>
            <h3>{device.name}</h3>
            <p>Status: {device.status || 'Unknown'}</p>
            <button onClick={() => turnOnDevice(device._id)}>Turn On</button>
            <button onClick={() => turnOffDevice(device._id)}>Turn Off</button>
            {/* Example of controlling a specific state */}
            <button onClick={() => setDeviceState(device._id, { brightness: 80 })}>Set Brightness to 80</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceControl;

