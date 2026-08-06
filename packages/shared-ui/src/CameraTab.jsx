import React from 'react';
import SettingsPage from './SettingsPage.jsx';

const RESOLUTIONS = [
  'QVGA 320x240',
  'CIF 400x296',
  'HVGA 480x320',
  'VGA 640x480',
  'SVGA 800x600',
];

const ROTATIONS = [0, 90, 180, 270];

const defaultData = {
  cameraType: 'ESP32CAM OV2640',
  resolution: 'QVGA 320x240',
  mirrorX: false,
  mirrorY: false,
  rotation: 0,
  binning: false,
};

const CameraForm = ({ data, onDataChange }) => {
  const handleChange = (field, value) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <>
      <div className="form-field">
        <span className="form-label">Camera Model</span>
        <div className="static-text">{data.cameraType}</div>
      </div>

      <div className="form-field">
        <label className="form-label">Resolution</label>
        <select
          className="setting-select"
          value={data.resolution}
          onChange={(e) => handleChange('resolution', e.target.value)}
        >
          {RESOLUTIONS.map((res) => (
            <option key={res} value={res}>{res}</option>
          ))}
        </select>
      </div>

      {data.cameraType?.includes('OV3660') && (
        <div className="section-toggle">
          <span className="toggle-label">Pixel binning</span>
          <label className="invert-switch">
            <input
              type="checkbox"
              checked={data.binning}
              onChange={(e) => handleChange('binning', e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      )}

      <div className="section-toggle">
        <span className="toggle-label">Flip Horizontally</span>
        <label className="invert-switch">
          <input
            type="checkbox"
            checked={data.mirrorX}
            onChange={(e) => handleChange('mirrorX', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="section-toggle">
        <span className="toggle-label">Flip Vertically</span>
        <label className="invert-switch">
          <input
            type="checkbox"
            checked={data.mirrorY}
            onChange={(e) => handleChange('mirrorY', e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="form-field">
        <label className="form-label">Image Rotation</label>
        <select
          className="setting-select"
          value={data.rotation}
          onChange={(e) => handleChange('rotation', parseInt(e.target.value, 10))}
        >
          {ROTATIONS.map((rot) => (
            <option key={rot} value={rot}>{rot}&deg;</option>
          ))}
        </select>
      </div>
    </>
  );
};

const CameraTab = ({ configEndpoint }) => {
  return (
    <SettingsPage
      configEndpoint={configEndpoint}
      defaultData={defaultData}
    >
      <CameraForm />
    </SettingsPage>
  );
};

export default CameraTab;