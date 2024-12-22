import React from 'react';
import ReactDOM from 'react-dom/client';

import '@ltw/ui/globals.css';

import App from '@ltw/app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      config={{
        client: 'desktop.ltw',
        backendURL: import.meta.env.VITE_API_BASE_URL,
        webURL: import.meta.env.VITE_WEB_URL,
        isDev: import.meta.env.DEV
      }}
    />
  </React.StrictMode>
);
