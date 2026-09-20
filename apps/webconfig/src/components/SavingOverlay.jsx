import React, { useEffect } from 'react';

const SavingOverlay = ({ status, errorMessage, onDismiss }) => {
  // Auto-dismiss "done" after 1.5 seconds
  useEffect(() => {
    if (status !== 'done') return;
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 1500);
    return () => clearTimeout(timer);
  }, [status, onDismiss]);

  if (status === 'idle') return null;

  const contentClass =
    'saving-overlay-content' +
    (status === 'done' ? ' saving-card' : '') +
    (status === 'error' ? ' saving-card' : '');

  return (
    <div className="saving-overlay">
      <div className={contentClass}>
        {status === 'saving' && <div className="spinner" />}
        {status === 'done' && (
          <span className="saving-icon done-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        )}
        {status === 'error' && (
          <span className="saving-icon error-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        )}
        <span className="saving-label">
          {status === 'saving' ? 'Saving' : status === 'done' ? 'Done' : 'Error'}
        </span>
        {status === 'error' && errorMessage && (
          <p className="saving-error-message">{errorMessage}</p>
        )}
        {status === 'error' && (
          <button className="saving-dismiss-btn" onClick={onDismiss}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default SavingOverlay;
