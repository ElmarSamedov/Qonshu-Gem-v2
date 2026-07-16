try {
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => originalFetch,
      set: () => {
        console.warn('Blocked attempt to overwrite window.fetch');
      }
    });
  }
} catch (e) {
  console.warn('Could not patch window.fetch:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
