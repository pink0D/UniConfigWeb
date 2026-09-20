import React from 'react';
import SettingsPage from './SettingsPage.jsx';
import ModuleSettings from './ModuleSettings.jsx';
import { cleanChannel } from './ChannelSettings.jsx';

const getModuleTypes = (enableMultiModule) => {
  const types = ['None', 'MK40'];
  if (enableMultiModule) {
    types.push('MK40x3');
  }
  types.push('MK60');
  return types;
};

const MOULDKING_CHANNEL_LABELS = ['Channel A', 'Channel B', 'Channel C', 'Channel D', 'Channel E', 'Channel F'];

const MOULDKING_MULTI_CHANNEL_LABELS = [
  'Module 1 - Channel A', 'Module 1 - Channel B', 'Module 1 - Channel C', 'Module 1 - Channel D',
  'Module 2 - Channel A', 'Module 2 - Channel B', 'Module 2 - Channel C', 'Module 2 - Channel D',
  'Module 3 - Channel A', 'Module 3 - Channel B', 'Module 3 - Channel C', 'Module 3 - Channel D',
];

const getChannelCount = (moduleType) => {
  if (moduleType === 'MK40') return 4;
  if (moduleType === 'MK40x3') return 12;
  if (moduleType === 'MK60') return 6;
  return 0;
};

const defaultData = {
  moduleType: 'None',
  channels: [
    { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' },
    { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' },
    { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' },
    { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' },
    { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' },
    { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' },
  ],
};

const normalizeModuleType = (type) => {
  if (!type || type === '') return 'None';
  return type;
};

const MouldKingForm = ({ data, onDataChange, channelType, enableMultiModule }) => {
  const moduleType = normalizeModuleType(data.moduleType);
  const moduleTypes = getModuleTypes(enableMultiModule);

  const handleModuleTypeChange = (type) => {
    const channelCount = getChannelCount(type);
    const currentChannels = data.channels || [];
    const channels = [];
    const emptyChannel = { input: '', invertInput: false, button1: '', button2: '', brake: '', brakeTimeout: 50, minPower: 0, maxPower: 100, servoUnits: 'angle', servoMin: 500, servoMax: 2500, servoMaxAngle: 180, servoCenterPos: 0, sticky: false, buttonStop: '', steps: 0, type: '' };
    const maxChannels = 12;
    for (let i = 0; i < maxChannels; i++) {
      if (i < channelCount) {
        channels.push(currentChannels[i] || emptyChannel);
      } else {
        channels.push({ ...emptyChannel });
      }
    }
    onDataChange({ ...data, moduleType: type, channels });
  };

  const handleChannelChange = (index, updated) => {
    const channels = [...data.channels];
    channels[index] = updated;
    onDataChange({ ...data, channels });
  };

  const channelCount = getChannelCount(moduleType);

  return (
    <>
      <div className="form-field">
        <span className="form-label">Module Type</span>
        <div className="radio-group">
          {moduleTypes.map((type) => (
            <label
              key={type}
              className={`radio-option ${moduleType === type ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="moduleType"
                value={type}
                checked={moduleType === type}
                onChange={() => handleModuleTypeChange(type)}
              />
              {type === 'None' ? 'Disabled' : type === 'MK40' ? 'MK 4.0' : type === 'MK40x3' ? 'MK 4.0 x3' : 'MK 6.0'}
            </label>
          ))}
        </div>
      </div>
      {channelCount > 0 && (
        <ModuleSettings
          channels={data.channels.slice(0, channelCount)}
          channelLabels={moduleType === 'MK40x3' ? MOULDKING_MULTI_CHANNEL_LABELS : MOULDKING_CHANNEL_LABELS}
          channelType={channelType}
          onChannelChange={handleChannelChange}
        />
      )}
    </>
  );
};

const cleanChannelData = (data) => {
  const cleaned = JSON.parse(JSON.stringify(data));
  cleaned.channels = cleaned.channels.map((channel) => cleanChannel(channel));
  return cleaned;
};

const MouldKingTab = ({ configEndpoint, channelType = 'mk_advanced', enableMultiModule = false, label = 'Mould King' }) => {
  return (
    <SettingsPage
      configEndpoint={configEndpoint}
      defaultData={defaultData}
      saveDataTransform={cleanChannelData}
    >
      <MouldKingForm channelType={channelType} enableMultiModule={enableMultiModule} />
    </SettingsPage>
  );
};

export default MouldKingTab;
