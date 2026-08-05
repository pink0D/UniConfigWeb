import React from 'react';
import SettingsPage from './SettingsPage.jsx';
import MotorSettings from './MotorSettings.jsx';

const MODULE_TYPES = ['None', 'MK40', 'MK60'];

const getChannelCount = (moduleType) => {
  if (moduleType === 'MK40') return 4;
  if (moduleType === 'MK60') return 6;
  return 0;
};

const defaultData = {
  moduleType: 'None',
  channels: [
    { input: '', button: '', invert: false },
    { input: '', button: '', invert: false },
    { input: '', button: '', invert: false },
    { input: '', button: '', invert: false },
    { input: '', button: '', invert: false },
    { input: '', button: '', invert: false },
  ],
};

const MouldKingForm = ({ data, onDataChange }) => {
  const handleModuleTypeChange = (type) => {
    const channelCount = getChannelCount(type);
    const currentChannels = data.channels || [];
    const channels = [];
    for (let i = 0; i < 6; i++) {
      if (i < channelCount) {
        channels.push(currentChannels[i] || { input: '', button: '', invert: false });
      } else {
        channels.push({ input: '', button: '', invert: false });
      }
    }
    onDataChange({ ...data, moduleType: type, channels });
  };

  const handleChannelChange = (index, updated) => {
    const channels = [...data.channels];
    channels[index] = updated;
    onDataChange({ ...data, channels });
  };

  const channelCount = getChannelCount(data.moduleType);

  return (
    <>
      <div className="form-field">
        <span className="form-label">Module Type</span>
        <div className="radio-group">
          {MODULE_TYPES.map((type) => (
            <label
              key={type}
              className={`radio-option ${data.moduleType === type ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="moduleType"
                value={type}
                checked={data.moduleType === type}
                onChange={() => handleModuleTypeChange(type)}
              />
              {type === 'None' ? 'Disabled' : type === 'MK40' ? 'MK 4.0' : 'MK 6.0'}
            </label>
          ))}
        </div>
      </div>
      {channelCount > 0 && (
        <div>
          <h3 className="section-title">Channels</h3>
          {data.channels.slice(0, channelCount).map((channel, index) => (
            <MotorSettings
              key={index}
              channel={channel}
              index={index}
              onChannelChange={handleChannelChange}
            />
          ))}
        </div>
      )}
    </>
  );
};

const MouldKingTab = ({ configEndpoint }) => {
  return (
    <SettingsPage
      configEndpoint={configEndpoint}
      defaultData={defaultData}
    >
      <MouldKingForm />
    </SettingsPage>
  );
};

export default MouldKingTab;