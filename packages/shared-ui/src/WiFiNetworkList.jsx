import React, { useRef } from 'react';

const WiFiNetworkList = ({ networks, onChange }) => {
  const dragItem = useRef(null);

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

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    // Hide the default drag ghost image
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index) => {
    if (dragItem.current === null) return;
    if (dragItem.current === index) return;
    const newNetworks = [...networks];
    const draggedItem = newNetworks.splice(dragItem.current, 1)[0];
    newNetworks.splice(index, 0, draggedItem);
    dragItem.current = index;
    onChange(newNetworks);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  return (
    <div className="wifi-network-list">
      {networks.map((net, index) => (
        <div
          key={index}
          className="network-row"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="drag-handle" title="Drag to reorder">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="5" cy="4" r="1.5" />
              <circle cx="11" cy="4" r="1.5" />
              <circle cx="5" cy="8" r="1.5" />
              <circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="11" cy="12" r="1.5" />
            </svg>
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
      <div className="network-row network-add-row">
        <div className="drag-handle add-icon" onClick={handleAdd} title="Add network">
          <span className="plus-icon">+</span>
        </div>
        <div className="network-placeholder" onClick={handleAdd}>
          Add network
        </div>
      </div>
    </div>
  );
};

export default WiFiNetworkList;