import React from 'react';

const INPUT_OPTIONS = ['', 'LeftStickX', 'LeftStickY', 'RightStickX', 'RightStickY', 'LeftTrigger', 'RightTrigger'];
const BUTTON_OPTIONS = ['', 'DPadUp', 'DPadDown', 'DPadLeft', 'DPadRight', 'Cross', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'L3', 'R3', 'Share', 'Options'];
const BRAKE_OPTIONS = ['', 'L2', 'R2'];
const SERVO_UNITS_OPTIONS = ['angle', 'micros'];

const STEPS_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

export const cleanChannel = (channel) => {
  const clean = { ...channel };
  const mode = clean.type || '';

  if (mode === '') {
    // Disabled: clear all parameters to empty/zero values
    clean.input = '';
    clean.invertInput = false;
    clean.reverseButton = '';
    clean.button1 = '';
    clean.button2 = '';
    clean.buttonStop = '';
    clean.sticky = false;
    clean.steps = 0;
    clean.brake = '';
    clean.brakeTimeout = 0;
    clean.minPower = 0;
    clean.maxPower = 0;
    clean.servoUnits = 'angle';
    clean.servoMin = 0;
    clean.servoMax = 0;
    clean.servoMaxAngle = 0;
    clean.servoCenterPos = 0;
  } else if (mode === 'Analog') {
    // Analog: clear button/stepper-related fields
    clean.button1 = '';
    clean.button2 = '';
    clean.buttonStop = '';
    clean.sticky = false;
    clean.steps = 0;
  } else if (mode === 'buttons' || mode === 'stepper') {
    // Buttons / Stepper: clear analog-related fields
    clean.input = '';
    clean.invertInput = false;
    clean.reverseButton = '';
    clean.brake = '';
    clean.brakeTimeout = 0;
  }

  return clean;
};

const ChannelSettings = ({ channel, index, label, channelType, onChannelChange }) => {
  const mode = channel.type || '';

  const inputOptions = channelType === 'mk_simple'
    ? INPUT_OPTIONS.filter(opt => opt !== 'LeftTrigger' && opt !== 'RightTrigger')
    : INPUT_OPTIONS;

  const handleModeChange = (newType) => {
    const updated = { ...channel, type: newType };
    onChannelChange(index, updated);
  };

  return (
    <div className="channel-settings">
      <h4 className="channel-name">{label}</h4>
      <div className="channel-row">
        <div className="mode-switch">
          <label className={`mode-option ${mode === '' ? 'active' : ''}`}>
            <input
              type="radio"
              name={`mode-${index}`}
              checked={mode === ''}
              onChange={() => handleModeChange('')}
            />
            Disabled
          </label>
          <label className={`mode-option ${mode === 'Analog' ? 'active' : ''}`}>
            <input
              type="radio"
              name={`mode-${index}`}
              checked={mode === 'Analog'}
              onChange={() => handleModeChange('Analog')}
            />
            Analog
          </label>
          <label className={`mode-option ${mode === 'buttons' ? 'active' : ''}`}>
            <input
              type="radio"
              name={`mode-${index}`}
              checked={mode === 'buttons'}
              onChange={() => handleModeChange('buttons')}
            />
            Buttons
          </label>
          {channelType !== 'mk_simple' && (
          <label className={`mode-option ${mode === 'stepper' ? 'active' : ''}`}>
            <input
              type="radio"
              name={`mode-${index}`}
              checked={mode === 'stepper'}
              onChange={() => handleModeChange('stepper')}
            />
            Stepper
          </label>
          )}
        </div>
        {mode !== '' && (
          <div className="channel-controls">
            <div className="channel-settings-body">
            {mode === 'Analog' && (
              <div className="analog-settings">
                <div className="channel-row">
                  <label className="setting-label">Input</label>
                  <select
                    className="setting-select"
                    value={channel.input || ''}
                    onChange={(e) => {
                      const updated = { ...channel, input: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {inputOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                  <label className="invert-switch">
                    <input
                      type="checkbox"
                      checked={channel.invertInput || false}
                      onChange={(e) => {
                        const updated = { ...channel, invertInput: e.target.checked };
                        onChannelChange(index, updated);
                      }}
                    />
                    <span className="toggle-slider"></span>
                    Invert
                  </label>
                </div>
                {(channel.input === 'LeftTrigger' || channel.input === 'RightTrigger') && (
                  <div className="channel-row">
                    <label className="setting-label">Reverse</label>
                    <select
                      className="setting-select"
                      value={channel.reverseButton || ''}
                      onChange={(e) => {
                        const updated = { ...channel, reverseButton: e.target.value };
                        onChannelChange(index, updated);
                      }}
                    >
                      {BUTTON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt === '' ? '(disabled)' : opt}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {channelType !== 'servo' && channelType !== 'mk_simple' && (
                <div className="channel-row">
                  <label className="setting-label">Brake</label>
                  <select
                    className="setting-select"
                    value={channel.brake || ''}
                    onChange={(e) => {
                      const updated = { ...channel, brake: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {BRAKE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                </div>
                )}
                {channel.brake && channelType === 'mk_advanced' && (
                  <div className="channel-row">
                    <label className="setting-label">Braking time</label>
                    <button
                      className="btn-stepper"
                      onClick={() => {
                        const val = Math.max(50, (channel.brakeTimeout || 50) - 50);
                        onChannelChange(index, { ...channel, brakeTimeout: val });
                      }}
                    >−</button>
                    <input
                      className="stepper-input"
                      type="number"
                      min={50}
                      max={500}
                      step={50}
                      value={channel.brakeTimeout ?? 50}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 50 && v <= 500) {
                          onChannelChange(index, { ...channel, brakeTimeout: v });
                        }
                      }}
                    />
                    <button
                      className="btn-stepper"
                      onClick={() => {
                        const val = Math.min(500, (channel.brakeTimeout || 50) + 50);
                        onChannelChange(index, { ...channel, brakeTimeout: val });
                      }}
                    >+</button>
                  </div>
                )}
              </div>
            )}
            {mode === 'buttons' && (
              <div className="analog-settings">
                <div className="channel-row">
                  <label className="setting-label">Up</label>
                  <select
                    className="setting-select"
                    value={channel.button1 || ''}
                    onChange={(e) => {
                      const updated = { ...channel, button1: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {BUTTON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="channel-row">
                  <label className="setting-label">Down</label>
                  <select
                    className="setting-select"
                    value={channel.button2 || ''}
                    onChange={(e) => {
                      const updated = { ...channel, button2: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {BUTTON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                </div>
                {channelType !== 'mk_simple' && (
                <div className="channel-row">
                  <label className="invert-switch">
                    <input
                      type="checkbox"
                      checked={channel.sticky || false}
                      onChange={(e) => {
                        const updated = { ...channel, sticky: e.target.checked };
                        onChannelChange(index, updated);
                      }}
                    />
                    <span className="toggle-slider"></span>
                    Sticky buttons
                  </label>
                </div>
                )}
              </div>
            )}
            {mode === 'stepper' && (
              <div className="analog-settings">
                <div className="channel-row">
                  <label className="setting-label">Up</label>
                  <select
                    className="setting-select"
                    value={channel.button1 || ''}
                    onChange={(e) => {
                      const updated = { ...channel, button1: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {BUTTON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="channel-row">
                  <label className="setting-label">Down</label>
                  <select
                    className="setting-select"
                    value={channel.button2 || ''}
                    onChange={(e) => {
                      const updated = { ...channel, button2: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {BUTTON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="channel-row">
                  <label className="setting-label">Stop</label>
                  <select
                    className="setting-select"
                    value={channel.buttonStop || ''}
                    onChange={(e) => {
                      const updated = { ...channel, buttonStop: e.target.value };
                      onChannelChange(index, updated);
                    }}
                  >
                    {BUTTON_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === '' ? '(disabled)' : opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="channel-row">
                  <label className="setting-label">Number of steps</label>
                  <select
                    className="setting-select"
                    value={channel.steps || 1}
                    onChange={(e) => {
                      const updated = { ...channel, steps: parseInt(e.target.value, 10) };
                      onChannelChange(index, updated);
                    }}
                  >
                    {STEPS_OPTIONS.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {channelType === 'hdriver' && (
            <div className="channel-row">
              <label className="setting-label">Min power</label>
              <button
                className="btn-stepper"
                onClick={() => {
                  const val = Math.max(0, (channel.minPower ?? 0) - 5);
                  onChannelChange(index, { ...channel, minPower: val });
                }}
              >−</button>
              <input
                className="stepper-input"
                type="number"
                min={0}
                max={95}
                step={5}
                value={channel.minPower ?? 0}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 0 && v <= 95) {
                    onChannelChange(index, { ...channel, minPower: v });
                  }
                }}
              />
              <button
                className="btn-stepper"
                onClick={() => {
                  const val = Math.min(95, (channel.minPower ?? 0) + 5);
                  onChannelChange(index, { ...channel, minPower: val });
                }}
              >+</button>
            </div>
            )}
            {(channelType === 'hdriver' || channelType === 'mk_advanced') && (
            <div className="channel-row">
              <label className="setting-label">Max power</label>
              <button
                className="btn-stepper"
                onClick={() => {
                  const val = Math.max(5, (channel.maxPower ?? 100) - 5);
                  onChannelChange(index, { ...channel, maxPower: val });
                }}
              >−</button>
              <input
                className="stepper-input"
                type="number"
                min={5}
                max={100}
                step={5}
                value={channel.maxPower ?? 100}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 5 && v <= 100) {
                    onChannelChange(index, { ...channel, maxPower: v });
                  }
                }}
              />
              <button
                className="btn-stepper"
                onClick={() => {
                  const val = Math.min(100, (channel.maxPower ?? 100) + 5);
                  onChannelChange(index, { ...channel, maxPower: val });
                }}
              >+</button>
            </div>
            )}
            {channelType === 'hdriver' && (
            <div className="channel-row">
              <label className="setting-label">Soft start time</label>
              <button
                className="btn-stepper"
                onClick={() => {
                  const val = Math.max(0, (channel.softStartTime ?? 0) - 50);
                  onChannelChange(index, { ...channel, softStartTime: val });
                }}
              >−</button>
              <input
                className="stepper-input"
                type="number"
                min={0}
                max={500}
                step={50}
                value={channel.softStartTime ?? 0}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 0 && v <= 500) {
                    onChannelChange(index, { ...channel, softStartTime: v });
                  }
                }}
              />
              <button
                className="btn-stepper"
                onClick={() => {
                  const val = Math.min(500, (channel.softStartTime ?? 0) + 50);
                  onChannelChange(index, { ...channel, softStartTime: val });
                }}
              >+</button>
            </div>
            )}
            {channelType === 'servo' && (
            <>
            <div className="channel-row">
              <label className="setting-label">Servo units</label>
              <select
                className="setting-select"
                value={channel.servoUnits || 'angle'}
                onChange={(e) => {
                  const updated = { ...channel, servoUnits: e.target.value };
                  onChannelChange(index, updated);
                }}
              >
                {SERVO_UNITS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            {channel.servoUnits === 'micros' && (
              <>
                <div className="channel-row">
                  <label className="setting-label">Servo min</label>
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.max(500, (channel.servoMin ?? 500) - 50);
                      onChannelChange(index, { ...channel, servoMin: val });
                    }}
                  >−</button>
                  <input
                    className="stepper-input"
                    type="number"
                    min={500}
                    max={2500}
                    step={50}
                    value={channel.servoMin ?? 500}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 500 && v <= 2500) {
                        onChannelChange(index, { ...channel, servoMin: v });
                      }
                    }}
                  />
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.min(2500, (channel.servoMin ?? 500) + 50);
                      onChannelChange(index, { ...channel, servoMin: val });
                    }}
                  >+</button>
                </div>
                <div className="channel-row">
                  <label className="setting-label">Servo max</label>
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.max(500, (channel.servoMax ?? 2500) - 50);
                      onChannelChange(index, { ...channel, servoMax: val });
                    }}
                  >−</button>
                  <input
                    className="stepper-input"
                    type="number"
                    min={500}
                    max={2500}
                    step={50}
                    value={channel.servoMax ?? 2500}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 500 && v <= 2500) {
                        onChannelChange(index, { ...channel, servoMax: v });
                      }
                    }}
                  />
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.min(2500, (channel.servoMax ?? 2500) + 50);
                      onChannelChange(index, { ...channel, servoMax: val });
                    }}
                  >+</button>
                </div>
              </>
            )}
            {channel.servoUnits !== 'micros' && (
              <>
                <div className="channel-row">
                  <label className="setting-label">Servo max angle</label>
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.max(5, (channel.servoMaxAngle ?? 180) - 5);
                      onChannelChange(index, { ...channel, servoMaxAngle: val });
                    }}
                  >−</button>
                  <input
                    className="stepper-input"
                    type="number"
                    min={5}
                    max={180}
                    step={5}
                    value={channel.servoMaxAngle ?? 180}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= 5 && v <= 180) {
                        onChannelChange(index, { ...channel, servoMaxAngle: v });
                      }
                    }}
                  />
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.min(180, (channel.servoMaxAngle ?? 180) + 5);
                      onChannelChange(index, { ...channel, servoMaxAngle: val });
                    }}
                  >+</button>
                </div>
                <div className="channel-row">
                  <label className="setting-label">Servo center pos</label>
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.max(-180, (channel.servoCenterPos ?? 0) - 5);
                      onChannelChange(index, { ...channel, servoCenterPos: val });
                    }}
                  >−</button>
                  <input
                    className="stepper-input"
                    type="number"
                    min={-180}
                    max={180}
                    step={5}
                    value={channel.servoCenterPos ?? 0}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!isNaN(v) && v >= -180 && v <= 180) {
                        onChannelChange(index, { ...channel, servoCenterPos: v });
                      }
                    }}
                  />
                  <button
                    className="btn-stepper"
                    onClick={() => {
                      const val = Math.min(180, (channel.servoCenterPos ?? 0) + 5);
                      onChannelChange(index, { ...channel, servoCenterPos: val });
                    }}
                  >+</button>
                </div>
              </>
            )}
            </>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelSettings;