import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsLayout, MouldKingTab, CameraTab, WiFiManagerTab } from 'shared-ui';

const TABS = [
  { key: 'mouldking', label: 'Mould King' },
  { key: 'camera', label: 'Camera' },
  { key: 'wifi', label: 'WiFi' },
];

const App = () => {
  return (
    <SettingsLayout tabs={TABS}>
      <Routes>
        <Route path="/" element={<Navigate to="mouldking" replace />} />
        <Route path="/mouldking" element={
          <MouldKingTab configEndpoint="/config/MouldKingProfile" />
        } />
        <Route path="/camera" element={
          <CameraTab configEndpoint="/config/ESP32Camera" />
        } />
        <Route path="/wifi" element={
          <WiFiManagerTab configEndpoint="/config/WiFiManager" />
        } />
      </Routes>
    </SettingsLayout>
  );
};

export default App;
