import React from 'react';

const TelegramBot = ({ settings = {}, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <>
      <h3 className="section-title">Telegram Bot</h3>
      <div className="section-toggle">
        <span className="toggle-label">Enable notifications</span>
        <label className="invert-switch">
          <input
            type="checkbox"
            checked={!!settings.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      <div className="form-field">
        <label className="form-label">Bot Token</label>
        <input
          className="form-input"
          type="text"
          value={settings.botToken || ''}
          onChange={(e) => handleChange('botToken', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Chat ID</label>
        <input
          className="form-input"
          type="text"
          value={settings.chatId || ''}
          onChange={(e) => handleChange('chatId', e.target.value)}
        />
      </div>
      <div className="form-field">
        <label className="form-label">Device Name</label>
        <input
          className="form-input"
          type="text"
          value={settings.deviceName || ''}
          onChange={(e) => handleChange('deviceName', e.target.value)}
        />
      </div>
    </>
  );
};

export default TelegramBot;
