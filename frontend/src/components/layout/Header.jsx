import React from 'react';
import {
  Menu,
  Sun,
  Moon
} from 'lucide-react';

import LiveIndicator from '../common/LiveIndicator';
import BrandLogo from '../common/BrandLogo';

const Header = ({
  toggleSidebar,
  sidebarCollapsed,
  apiStatus = 'LIVE',
  lastUpdated = '--',
  theme = 'light',
  toggleTheme,
  demoMode = true,
  toggleDemoMode
}) => {

  return (
    <header
      style={{
        height: 'var(--header-height)',
        background: 'rgba(255, 255, 255, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.68)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 15,
        position: 'relative',
        boxShadow: 'var(--shadow-soft)'
      }}
    >
      {/* ==================== LEFT SIDE ==================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        {/* Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px'
          }}
        >
          <Menu size={20} />
        </button>

        {/* Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <BrandLogo
            compact={true}
            showText={true}
            textSize="0.92rem"
          />
        </div>
      </div>

      {/* ==================== RIGHT SIDE ==================== */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px'
        }}
      >
        {/* Demo Mode */}
        <div
          title="Prototype is displaying simulated SOC evidence for demonstration."
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.45)',
            color: '#b45309',
            borderRadius: '999px',
            padding: '5px 10px',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              display: 'inline-block',
              boxShadow:
                '0 0 0 2px rgba(245, 158, 11, 0.18)'
            }}
          />

          DEMO MODE
        </div>

        {/* ==================== LIVE STATUS ==================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderRight: '1px solid var(--border-color)',
            paddingRight: '20px'
          }}
        >
          <LiveIndicator status={apiStatus} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <span
              style={{
                color: 'var(--text-secondary)'
              }}
            >
              Backend: Connected
            </span>

            <span
              style={{
                color: 'var(--text-muted)'
              }}
            >
              Last updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* ==================== THEME TOGGLE ==================== */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${
            theme === 'dark' ? 'light' : 'dark'
          } mode`}
          title={`Switch to ${
            theme === 'dark' ? 'light' : 'dark'
          } mode`}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          {theme === 'dark' ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* ==================== USER PROFILE ==================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'left'
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              fontWeight: 'bold',
              fontSize: '0.85rem'
            }}
          >
            SA
          </div>

          {/* User Details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              SOC Analyst
            </span>

            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)'
              }}
            >
              SAT-SA Operator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
