import React, { useState, useRef } from 'react';
import SettingsPage from './SettingsPage.jsx';
import WiFiNetworkList from './WiFiNetworkList.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const defaultData = {
  hostname: '',
  timeout: 15,
  ap: {
    ssid: '',
    password: '',
  },
  networks: [],
};

const WIFI_CONFIRM_MSG =
  "The device will be rebooted. If you can't access the device, flash the firmware to reset settings";

const WiFiForm = ({ data, onDataChange }) => {
  const handleChange = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  const handleApChange = (field, value) => {
    onDataChange({
      ...data,
      ap: { ...data.ap, [field]: value },
    });
  };

  const handleNetworksChange = (networks) => {
    onDataChange({ ...data, networks });
  };

  return (
    <>
      <div className="form-field">
        <label className="form-label">Hostname</label>
        <input
          className="form-input"
          type="text"
          value={data.hostname}
          onChange={(e) => handleChange('hostname', e.target.value)}
          placeholder="Hostname"
        />
      </div>

      <div className="form-field">
        <label className="form-label">WiFi Connection Timeout (sec)</label>
        <input
          className="form-input"
          type="number"
          value={data.timeout}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              handleChange('timeout', val);
            } else if (e.target.value === '') {
              handleChange('timeout', 0);
            }
          }}
          placeholder="Timeout in seconds"
        />
      </div>

      <div>
        <h3 className="section-title">WiFi Networks</h3>
        <WiFiNetworkList
          networks={data.networks}
          onChange={handleNetworksChange}
        />
      </div>

      <p className="comment-text">
        In case ESP32 can't connect to any network, it creates an Access Point
      </p>

      <div className="form-field">
        <label className="form-label">Access Point SSID</label>
        <input
          className="form-input"
          type="text"
          value={data.ap.ssid}
          onChange={(e) => handleApChange('ssid', e.target.value)}
          placeholder="AP SSID"
        />
      </div>

      <div className="form-field">
        <label className="form-label">Access Point Password</label>
        <input
          className="form-input"
          type="password"
          value={data.ap.password}
          onChange={(e) => handleApChange('password', e.target.value)}
          placeholder="AP Password"
        />
      </div>
    </>
  );
};

const WiFiManagerTab = ({ configEndpoint }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmResolveRef = useRef(null);

  const handleBeforeSave = () => {
    return new Promise((resolve) => {
      confirmResolveRef.current = resolve;
      setShowConfirm(true);
    });
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    if (confirmResolveRef.current) {
      confirmResolveRef.current(true);
      confirmResolveRef.current = null;
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    if (confirmResolveRef.current) {
      confirmResolveRef.current(false);
      confirmResolveRef.current = null;
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          message={WIFI_CONFIRM_MSG}
          onConfirm={handleConfirm}
          onCancel={handleCancelConfirm}
        />
      )}
      <SettingsPage
        configEndpoint={configEndpoint}
        defaultData={defaultData}
        beforeSave={handleBeforeSave}
      >
        <WiFiForm />
      </SettingsPage>
    </>
  );
};

export default WiFiManagerTab;