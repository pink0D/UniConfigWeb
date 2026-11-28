import React from 'react';

const BluetoothSettings = ({ value = false, onChange }) => {
  return (
    <>
      <h3 className="section-title">Bluetooth</h3>
      <div className="section-toggle">
        <span className="toggle-label">Enable pairing after startup</span>
        <label className="invert-switch">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </>
  );
};

export default BluetoothSettings;
