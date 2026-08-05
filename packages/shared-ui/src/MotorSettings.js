import React from 'react';

const INPUT_OPTIONS = ['', 'LeftStickX', 'LeftStickY', 'RightStickX', 'RightStickY', 'LeftTrigger', 'RightTrigger'];
const BUTTON_OPTIONS = ['', 'Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'DPadUp', 'DPadDown', 'DPadLeft', 'DPadRight'];

const CHANNEL_LABELS = ['Channel A', 'Channel B', 'Channel C', 'Channel D', 'Channel E', 'Channel F'];

const MotorSettings = ({ channel, index, onChannelChange }) => {
  const handleModeChange = (mode) => {
    const updated = { ...channel };
    if (mode === 'input') {
      updated.input = updated.input || INPUT_OPTIONS[1];
      updated.button = '';
    } else {
      updated.button = updated.button || BUTTON_OPTIONS[1];
      updated.input = '';
    }
    onChannelChange(index, updated);
  };

  const isInputMode = channel.input !== '' || (channel.input === '' && channel.button === '');

  return (
    <div className="channel-settings">
      <h4 className="channel-name">{CHANNEL_LABELS[index]}</h4>
      <div className="channel-row">
        <div className="mode-switch">
          <label className={`mode-option ${isInputMode ? 'active' : ''}`}>
            <input
              type="radio"
              name={`mode-${index}`}
              checked={isInputMode}
              onChange={() => handleModeChange('input')}
            />
            Input
          </label>
          <label className={`mode-option ${!isInputMode ? 'active' : ''}`}>
            <input
              type="radio"
              name={`mode-${index}`}
              checked={!isInputMode}
              onChange={() => handleModeChange('button')}
            />
            Button
          </label>
        </div>
        {isInputMode ? (
          <select
            className="setting-select"
            value={channel.input || ''}
            onChange={(e) => {
              const updated = { ...channel, input: e.target.value };
              onChannelChange(index, updated);
            }}
          >
            {INPUT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === '' ? 'Empty' : opt}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="setting-select"
            value={channel.button || ''}
            onChange={(e) => {
              const updated = { ...channel, button: e.target.value };
              onChannelChange(index, updated);
            }}
          >
            {BUTTON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === '' ? 'Empty' : opt}
              </option>
            ))}
          </select>
        )}
        <label className="invert-switch">
          <input
            type="checkbox"
            checked={channel.invert}
            onChange={(e) => {
              const updated = { ...channel, invert: e.target.checked };
              onChannelChange(index, updated);
            }}
          />
          <span className="toggle-slider"></span>
          Invert
        </label>
      </div>
    </div>
  );
};

export default MotorSettings;