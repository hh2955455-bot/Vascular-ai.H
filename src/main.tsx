import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerWorkboxServiceWorker } from './services/serviceWorker';

// Register Workbox service worker for offline clinical cases and study materials caching
registerWorkboxServiceWorker().catch((err) => {
  console.warn('Service worker registration deferred:', err);
});

createRoot(document.getElementById('root')!).render(<App />);
