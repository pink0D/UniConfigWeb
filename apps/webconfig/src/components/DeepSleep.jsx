import React from 'react';

const DeepSleep = ({ value = false, onChange }) => {
  return (
    <>
      <h3 className="section-title">Deep Sleep</h3>
      <div className="section-toggle">
        <span className="toggle-label">Enable Deep Sleep mode</span>
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

export default DeepSleep;