import React, { useState, useEffect } from 'react';
import ApiService from './ApiService';
import SaveCancelBar from './SaveCancelBar.jsx';
import SavingOverlay from './SavingOverlay.jsx';

const SettingsPage = ({ configEndpoint, defaultData, onDataLoaded, beforeSave, saveDataTransform, children, enableRedirect = true }) => {
  const [data, setData] = useState(defaultData);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState(null);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await ApiService.fetchConfig(configEndpoint);
      setData({ ...defaultData, ...config });
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

  const handleRefreshData = (serverData) => {
    setData({ ...defaultData, ...serverData });
    setOriginalData(JSON.parse(JSON.stringify(serverData)));
  };

  const handleSave = async () => {
    if (beforeSave) {
      const shouldSave = await beforeSave(data);
      if (!shouldSave) return;
    }
    setSaving(true);
    setError(null);
    setSaveStatus('saving');
    setSaveError(null);
    try {
      const saveData = saveDataTransform ? saveDataTransform(data) : data;
      const savedData = await ApiService.saveConfig(configEndpoint, saveData);
      if (enableRedirect) {
        window.location.href = '/';
      } else {
        setSaving(false);
        handleRefreshData(savedData);
        setSaveStatus('done');
      }
    } catch (err) {
      setSaving(false);
      setSaveError(err.message);
      setSaveStatus('error');
    }
  };

  const handleDismissSaving = () => {
    setSaveStatus('idle');
    setSaveError(null);
  };

  const handleCancel = () => {
    if (enableRedirect) {
      window.location.href = '/';
    } else {
      loadConfig();
    }
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
          ? React.cloneElement(child, { data, onDataChange: handleDataChange, onRefreshData: handleRefreshData })
          : child
      )}
      <SaveCancelBar
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
      <SavingOverlay
        status={saveStatus}
        errorMessage={saveError}
        onDismiss={handleDismissSaving}
      />
    </div>
  );
};

export default SettingsPage;