import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SettingsLayout = ({ tabs, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = location.pathname.split('/').pop();

  return (
    <div className="settings-layout">
      <div className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${currentTab === tab.key ? 'active' : ''}`}
            onClick={() => navigate(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;