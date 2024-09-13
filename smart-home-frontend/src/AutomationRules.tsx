import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
}

const AutomationRules: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: '',
    condition: '',
    action: '',
  });
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch automation rules on component mount
  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      try {
        const response = await axios.get<{ data: AutomationRule[] }>('http://localhost:3000/api/automation-rules', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setRules(response.data.data); // Set the rules data
      } catch (err: unknown) {
        handleAxiosError(err, 'Failed to fetch automation rules.');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  // Centralized error handling function
  const handleAxiosError = (err: unknown, defaultMessage: string) => {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message || 'An unexpected error occurred.');
    } else {
      setError('An unknown error occurred.');
    }
  };

  // Create a new automation rule
  const createRule = async () => {
    setLoading(true);
    try {
      const response = await axios.post<{ data: AutomationRule }>('http://localhost:3000/api/automation-rules', newRule, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRules([...rules, response.data.data]); // Add the new rule to the list
      setNewRule({ name: '', trigger: '', condition: '', action: '' }); // Reset form
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to create the automation rule.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing automation rule
  const updateRule = async () => {
    if (!selectedRule) return;
    setLoading(true);
    try {
      const response = await axios.put<{ data: AutomationRule }>(`http://localhost:3000/api/automation-rules/${selectedRule.id}`, selectedRule, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedRules = rules.map((rule) =>
        rule.id === selectedRule.id ? response.data.data : rule
      );
      setRules(updatedRules);
      setSelectedRule(null); // Clear the selection
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to update the automation rule.');
    } finally {
      setLoading(false);
    }
  };

  // Delete an automation rule
  const deleteRule = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/automation-rules/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRules(rules.filter((rule) => rule.id !== id)); // Remove the rule from the list
    } catch (err: unknown) {
      handleAxiosError(err, 'Failed to delete the automation rule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Automation Rules</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectedRule ? updateRule() : createRule();
        }}
      >
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newRule.name || selectedRule?.name || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, name: e.target.value })
                : setNewRule({ ...newRule, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Trigger:</label>
          <input
            type="text"
            value={newRule.trigger || selectedRule?.trigger || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, trigger: e.target.value })
                : setNewRule({ ...newRule, trigger: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Condition:</label>
          <input
            type="text"
            value={newRule.condition || selectedRule?.condition || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, condition: e.target.value })
                : setNewRule({ ...newRule, condition: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Action:</label>
          <input
            type="text"
            value={newRule.action || selectedRule?.action || ''}
            onChange={(e) =>
              selectedRule
                ? setSelectedRule({ ...selectedRule, action: e.target.value })
                : setNewRule({ ...newRule, action: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {selectedRule ? 'Update Rule' : 'Create Rule'}
        </button>
      </form>

      <h3>Existing Automation Rules</h3>
      {rules.length > 0 ? (
        <ul>
          {rules.map((rule) => (
            <li key={rule.id}>
              <span>
                Name: {rule.name}, Trigger: {rule.trigger}, Condition: {rule.condition}, Action: {rule.action}
              </span>
              <button onClick={() => setSelectedRule(rule)}>Edit</button>
              <button onClick={() => deleteRule(rule.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No automation rules found.</p>
      )}
    </div>
  );
};

export default AutomationRules;

