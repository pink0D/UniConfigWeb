import React from 'react';
import ChannelSettings from './ChannelSettings.jsx';

const ModuleSettings = ({ channels, channelLabels, channelType, onChannelChange }) => {
  return (
    <div>
      <h3 className="section-title">Channels</h3>
      {channels.map((channel, index) => (
        <ChannelSettings
          key={index}
          channel={channel}
          index={index}
          label={channelLabels[index]}
          channelType={channelType}
          onChannelChange={onChannelChange}
        />
      ))}
    </div>
  );
};

export default ModuleSettings;