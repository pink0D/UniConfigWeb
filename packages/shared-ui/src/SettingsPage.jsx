import React, { useState, useEffect } from 'react';
import ApiService from './ApiService';
import SaveCancelBar from './SaveCancelBar.jsx';

const SettingsPage = ({ configEndpoint, defaultData, onDataLoaded, beforeSave, children }) => {
  const [data, setData] = useState(defaultData);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await ApiService.fetchConfig(configEndpoint);
      setData(config);
      setOriginalData(JSON.parse(JSON.stringify(config)));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, [configEndpoint]);

  const handleDataChange = (newData) => {
    setData(newData);
    if (onDataLoaded) {
      onDataLoaded(newData);
    }
  };

  const handleSave = async () => {
    if (beforeSave) {
      const shouldSave = await beforeSave(data);
      if (!shouldSave) return;
    }
    setSaving(true);
    setError(null);
    try {
      const response = await ApiService.saveConfig(configEndpoint, data);
      if (response.status !== 200) {
        const errorText = await response.text();
        throw new Error(errorText || `Server returned ${response.status}`);
      }
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setSaving(false);
      // Reload tab data on error
      loadConfig();
    }
  };

  const handleCancel = () => {
    window.location.href = '/';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="settings-page">
      {error && (
        <div className="error-popup">
          <div className="error-popup-content">
            <p>{error}</p>
            <button onClick={() => setError(null)}>OK</button>
          </div>
        </div>
      )}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { data, onDataChange: handleDataChange })
          : child
      )}
      <SaveCancelBar
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
};

export default SettingsPage;