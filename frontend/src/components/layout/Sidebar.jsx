import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bell,
  Activity,
  Server,
  GitMerge,
  ShieldAlert,
  Eye,
  ShieldCheck,
  FileWarning,
  FileSearch,
  SearchCheck,
  ClipboardCheck,
  HeartPulse,
  FileOutput,
  ChevronLeft,
  ChevronRight,
  ScanSearch
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const MENU_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Alerts', path: '/alerts', icon: Bell },
      { name: 'Behaviour', path: '/behaviour', icon: Activity },
      { name: 'Entity Baseline', path: '/baseline', icon: Server },
      { name: 'Correlation', path: '/correlation', icon: GitMerge }
    ]
  },
  {
    title: 'ANALYTICS',
    items: [
      { name: 'Risk Analytics', path: '/risk', icon: ShieldAlert },
      { name: 'Supervisory Attention', path: '/attention', icon: Eye },
      { name: 'Cyber Resilience', path: '/resilience', icon: ShieldCheck }
    ]
  },
  {
    title: 'INVESTIGATION',
    items: [
      { name: 'Findings', path: '/findings', icon: FileWarning },
      { name: 'Evidence', path: '/evidence', icon: FileSearch },
      { name: 'Investigation', path: '/investigation', icon: SearchCheck },
      { name: 'Execution Gaps', path: '/execution-gaps', icon: ScanSearch },
      { name: 'Reports', path: '/reports', icon: FileOutput }
    ]
  },
  {
    title: 'SUPERVISION',
    items: [
      { name: 'Assessment', path: '/assessment', icon: ClipboardCheck }
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'System Health', path: '/system-health', icon: HeartPulse }
    ]
  }
];

const Sidebar = React.memo(({ collapsed, toggleCollapsed }) => {
  const menuSections = useMemo(() => MENU_SECTIONS, []);

  return (
    <aside style={{
      width: collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
      background: 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.68)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width var(--transition-speed) cubic-bezier(0.4, 0, 0.2, 1)',
      overflowX: 'hidden',
      height: '100%',
      zIndex: 10,
      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.04)',
      borderRadius: '0 16px 16px 0'
    }}>
      {/* Branding Section */}
      <div style={{
        padding: collapsed ? '16px 0' : '20px 24px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: '12px',
        minHeight: '80px',
        transition: 'padding var(--transition-speed) ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px'
        }}>
          <BrandLogo compact={collapsed} showText={!collapsed} textSize={collapsed ? '0.72rem' : '0.95rem'} />
        </div>
      </div>

      {/* Nav List */}
      <div style={{
        flex: 1,
        padding: '16px 0',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {menuSections.map((section) => (
          <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!collapsed && (
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 'bold',
                color: 'var(--text-muted)',
                padding: '0 24px',
                marginBottom: '4px',
                letterSpacing: '0.1em'
              }}>
                {section.title}
              </span>
            )}
            
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path} className={collapsed ? "tooltip-container" : ""}>
                  <NavLink
                    to={item.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: collapsed ? '10px 0' : '10px 20px',
                      color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
                      borderRadius: '8px',
                      margin: '2px 12px',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      transition: 'all 0.15s ease'
                    })}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                  {collapsed && (
                    <span className="tooltip-text">{item.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse button at bottom */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={toggleCollapsed}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            transition: 'background var(--transition-speed)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
});

export default Sidebar;
