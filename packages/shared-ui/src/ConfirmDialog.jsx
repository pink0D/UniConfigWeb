import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="btn btn-save" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;