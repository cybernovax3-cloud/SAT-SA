import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

const AppLayout = React.memo(({ children, apiStatus = 'LIVE', lastUpdated = '--', theme, toggleTheme, demoMode = true, toggleDemoMode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-page)'
    }}>
      {/* Top Header */}
      <Header
        toggleSidebar={toggleSidebar}
        sidebarCollapsed={sidebarCollapsed}
        apiStatus={apiStatus}
        lastUpdated={lastUpdated}
        theme={theme}
        toggleTheme={toggleTheme}
        demoMode={demoMode}
        toggleDemoMode={toggleDemoMode}
      />

      <div style={{
        display: 'flex',
        flex: 1,
        height: `calc(100vh - var(--header-height) - var(--statusbar-height))`,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Sidebar Navigation */}
        <Sidebar collapsed={sidebarCollapsed} toggleCollapsed={toggleSidebar} />

        {/* Main Content Area */}
        <main style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-page)',
          transition: 'padding-left var(--transition-speed) ease'
        }}>
          {children}
        </main>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />
    </div>
  );
});

export default AppLayout;
