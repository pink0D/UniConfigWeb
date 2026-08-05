import React from 'react';

const WiFiNetworkList = ({ networks, onChange }) => {
  const handleAdd = () => {
    const newNetworks = [...networks, { ssid: '', password: '' }];
    onChange(newNetworks);
  };

  const handleRemove = (index) => {
    const newNetworks = networks.filter((_, i) => i !== index);
    onChange(newNetworks);
  };

  const handleChange = (index, field, value) => {
    const newNetworks = networks.map((net, i) =>
      i === index ? { ...net, [field]: value } : net
    );
    onChange(newNetworks);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newNetworks = [...networks];
    [newNetworks[index - 1], newNetworks[index]] = [newNetworks[index], newNetworks[index - 1]];
    onChange(newNetworks);
  };

  const handleMoveDown = (index) => {
    if (index === networks.length - 1) return;
    const newNetworks = [...networks];
    [newNetworks[index], newNetworks[index + 1]] = [newNetworks[index + 1], newNetworks[index]];
    onChange(newNetworks);
  };

  return (
    <div className="wifi-network-list">
      {networks.map((net, index) => (
        <div
          key={index}
          className="network-row"
        >
          <div className="move-buttons">
            <button
              className="btn-move btn-move-up"
              onClick={() => handleMoveUp(index)}
              disabled={index === 0}
              title="Move up"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 3L2 8h8L6 3z" />
              </svg>
            </button>
            <button
              className="btn-move btn-move-down"
              onClick={() => handleMoveDown(index)}
              disabled={index === networks.length - 1}
              title="Move down"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 9L2 4h8L6 9z" />
              </svg>
            </button>
          </div>
          <input
            className="network-input"
            type="text"
            placeholder="SSID"
            value={net.ssid}
            onChange={(e) => handleChange(index, 'ssid', e.target.value)}
          />
          <input
            className="network-input"
            type="password"
            placeholder="No Password"
            value={net.password}
            onChange={(e) => handleChange(index, 'password', e.target.value)}
          />
          <button
            className="btn-delete"
            onClick={() => handleRemove(index)}
            title="Remove network"
          >
            &#10005;
          </button>
        </div>
      ))}
      <div className="network-row network-add-row" onClick={handleAdd}>
        <span className="add-icon-text">+</span>
        <div className="network-placeholder">
          Add network
        </div>
      </div>
    </div>
  );
};

export default WiFiNetworkList;
