import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsLayout, MouldKingTab, CameraTab, WiFiManagerTab } from 'shared-ui';
import ApiService from 'shared-ui/ApiService';

const COMPONENT_MAP = {
  MouldKingProfile: MouldKingTab,
  ESP32Camera: CameraTab,
  WiFiManager: WiFiManagerTab,
};

const App = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ApiService.fetchConfig('/config')
      .then((data) => {
        if (data.setting_title) {
          document.title = data.setting_title;
        }
        setConfig(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Failed to load config: {error}</div>;
  }

  const components = config?.components || [];
  const enableRedirect = config?.settings_save_redirect !== false;

  // Build tabs from config: iterate COMPONENT_MAP to preserve order
  const tabs = Object.keys(COMPONENT_MAP)
    .filter((name) => components.some((c) => c.name === name))
    .map((name) => {
      const comp = components.find((c) => c.name === name);
      return {
        key: name,
        label: comp.label || name,
        name,
      };
    });

  const firstTab = tabs.length > 0 ? tabs[0].key : null;

  return (
    <SettingsLayout tabs={tabs}>
      <Routes>
        {firstTab && (
          <Route path="/" element={<Navigate to={firstTab} replace />} />
        )}
        {tabs.map((tab) => {
          const TabComponent = COMPONENT_MAP[tab.name];
          const configEndpoint = `/config/${tab.name}`;
          return (
            <Route
              key={tab.name}
              path={`/${tab.name}`}
              element={<TabComponent configEndpoint={configEndpoint} label={tab.label} enableRedirect={enableRedirect} />}
            />
          );
        })}
      </Routes>
    </SettingsLayout>
  );
};

export default App;
