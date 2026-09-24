import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AppRoutes from './routes/AppRoutes'
import { isDemoModeEnabled, setDemoModeEnabled } from './api/api'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('LIVE');
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString());
  const [theme, setTheme] = useState(() => localStorage.getItem('sat-sa-theme') || 'light');
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('sat-sa-theme', theme);
  }, [theme]);

  // Ensure DEMO MODE is active for this prototype
  useEffect(() => {
    setDemoModeEnabled(true);
    setApiStatus('LIVE');
  }, []);

  const updateDemoMode = (nextValue) => {
    setDemoMode(true);
    setDemoModeEnabled(true);
    setApiStatus('LIVE');
  };

  useEffect(() => {
    const handleDemoModeChange = () => {
      setDemoMode(true);
      setApiStatus('LIVE');
    };
    window.addEventListener('sat-sa-demo-mode-updated', handleDemoModeChange);
    return () => window.removeEventListener('sat-sa-demo-mode-updated', handleDemoModeChange);
  }, []);

  const handleSetApiStatus = () => {
    setApiStatus('LIVE');
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleDemoMode = () => {
    updateDemoMode(!demoMode);
  };

  return (
    <Router>
      <AppLayout
        apiStatus={demoMode ? 'LIVE' : apiStatus}
        lastUpdated={lastUpdated}
        theme={theme}
        toggleTheme={toggleTheme}
        demoMode={demoMode}
        toggleDemoMode={toggleDemoMode}
      >
        <AppRoutes apiStatus={demoMode ? 'LIVE' : apiStatus} setApiStatus={handleSetApiStatus} setLastUpdated={setLastUpdated} />
      </AppLayout>
    </Router>
  )
}

export default App
