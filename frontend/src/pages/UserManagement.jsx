import React, { useState } from 'react';
import { Users, UserCheck, Shield, KeyRound, Search, CheckCircle } from 'lucide-react';
import LiveIndicator from '../components/common/LiveIndicator';
import { mockUsers } from '../data/mockData';
import '../styles/users.css';

const UserManagement = ({ apiStatus = 'LIVE' }) => {
  const [search, setSearch] = useState('');
  const users = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">
      <header className="users-header">
        <div>
          <div className="users-title-row">
            <h1>USER &amp; ACCESS MANAGEMENT</h1>
            <LiveIndicator status="LIVE" />
          </div>
          <p>Manage SAT-SA SOC analysts, roles and access permissions.</p>
        </div>
      </header>

      <div className="users-stats" aria-label="User management summary">
        <section className="users-stat"><span>TOTAL USERS</span><strong>{mockUsers.length}</strong></section>
        <section className="users-stat"><span>ACTIVE OPERATORS</span><strong>{mockUsers.length}</strong></section>
        <section className="users-stat"><span>INACTIVE USERS</span><strong>0</strong></section>
        <section className="users-stat"><span>ASSIGNED ROLES</span><strong>4</strong></section>
      </div>

      <section className="users-preview" aria-label="User management availability">
        <div className="users-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2>ACTIVE SOC DIRECTORY</h2>
            <p>Authorized SOC analysts, supervisors, and compliance operators.</p>
          </div>
          <input
            type="text"
            placeholder="Search operators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-dark)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />
        </div>
        <div className="users-table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Access Level</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{user.username}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(59, 130, 246, 0.25)'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--success)',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}>
                      <CheckCircle size={12} />
                      {user.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.lastActivity}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Full Supervisory Access</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="users-permissions">
        <h2>ROLE-BASED ACCESS CONTROL (RBAC)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 12 }}>
          <div style={{ padding: 14, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>Lead SOC Supervisor</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full access to all telemetry, risk analytics, and supervisory attention overrides.</p>
          </div>
          <div style={{ padding: 14, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>SOC Analyst</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Investigation workflow, alert triage, correlation analysis, and event verification.</p>
          </div>
          <div style={{ padding: 14, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>CSIRT Specialist</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Containment execution, gap resolution, remediation tracking, and forensic preservation.</p>
          </div>
          <div style={{ padding: 14, background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: 6 }}>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: 4 }}>Supervisory Compliance Officer</strong>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Audit exports, regulatory compliance oversight, resilience review, and reporting.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserManagement;