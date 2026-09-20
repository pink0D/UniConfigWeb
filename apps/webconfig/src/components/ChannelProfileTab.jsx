import React from 'react';
import SettingsPage from './SettingsPage.jsx';
import ModuleSettings from './ModuleSettings.jsx';
import { cleanChannel } from './ChannelSettings.jsx';

const EMPTY_CHANNEL = {
  type: '',
  input: '',
  invertInput: false,
  reverseButton: '',
  brake: '',
  brakeTimeout: 50,
  button1: '',
  button2: '',
  buttonStop: '',
  minPower: 0,
  maxPower: 100,
  softStartTime: 0,
  servoUnits: 'angle',
  servoMin: 500,
  servoMax: 2500,
  servoMaxAngle: 180,
  servoCenterPos: 0,
  sticky: false,
  stepCount: 1,
};

const defaultData = {
  channelCount: 0,
  channels: [],
};

const getChannelLabel = (channel, index, channelType) => {
  const label = channel && channel.label;
  if (label && label.trim() !== '') {
    return label;
  }
  if (channelType === 'hdriver') {
    return `Motor ${String.fromCharCode(65 + index)}`;
  }
  return `Servo ${index + 1}`;
};

const ChannelProfileForm = ({ data, onDataChange, channelType }) => {
  const channelCount = Number(data.channelCount) || 0;

  const buildChannels = () =>
    Array.from({ length: channelCount }, (_, index) => {
      const channel = data.channels && data.channels[index];
      return channel || { ...EMPTY_CHANNEL };
    });

  const channels = buildChannels();
  const channelLabels = channels.map((channel, index) =>
    getChannelLabel(channel, index, channelType)
  );

  const handleChannelChange = (index, updated) => {
    const nextChannels = buildChannels();
    nextChannels[index] = updated;
    onDataChange({ ...data, channels: nextChannels });
  };

  return (
    <>
      {channelCount > 0 && (
        <ModuleSettings
          channels={channels}
          channelLabels={channelLabels}
          channelType={channelType}
          onChannelChange={handleChannelChange}
        />
      )}
    </>
  );
};

const cleanChannelData = (data) => {
  const cleaned = JSON.parse(JSON.stringify(data));
  const channelCount = Number(cleaned.channelCount) || 0;
  cleaned.channels = (cleaned.channels || [])
    .slice(0, channelCount)
    .map((channel) => cleanChannel(channel));
  return cleaned;
};

const createChannelProfileTab = (channelType) => {
  const ChannelProfileTab = ({ configEndpoint, enableRedirect = true }) => (
    <SettingsPage
      configEndpoint={configEndpoint}
      defaultData={defaultData}
      saveDataTransform={cleanChannelData}
      enableRedirect={enableRedirect}
    >
      <ChannelProfileForm channelType={channelType} />
    </SettingsPage>
  );

  return ChannelProfileTab;
};

export default createChannelProfileTab;
