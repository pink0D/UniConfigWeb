import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
// Shared application entry — all components/layout live in the webconfig app.
// The '@shared' alias points to apps/webconfig/src (see vite.config.js).
import App from '@shared/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
