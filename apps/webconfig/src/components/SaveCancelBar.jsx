import React from 'react';

const SaveCancelBar = ({ onSave, onCancel, saving }) => {
  return (
    <div className="save-cancel-bar">
      <button
        className="btn btn-save"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      <button
        className="btn btn-cancel"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
    </div>
  );
};

export default SaveCancelBar;