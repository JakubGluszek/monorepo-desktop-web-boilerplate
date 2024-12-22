import React from 'react';
import ReactDOM from 'react-dom/client';

import '@ltw/ui/globals.css';

import App from '@ltw/app';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App
      config={{
        client: 'app.ltw',
        backendURL: import.meta.env.VITE_BACKEND_URL,
        isDev: import.meta.env.DEV
      }}
    />
  </React.StrictMode>
);
