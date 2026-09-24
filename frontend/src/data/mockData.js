/**
 * SAT-SA Centralized Mock SOC Dataset
 * Provides deterministic, internally consistent supervisory SOC demonstration telemetry.
 * All values, counts, and entity records are synchronized across all application views.
 */

// 1. Entities Catalog
export const mockEntities = [
  {
    entity_id: 'TELECOM-CORE-01',
    name: 'TELECOM-CORE-01',
    sector: 'Telecom',
    monitored_assets: 340,
    alert_volume: 12,
    alert_count: 12,
    critical_alerts: 4,
    investigation_count: 3,
    baseline_deviation: 38,
    evidence_quality: 85,
    cyber_resilience_score: 58,
    cyber_resilience: '58 MEDIUM',
    supervisory_attention_score: 89,
    supervisory_attention: '89 HIGH',
    risk_score: 88,
    risk_level: 'HIGH',
    baseline_status: 'Deviation Detected',
    behaviour_deviation: 'HIGH',
    agent_id: 'TELECOM-CORE-01',
    agent_name: 'TELECOM-CORE-01',
    agent_ip: '10.14.8.31'
  },
  {
    entity_id: 'HEALTHNET-04',
    name: 'HEALTHNET-04',
    sector: 'Healthcare',
    monitored_assets: 260,
    alert_volume: 7,
    alert_count: 7,
    critical_alerts: 2,
    investigation_count: 2,
    baseline_deviation: 31,
    evidence_quality: 78,
    cyber_resilience_score: 62,
    cyber_resilience: '62 MEDIUM',
    supervisory_attention_score: 85,
    supervisory_attention: '85 HIGH',
    risk_score: 84,
    risk_level: 'HIGH',
    baseline_status: 'Deviation Detected',
    behaviour_deviation: 'HIGH',
    agent_id: 'HEALTHNET-04',
    agent_name: 'HEALTHNET-04',
    agent_ip: '10.21.3.16'
  },
  {
    entity_id: 'CORENET-02',
    name: 'CORENET-02',
    sector: 'Core Network',
    monitored_assets: 410,
    alert_volume: 5,
    alert_count: 5,
    critical_alerts: 1,
    investigation_count: 2,
    baseline_deviation: 22,
    evidence_quality: 74,
    cyber_resilience_score: 64,
    cyber_resilience: '64 MEDIUM',
    supervisory_attention_score: 76,
    supervisory_attention: '76 HIGH',
    risk_score: 79,
    risk_level: 'HIGH',
    baseline_status: 'Elevated Risk',
    behaviour_deviation: 'MEDIUM',
    agent_id: 'CORENET-02',
    agent_name: 'CORENET-02',
    agent_ip: '10.12.9.22'
  },
  {
    entity_id: 'GOV-SEC-05',
    name: 'GOV-SEC-05',
    sector: 'Government',
    monitored_assets: 220,
    alert_volume: 2,
    alert_count: 2,
    critical_alerts: 1,
    investigation_count: 1,
    baseline_deviation: 27,
    evidence_quality: 80,
    cyber_resilience_score: 60,
    cyber_resilience: '60 MEDIUM',
    supervisory_attention_score: 82,
    supervisory_attention: '82 HIGH',
    risk_score: 81,
    risk_level: 'HIGH',
    baseline_status: 'Deviation Detected',
    behaviour_deviation: 'HIGH',
    agent_id: 'GOV-SEC-05',
    agent_name: 'GOV-SEC-05',
    agent_ip: '10.30.1.10'
  },
  {
    entity_id: 'FINANCE-07',
    name: 'FINANCE-07',
    sector: 'Financial Services',
    monitored_assets: 290,
    alert_volume: 2,
    alert_count: 2,
    critical_alerts: 0,
    investigation_count: 1,
    baseline_deviation: 8,
    evidence_quality: 88,
    cyber_resilience_score: 75,
    cyber_resilience: '75 HIGH',
    supervisory_attention_score: 45,
    supervisory_attention: '45 LOW',
    risk_score: 42,
    risk_level: 'MEDIUM',
    baseline_status: 'Normal Baseline',
    behaviour_deviation: 'LOW',
    agent_id: 'FINANCE-07',
    agent_name: 'FINANCE-07',
    agent_ip: '10.15.12.11'
  },
  {
    entity_id: 'ENERGY-03',
    name: 'ENERGY-03',
    sector: 'Energy',
    monitored_assets: 180,
    alert_volume: 1,
    alert_count: 1,
    critical_alerts: 0,
    investigation_count: 0,
    baseline_deviation: 5,
    evidence_quality: 91,
    cyber_resilience_score: 79,
    cyber_resilience: '79 HIGH',
    supervisory_attention_score: 40,
    supervisory_attention: '40 LOW',
    risk_score: 38,
    risk_level: 'LOW',
    baseline_status: 'Normal Baseline',
    behaviour_deviation: 'LOW',
    agent_id: 'ENERGY-03',
    agent_name: 'ENERGY-03',
    agent_ip: '10.16.17.5'
  }
];

// 2. Exact 29 Alerts (20 High/Critical Severity >= 7, 9 Medium/Low < 7)
export const mockAlerts = [
  // --- TELECOM-CORE-01 (12 alerts: 9 high/critical, 3 medium/low) ---
  {
    event_id: 'ALT-2026-001',
    timestamp: '2026-09-24T09:10:12Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '172.21.9.18',
    destination_ip: '10.14.8.31',
    rule: { id: '110003', name: 'Multiple failed authentication attempts', severity: 7, description: 'Authentication Anomaly: Multiple failed SSH attempts detected against admin.' },
    severity: 'High',
    category: 'Authentication Anomaly',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 92,
    decoder: 'sshd',
    mitre: 'T1110.001',
    description: 'Repeated failed SSH logins for telecom admin account from external source IP.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.93,
    full_log: 'Sep 24 09:10:12 sshd[7716]: Failed password for telecom_admin from 172.21.9.18 port 22 ssh2',
    location: 'TELECOM-CORE-01 gateway core'
  },
  {
    event_id: 'ALT-2026-002',
    timestamp: '2026-09-24T09:13:05Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '172.21.9.18',
    destination_ip: '10.14.8.31',
    rule: { id: '110003', name: 'Multiple failed authentication attempts', severity: 7, description: 'Authentication failures continued across multiple administrative endpoints.' },
    severity: 'High',
    category: 'Authentication Anomaly',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 90,
    decoder: 'sshd',
    mitre: 'T1110.001',
    description: 'Authentication failures continued targeting telecom privileged user account.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.91,
    full_log: 'Sep 24 09:13:05 sshd[7721]: Invalid user admsvc from 172.21.9.18 port 22 ssh2',
    location: 'TELECOM-CORE-01 gateway core'
  },
  {
    event_id: 'ALT-2026-003',
    timestamp: '2026-09-24T09:17:41Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '172.21.9.18',
    destination_ip: '10.14.8.31',
    rule: { id: '5710', name: 'Successful login after repeated failures', severity: 8, description: 'Successful login from external IP followed repeated authentication failures.' },
    severity: 'High',
    category: 'Authentication Anomaly',
    source: 'Wazuh',
    status: 'Investigating',
    risk_score: 94,
    decoder: 'sshd',
    mitre: 'T1078',
    description: 'Successful administrative login from anomalous external IP following brute-force burst.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.95,
    full_log: 'Sep 24 09:17:41 sshd[7786]: Accepted password for telecom_admin from 172.21.9.18 port 22 ssh2',
    location: 'TELECOM-CORE-01 VPN concentrator'
  },
  {
    event_id: 'ALT-2026-004',
    timestamp: '2026-09-24T09:21:18Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '172.21.9.18',
    destination_ip: '10.14.8.31',
    rule: { id: '150001', name: 'Privilege escalation indicator', severity: 9, description: 'Privilege Escalation: Administrator token assigned to SYSTEM context.' },
    severity: 'Critical',
    category: 'Privilege Escalation',
    source: 'Wazuh',
    status: 'Investigating',
    risk_score: 96,
    decoder: 'windows-eventlog',
    mitre: 'T1548',
    description: 'Privilege escalation observed; administrator token assigned to SYSTEM context.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.96,
    full_log: 'Event 4688: New process token assigned to SYSTEM by telecom_admin session',
    location: 'TELECOM-CORE-01 domain controller'
  },
  {
    event_id: 'ALT-2026-005',
    timestamp: '2026-09-24T09:24:55Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '203.0.113.57',
    rule: { id: '92000', name: 'Suspicious PowerShell execution', severity: 10, description: 'Encoded PowerShell command executed from a user session with admin rights.' },
    severity: 'Critical',
    category: 'Execution',
    source: 'Endpoint',
    status: 'Escalated',
    risk_score: 98,
    decoder: 'powershell',
    mitre: 'T1059.001',
    description: 'Encoded PowerShell script executed from elevated shell session.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.98,
    full_log: 'powershell.exe -NoProfile -NonInteractive -EncodedCommand JABzAG8AbQBl...',
    location: 'TELECOM-CORE-01 endpoint node'
  },
  {
    event_id: 'ALT-2026-006',
    timestamp: '2026-09-24T09:31:02Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '198.51.100.21',
    rule: { id: '1002', name: 'Suspicious outbound connection', severity: 8, description: 'Outbound Transfer: Outbound TLS beaconing connection to unclassified external IP.' },
    severity: 'High',
    category: 'Outbound Transfer',
    source: 'Network',
    status: 'Investigating',
    risk_score: 88,
    decoder: 'firewall',
    mitre: 'T1041',
    description: 'Endpoint established persistent TLS beaconing connection to external server.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.92,
    full_log: 'FIREWALL OUTBOUND TCP 10.14.8.31:49812 -> 198.51.100.21:443 [ESTABLISHED]',
    location: 'TELECOM-CORE-01 edge firewall'
  },
  {
    event_id: 'ALT-2026-007',
    timestamp: '2026-09-24T09:38:20Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '172.21.9.44',
    rule: { id: '5156', name: 'Suspicious remote service execution', severity: 8, description: 'Remote service execution observed on core telecom switch appliance.' },
    severity: 'High',
    category: 'Execution',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 86,
    decoder: 'windows-eventlog',
    mitre: 'T1569.002',
    description: 'Service Control Manager started an unscheduled transient remote service.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'medium',
    confidence: 0.88,
    full_log: 'SCM Event 7045: Service "svc_telmon" installed with imagepath "\\\\10.14.8.31\\c$\\temp\\telmon.exe"',
    location: 'TELECOM-CORE-01 network appliance'
  },
  {
    event_id: 'ALT-2026-008',
    timestamp: '2026-09-24T09:44:11Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '10.14.8.31',
    rule: { id: '1102', name: 'Audit log cleared', severity: 7, description: 'Security audit trail cleared on Windows core controller.' },
    severity: 'High',
    category: 'Defense Evasion',
    source: 'Endpoint',
    status: 'Open',
    risk_score: 84,
    decoder: 'windows-eventlog',
    mitre: 'T1070.001',
    description: 'Security audit log cleared or tampering attempted on telecom domain host.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.90,
    full_log: 'Event 1102: The audit log was cleared by telecom_admin',
    location: 'TELECOM-CORE-01 domain controller'
  },
  {
    event_id: 'ALT-2026-009',
    timestamp: '2026-09-24T09:51:30Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '198.51.100.21',
    rule: { id: '60100', name: 'Exfiltration over web service', severity: 9, description: 'Anomalous large outbound data transfer to cloud endpoint.' },
    severity: 'Critical',
    category: 'Exfiltration',
    source: 'Network',
    status: 'Escalated',
    risk_score: 96,
    decoder: 'firewall',
    mitre: 'T1567',
    description: 'Encrypted 420MB staging archive transmitted via external TLS tunnel.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'high',
    confidence: 0.94,
    full_log: 'FLOW SESSION 10.14.8.31:52110 -> 198.51.100.21:443 BYTES_OUT=440401920',
    location: 'TELECOM-CORE-01 egress router'
  },
  {
    event_id: 'ALT-2026-010',
    timestamp: '2026-09-24T10:02:15Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '10.14.8.31',
    rule: { id: '4010', name: 'Account enumeration command', severity: 5, description: 'Local user account enumeration command executed.' },
    severity: 'Medium',
    category: 'Discovery',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 62,
    decoder: 'windows-eventlog',
    mitre: 'T1087.001',
    description: 'Account discovery tool queried domain administrator group members.',
    case_reference: 'CASE-2026-01',
    evidence_quality: 'medium',
    confidence: 0.80,
    full_log: 'net.exe group "Domain Admins" /domain executed from PID 3180',
    location: 'TELECOM-CORE-01 host'
  },
  {
    event_id: 'ALT-2026-011',
    timestamp: '2026-09-24T10:15:00Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '192.168.10.5',
    destination_ip: '10.14.8.31',
    rule: { id: '3101', name: 'TCP Port probe', severity: 4, description: 'Inbound TCP connection attempt on non-standard port.' },
    severity: 'Medium',
    category: 'Reconnaissance',
    source: 'Network',
    status: 'Closed',
    risk_score: 55,
    decoder: 'firewall',
    mitre: 'T1046',
    description: 'Port scan probe against management port 8443 discarded by firewall.',
    case_reference: null,
    evidence_quality: 'medium',
    confidence: 0.75,
    full_log: 'DROP INBOUND TCP 192.168.10.5:4102 -> 10.14.8.31:8443',
    location: 'TELECOM-CORE-01 edge firewall'
  },
  {
    event_id: 'ALT-2026-012',
    timestamp: '2026-09-24T10:28:44Z',
    agent: { id: 'TELECOM-CORE-01', name: 'TELECOM-CORE-01', ip: '10.14.8.31' },
    source_ip: '10.14.8.31',
    destination_ip: '10.14.8.31',
    rule: { id: '5502', name: 'Configuration audit warning', severity: 5, description: 'Telnet daemon status check triggered compliance policy warning.' },
    severity: 'Medium',
    category: 'Configuration',
    source: 'Endpoint',
    status: 'Open',
    risk_score: 58,
    decoder: 'auditd',
    mitre: 'T1082',
    description: 'Compliance baseline check flagged unencrypted daemon configuration.',
    case_reference: null,
    evidence_quality: 'high',
    confidence: 0.85,
    full_log: 'CIS-BENCHMARK: Telnet service daemon found running on secondary interface',
    location: 'TELECOM-CORE-01 system'
  },

  // --- HEALTHNET-04 (7 alerts: 5 high/critical, 2 medium) ---
  {
    event_id: 'ALT-2026-013',
    timestamp: '2026-09-24T11:07:33Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '10.21.3.44',
    rule: { id: '150002', name: 'Service account privilege escalation', severity: 9, description: 'Privilege Escalation: Healthcare EHR service account privilege escalation.' },
    severity: 'Critical',
    category: 'Privilege Escalation',
    source: 'Wazuh',
    status: 'Under Review',
    risk_score: 96,
    decoder: 'windows-eventlog',
    mitre: 'T1068',
    description: 'EHR database service account assigned local administrative permissions.',
    case_reference: 'CASE-2026-02',
    evidence_quality: 'high',
    confidence: 0.94,
    full_log: 'Event 4672: Special privileges assigned to new logon for svc_ehr_sync',
    location: 'HEALTHNET-04 EHR cluster'
  },
  {
    event_id: 'ALT-2026-014',
    timestamp: '2026-09-24T11:14:02Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '10.21.3.16',
    rule: { id: '40103', name: 'Malware precursor detected', severity: 9, description: 'Trojan precursor binary executed in temp directory of clinic host.' },
    severity: 'Critical',
    category: 'Malware',
    source: 'Endpoint',
    status: 'Escalated',
    risk_score: 97,
    decoder: 'windows-eventlog',
    mitre: 'T1204.002',
    description: 'Antivirus flagged suspicious payload dropper invoice_ehr.scr in user temp folder.',
    case_reference: 'CASE-2026-02',
    evidence_quality: 'high',
    confidence: 0.97,
    full_log: 'DEFENDER: Trojan:Win32/Wacatac.B!ml detected in C:\\Users\\nurse02\\AppData\\Local\\Temp\\invoice_ehr.scr',
    location: 'HEALTHNET-04 workstation'
  },
  {
    event_id: 'ALT-2026-015',
    timestamp: '2026-09-24T11:22:19Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '203.0.113.88',
    rule: { id: '1002', name: 'High volume outbound transfer', severity: 8, description: 'Outbound Transfer: Unusual high-volume encrypted transmission from clinical DB.' },
    severity: 'High',
    category: 'Outbound Transfer',
    source: 'Network',
    status: 'Open',
    risk_score: 89,
    decoder: 'firewall',
    mitre: 'T1048',
    description: 'Sustained 180MB outbound data transmission toward foreign IP.',
    case_reference: 'CASE-2026-02',
    evidence_quality: 'high',
    confidence: 0.91,
    full_log: 'FIREWALL ALERT: Outbound transfer 180MB on TCP 443 to unclassified IP 203.0.113.88',
    location: 'HEALTHNET-04 clinic gateway'
  },
  {
    event_id: 'ALT-2026-016',
    timestamp: '2026-09-24T11:31:40Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '10.21.3.16',
    rule: { id: '5501', name: 'File integrity policy modification', severity: 8, description: 'Critical EHR access control policy modified outside change window.' },
    severity: 'High',
    category: 'Integrity',
    source: 'Wazuh',
    status: 'Investigating',
    risk_score: 87,
    decoder: 'auditd',
    mitre: 'T1565.001',
    description: 'EHR patient access control list replaced with unauthorized permissive copy.',
    case_reference: 'CASE-2026-02',
    evidence_quality: 'high',
    confidence: 0.90,
    full_log: 'auditd: type=PATH msg=audit(1727177500): name="/etc/ehr/policy.conf" permissions modified',
    location: 'HEALTHNET-04 database host'
  },
  {
    event_id: 'ALT-2026-017',
    timestamp: '2026-09-24T11:45:12Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '10.21.3.16',
    rule: { id: '1003', name: 'OS Credential Dumping', severity: 7, description: 'LSASS memory access attempt detected by endpoint security.' },
    severity: 'High',
    category: 'Credential Access',
    source: 'Endpoint',
    status: 'Open',
    risk_score: 85,
    decoder: 'sysmon',
    mitre: 'T1003.001',
    description: 'Process procdump.exe opened handle with PROCESS_VM_READ to lsass.exe.',
    case_reference: 'CASE-2026-02',
    evidence_quality: 'high',
    confidence: 0.93,
    full_log: 'Sysmon Event 10: SourceImage=C:\\Windows\\Temp\\procdump.exe TargetImage=C:\\Windows\\system32\\lsass.exe',
    location: 'HEALTHNET-04 clinic host'
  },
  {
    event_id: 'ALT-2026-018',
    timestamp: '2026-09-24T12:01:05Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '10.21.3.16',
    rule: { id: '1053', name: 'Scheduled Task creation', severity: 5, description: 'Persistence mechanism via new scheduled task named HealthSyncSvc.' },
    severity: 'Medium',
    category: 'Persistence',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 60,
    decoder: 'windows-eventlog',
    mitre: 'T1053.005',
    description: 'New scheduled task created to execute binary at system startup.',
    case_reference: 'CASE-2026-02',
    evidence_quality: 'medium',
    confidence: 0.82,
    full_log: 'Event 4698: A scheduled task was created. TaskName: \\HealthSyncSvc',
    location: 'HEALTHNET-04 clinic host'
  },
  {
    event_id: 'ALT-2026-019',
    timestamp: '2026-09-24T12:15:30Z',
    agent: { id: 'HEALTHNET-04', name: 'HEALTHNET-04', ip: '10.21.3.16' },
    source_ip: '10.21.3.16',
    destination_ip: '10.21.3.255',
    rule: { id: '3102', name: 'Subnet sweep', severity: 4, description: 'Internal ICMP echo sweep across clinic subnet.' },
    severity: 'Medium',
    category: 'Reconnaissance',
    source: 'Network',
    status: 'Closed',
    risk_score: 52,
    decoder: 'firewall',
    mitre: 'T1018',
    description: 'ICMP ping broadcast mapped neighboring clinical monitoring endpoints.',
    case_reference: null,
    evidence_quality: 'medium',
    confidence: 0.78,
    full_log: 'ICMP ECHO REQUEST sweep from 10.21.3.16 across 10.21.3.0/24',
    location: 'HEALTHNET-04 clinic switch'
  },

  // --- CORENET-02 (5 alerts: 4 high/critical, 1 medium) ---
  {
    event_id: 'ALT-2026-020',
    timestamp: '2026-09-24T12:35:10Z',
    agent: { id: 'CORENET-02', name: 'CORENET-02', ip: '10.12.9.22' },
    source_ip: '10.12.9.22',
    destination_ip: '198.51.100.99',
    rule: { id: '1002', name: 'Outbound data transfer', severity: 8, description: 'Outbound Transfer: Large transfer detected from core DB toward external host.' },
    severity: 'High',
    category: 'Outbound Transfer',
    source: 'Network',
    status: 'Open',
    risk_score: 88,
    decoder: 'firewall',
    mitre: 'T1048',
    description: 'Data staging transfer toward unclassified cloud storage destination.',
    case_reference: 'CASE-2026-03',
    evidence_quality: 'high',
    confidence: 0.89,
    full_log: 'TCP ESTABLISHED 10.12.9.22:49190 -> 198.51.100.99:443 BYTES=285000000',
    location: 'CORENET-02 gateway router'
  },
  {
    event_id: 'ALT-2026-021',
    timestamp: '2026-09-24T12:48:40Z',
    agent: { id: 'CORENET-02', name: 'CORENET-02', ip: '10.12.9.22' },
    source_ip: '10.12.9.22',
    destination_ip: '10.12.9.1',
    rule: { id: '31100', name: 'Lateral movement via SSH', severity: 9, description: 'Lateral movement: SSH hop from jump host to internal backbone switch.' },
    severity: 'Critical',
    category: 'Lateral Movement',
    source: 'Network',
    status: 'Escalated',
    risk_score: 94,
    decoder: 'sshd',
    mitre: 'T1021.004',
    description: 'Unauthorized SSH session opened to core distribution switch.',
    case_reference: 'CASE-2026-03',
    evidence_quality: 'high',
    confidence: 0.94,
    full_log: 'sshd: Accepted publickey for core_ops from 10.12.9.22 port 51221 ssh2',
    location: 'CORENET-02 backbone switch'
  },
  {
    event_id: 'ALT-2026-022',
    timestamp: '2026-09-24T13:02:18Z',
    agent: { id: 'CORENET-02', name: 'CORENET-02', ip: '10.12.9.22' },
    source_ip: '10.12.9.22',
    destination_ip: '10.12.9.5',
    rule: { id: '5156', name: 'Remote service created', severity: 8, description: 'Windows service created remotely without valid change ticket.' },
    severity: 'High',
    category: 'Execution',
    source: 'Wazuh',
    status: 'Investigating',
    risk_score: 86,
    decoder: 'windows-eventlog',
    mitre: 'T1569.002',
    description: 'Remote RPC invocation spawned service dispatcher on switch controller host.',
    case_reference: 'CASE-2026-03',
    evidence_quality: 'high',
    confidence: 0.88,
    full_log: 'SCM 7045: Service "net_probe_svc" created with binPath "c:\\windows\\system32\\netprobe.exe"',
    location: 'CORENET-02 core appliance'
  },
  {
    event_id: 'ALT-2026-023',
    timestamp: '2026-09-24T13:19:50Z',
    agent: { id: 'CORENET-02', name: 'CORENET-02', ip: '10.12.9.22' },
    source_ip: '10.12.9.22',
    destination_ip: '10.12.9.22',
    rule: { id: '1040', name: 'Network interface promiscuous mode', severity: 7, description: 'Promiscuous mode enabled on monitoring network interface.' },
    severity: 'High',
    category: 'Credential Access',
    source: 'Endpoint',
    status: 'Open',
    risk_score: 82,
    decoder: 'auditd',
    mitre: 'T1040',
    description: 'Interface eth0 entered promiscuous mode without capture authorization.',
    case_reference: 'CASE-2026-03',
    evidence_quality: 'medium',
    confidence: 0.85,
    full_log: 'kernel: device eth0 entered promiscuous mode by PID 4410 (tcpdump)',
    location: 'CORENET-02 network monitor'
  },
  {
    event_id: 'ALT-2026-024',
    timestamp: '2026-09-24T13:34:12Z',
    agent: { id: 'CORENET-02', name: 'CORENET-02', ip: '10.12.9.22' },
    source_ip: '10.12.9.22',
    destination_ip: '1.1.1.1',
    rule: { id: '1071', name: 'DNS Tunneling queries', severity: 5, description: 'High-entropy subdomain DNS queries directed to external DNS.' },
    severity: 'Medium',
    category: 'Command and Control',
    source: 'Network',
    status: 'Open',
    risk_score: 65,
    decoder: 'bind',
    mitre: 'T1071.004',
    description: 'Repeated long hex-encoded TXT records queried against external resolver.',
    case_reference: 'CASE-2026-03',
    evidence_quality: 'medium',
    confidence: 0.80,
    full_log: 'named[1022]: query: 4a6f73686e61526f7365.c2.net IN TXT + (10.12.9.22)',
    location: 'CORENET-02 DNS forwarder'
  },

  // --- GOV-SEC-05 (2 alerts: 2 high/critical, 0 medium) ---
  {
    event_id: 'ALT-2026-025',
    timestamp: '2026-09-24T13:50:00Z',
    agent: { id: 'GOV-SEC-05', name: 'GOV-SEC-05', ip: '10.30.1.10' },
    source_ip: '198.51.100.12',
    destination_ip: '10.30.1.10',
    rule: { id: '80100', name: 'Web application exploit payload', severity: 10, description: 'Zero-day web application exploit attempt against public gateway portal.' },
    severity: 'Critical',
    category: 'Initial Access',
    source: 'Network',
    status: 'Escalated',
    risk_score: 99,
    decoder: 'modsecurity',
    mitre: 'T1190',
    description: 'Remote code execution attempt blocked by WAF against public portal API.',
    case_reference: 'CASE-2026-04',
    evidence_quality: 'high',
    confidence: 0.99,
    full_log: 'ModSecurity: Access denied with code 403 (phase 2). Matched "Java RCE payload injection"',
    location: 'GOV-SEC-05 web gateway'
  },
  {
    event_id: 'ALT-2026-026',
    timestamp: '2026-09-24T14:02:18Z',
    agent: { id: 'GOV-SEC-05', name: 'GOV-SEC-05', ip: '10.30.1.10' },
    source_ip: '10.30.1.10',
    destination_ip: '10.30.1.10',
    rule: { id: '1553', name: 'Unauthorized certificate install', severity: 8, description: 'Self-signed root certificate installed in local machine trusted store.' },
    severity: 'High',
    category: 'Persistence',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 85,
    decoder: 'windows-eventlog',
    mitre: 'T1553.004',
    description: 'Unsigned CA certificate added to machine root trust store by local admin.',
    case_reference: 'CASE-2026-04',
    evidence_quality: 'high',
    confidence: 0.88,
    full_log: 'Event 854: Root Certificate installed. Subject: CN=Interception-CA, Issuer: CN=Interception-CA',
    location: 'GOV-SEC-05 application server'
  },

  // --- FINANCE-07 (2 alerts: 0 high/critical, 2 medium/low) ---
  {
    event_id: 'ALT-2026-027',
    timestamp: '2026-09-24T14:18:05Z',
    agent: { id: 'FINANCE-07', name: 'FINANCE-07', ip: '10.15.12.11' },
    source_ip: '10.15.12.11',
    destination_ip: '10.15.12.11',
    rule: { id: '4001', name: 'Password expiration notice ignored', severity: 5, description: 'Policy compliance warning: Service account password expiration ignored.' },
    severity: 'Medium',
    category: 'Configuration',
    source: 'Wazuh',
    status: 'Open',
    risk_score: 58,
    decoder: 'windows-eventlog',
    mitre: 'T1078',
    description: 'Automated compliance reminder: 2 financial operator accounts pending password change.',
    case_reference: null,
    evidence_quality: 'high',
    confidence: 0.84,
    full_log: 'SEC-AUDIT: Password age exceeds 90 days policy for user svc_fin_audit',
    location: 'FINANCE-07 banking server'
  },
  {
    event_id: 'ALT-2026-028',
    timestamp: '2026-09-24T14:31:40Z',
    agent: { id: 'FINANCE-07', name: 'FINANCE-07', ip: '10.15.12.11' },
    source_ip: '10.15.12.11',
    destination_ip: '10.15.12.11',
    rule: { id: '1105', name: 'Audit log reached 90% threshold', severity: 3, description: 'Security event log reached capacity threshold and auto-archived.' },
    severity: 'Low',
    category: 'System',
    source: 'Wazuh',
    status: 'Closed',
    risk_score: 38,
    decoder: 'windows-eventlog',
    mitre: 'T1082',
    description: 'Routine audit log rotation completed normally according to schedule.',
    case_reference: null,
    evidence_quality: 'high',
    confidence: 0.95,
    full_log: 'Event 1105: The event log file was successfully archived to C:\\Logs\\Archive_20260924.evtx',
    location: 'FINANCE-07 backup controller'
  },

  // --- ENERGY-03 (1 alert: 0 high/critical, 1 low) ---
  {
    event_id: 'ALT-2026-029',
    timestamp: '2026-09-24T14:45:10Z',
    agent: { id: 'ENERGY-03', name: 'ENERGY-03', ip: '10.16.17.5' },
    source_ip: '10.16.17.5',
    destination_ip: '10.16.17.1',
    rule: { id: '2101', name: 'SCADA Telemetry heartbeat latency', severity: 3, description: 'Substation telemetry polling latency observed during maintenance window.' },
    severity: 'Low',
    category: 'System',
    source: 'Network',
    status: 'Closed',
    risk_score: 34,
    decoder: 'syslog',
    mitre: 'T1082',
    description: 'SCADA RTU heartbeat response delayed by 180ms during regular baseline calibration.',
    case_reference: null,
    evidence_quality: 'high',
    confidence: 0.96,
    full_log: 'DNP3 POLLING: Station 4 heartbeat response delayed: latency=182ms (normal < 50ms)',
    location: 'ENERGY-03 substation control'
  }
];

// 3. Baseline Entities Dataset (keyed for BaselineDetails and Object.values for BaselineTable)
export const mockBaseline = {
  total_events: mockAlerts.length, // 29
  entities: {
    'TELECOM-CORE-01': {
      agent_id: 'TELECOM-CORE-01',
      agent_name: 'TELECOM-CORE-01',
      agent_ip: '10.14.8.31',
      sector: 'Telecom',
      risk_score: 88,
      risk_level: 'HIGH',
      baseline_status: 'Deviation Detected',
      total_events: 12,
      behaviour_deviation: 'HIGH',
      cyber_resilience: '58 MEDIUM',
      supervisory_attention: '89 HIGH',
      severity_distribution: { 'Critical': 3, 'High': 6, 'Medium': 3 },
      rule_distribution: { '110003': 2, '5710': 1, '150001': 1, '92000': 1, '1002': 1, '5156': 1, '1102': 1, '60100': 1, '4010': 1, '3101': 1, '5502': 1 },
      decoder_distribution: { 'sshd': 3, 'windows-eventlog': 4, 'powershell': 1, 'firewall': 3, 'auditd': 1 }
    },
    'HEALTHNET-04': {
      agent_id: 'HEALTHNET-04',
      agent_name: 'HEALTHNET-04',
      agent_ip: '10.21.3.16',
      sector: 'Healthcare',
      risk_score: 84,
      risk_level: 'HIGH',
      baseline_status: 'Deviation Detected',
      total_events: 7,
      behaviour_deviation: 'HIGH',
      cyber_resilience: '62 MEDIUM',
      supervisory_attention: '85 HIGH',
      severity_distribution: { 'Critical': 2, 'High': 3, 'Medium': 2 },
      rule_distribution: { '150002': 1, '40103': 1, '1002': 1, '5501': 1, '1003': 1, '1053': 1, '3102': 1 },
      decoder_distribution: { 'windows-eventlog': 3, 'firewall': 2, 'auditd': 1, 'sysmon': 1 }
    },
    'CORENET-02': {
      agent_id: 'CORENET-02',
      agent_name: 'CORENET-02',
      agent_ip: '10.12.9.22',
      sector: 'Core Network',
      risk_score: 79,
      risk_level: 'HIGH',
      baseline_status: 'Elevated Risk',
      total_events: 5,
      behaviour_deviation: 'MEDIUM',
      cyber_resilience: '64 MEDIUM',
      supervisory_attention: '76 HIGH',
      severity_distribution: { 'Critical': 1, 'High': 3, 'Medium': 1 },
      rule_distribution: { '1002': 1, '31100': 1, '5156': 1, '1040': 1, '1071': 1 },
      decoder_distribution: { 'firewall': 1, 'sshd': 1, 'windows-eventlog': 1, 'auditd': 1, 'bind': 1 }
    },
    'GOV-SEC-05': {
      agent_id: 'GOV-SEC-05',
      agent_name: 'GOV-SEC-05',
      agent_ip: '10.30.1.10',
      sector: 'Government',
      risk_score: 81,
      risk_level: 'HIGH',
      baseline_status: 'Deviation Detected',
      total_events: 2,
      behaviour_deviation: 'HIGH',
      cyber_resilience: '60 MEDIUM',
      supervisory_attention: '82 HIGH',
      severity_distribution: { 'Critical': 1, 'High': 1 },
      rule_distribution: { '80100': 1, '1553': 1 },
      decoder_distribution: { 'modsecurity': 1, 'windows-eventlog': 1 }
    },
    'FINANCE-07': {
      agent_id: 'FINANCE-07',
      agent_name: 'FINANCE-07',
      agent_ip: '10.15.12.11',
      sector: 'Financial Services',
      risk_score: 42,
      risk_level: 'MEDIUM',
      baseline_status: 'Normal Baseline',
      total_events: 2,
      behaviour_deviation: 'LOW',
      cyber_resilience: '75 HIGH',
      supervisory_attention: '45 LOW',
      severity_distribution: { 'Medium': 1, 'Low': 1 },
      rule_distribution: { '4001': 1, '1105': 1 },
      decoder_distribution: { 'windows-eventlog': 2 }
    },
    'ENERGY-03': {
      agent_id: 'ENERGY-03',
      agent_name: 'ENERGY-03',
      agent_ip: '10.16.17.5',
      sector: 'Energy',
      risk_score: 38,
      risk_level: 'LOW',
      baseline_status: 'Normal Baseline',
      total_events: 1,
      behaviour_deviation: 'LOW',
      cyber_resilience: '79 HIGH',
      supervisory_attention: '40 LOW',
      severity_distribution: { 'Low': 1 },
      rule_distribution: { '2101': 1 },
      decoder_distribution: { 'syslog': 1 }
    }
  }
};

// 4. Behaviour Profiles (4 Unusual Events, 2 Normal Profiles)
export const mockBehaviour = {
  unusual_events: 4,
  normal_events: 25,
  total_events_analyzed: 29,
  profiles: [
    {
      agent_id: 'TELECOM-CORE-01',
      agent_name: 'TELECOM-CORE-01',
      agent_ip: '10.14.8.31',
      event_id: 'ALT-2026-001',
      timestamp: '2026-09-24T09:10:12Z',
      behaviour: 'unusual',
      status: 'unusual',
      reasons: [
        'Authentication Anomaly: HIGH — 3 failed password attempts followed by sudden external login',
        'Privilege Behaviour: HIGH — Token elevation to NT AUTHORITY\\SYSTEM context',
        'Outbound Transfer: MEDIUM — Outbound TLS connection to external staging server',
        'Anomalous Activity: HIGH — Encoded PowerShell download and execution'
      ],
      normal: 3,
      unusual: 9,
      total: 12,
      severityDeviation: true,
      ruleDeviation: true,
      decoderDeviation: true
    },
    {
      agent_id: 'HEALTHNET-04',
      agent_name: 'HEALTHNET-04',
      agent_ip: '10.21.3.16',
      event_id: 'ALT-2026-013',
      timestamp: '2026-09-24T11:07:33Z',
      behaviour: 'unusual',
      status: 'unusual',
      reasons: [
        'Privilege Behaviour: HIGH — EHR service account privilege escalation',
        'Outbound Transfer: MEDIUM — Abnormal data transmission from clinic endpoint',
        'Process Anomalies: HIGH — Ransomware precursor execution observed'
      ],
      normal: 2,
      unusual: 5,
      total: 7,
      severityDeviation: true,
      ruleDeviation: true,
      decoderDeviation: false
    },
    {
      agent_id: 'CORENET-02',
      agent_name: 'CORENET-02',
      agent_ip: '10.12.9.22',
      event_id: 'ALT-2026-020',
      timestamp: '2026-09-24T12:35:10Z',
      behaviour: 'unusual',
      status: 'unusual',
      reasons: [
        'Lateral Movement: MEDIUM — SSH hop from perimeter jump host to core backbone switch',
        'Failed Authentication Bursts: HIGH — Rapid authentication attempts on administrative switch interface'
      ],
      normal: 1,
      unusual: 4,
      total: 5,
      severityDeviation: true,
      ruleDeviation: false,
      decoderDeviation: true
    },
    {
      agent_id: 'GOV-SEC-05',
      agent_name: 'GOV-SEC-05',
      agent_ip: '10.30.1.10',
      event_id: 'ALT-2026-025',
      timestamp: '2026-09-24T13:50:00Z',
      behaviour: 'unusual',
      status: 'unusual',
      reasons: [
        'Anomalous Activity: HIGH — Zero-day web application exploit payload detected',
        'High-severity activity observed on public gateway'
      ],
      normal: 0,
      unusual: 2,
      total: 2,
      severityDeviation: true,
      ruleDeviation: true,
      decoderDeviation: false
    },
    {
      agent_id: 'FINANCE-07',
      agent_name: 'FINANCE-07',
      agent_ip: '10.15.12.11',
      event_id: 'ALT-2026-027',
      timestamp: '2026-09-24T14:18:05Z',
      behaviour: 'normal',
      status: 'normal',
      reasons: [
        'Compliant access patterns within approved operating windows',
        'Standard telemetry profile'
      ],
      normal: 2,
      unusual: 0,
      total: 2,
      severityDeviation: false,
      ruleDeviation: false,
      decoderDeviation: false
    },
    {
      agent_id: 'ENERGY-03',
      agent_name: 'ENERGY-03',
      agent_ip: '10.16.17.5',
      event_id: 'ALT-2026-029',
      timestamp: '2026-09-24T14:45:10Z',
      behaviour: 'normal',
      status: 'normal',
      reasons: [
        'SCADA telemetry aligned with operational baseline parameters'
      ],
      normal: 1,
      unusual: 0,
      total: 1,
      severityDeviation: false,
      ruleDeviation: false,
      decoderDeviation: false
    }
  ]
};

// 5. Correlation Clusters (Sum of events = 9 + 6 + 5 = 20 Correlated Events)
export const mockCorrelations = {
  total_events: 20,
  correlated_clusters: 3,
  clusters: [
    {
      cluster_id: 'CORR-2026-001',
      entity: {
        agent_id: 'TELECOM-CORE-01',
        agent_name: 'TELECOM-CORE-01',
        agent_ip: '10.14.8.31'
      },
      event_count: 9,
      high_severity_count: 9,
      maximum_severity: 10,
      confidence: 0.94,
      risk: 92,
      status: 'Investigating',
      correlation_reason: 'Authentication Anomaly → Privilege Escalation → Unusual Process → Outbound Transfer → Potential Account Compromise',
      event_ids: [
        'ALT-2026-001', 'ALT-2026-002', 'ALT-2026-003', 'ALT-2026-004', 'ALT-2026-005',
        'ALT-2026-006', 'ALT-2026-007', 'ALT-2026-008', 'ALT-2026-009'
      ],
      rule_ids: ['110003', '5710', '150001', '92000', '1002', '5156', '1102', '60100'],
      decoders: ['sshd', 'windows-eventlog', 'powershell', 'firewall']
    },
    {
      cluster_id: 'CORR-2026-002',
      entity: {
        agent_id: 'HEALTHNET-04',
        agent_name: 'HEALTHNET-04',
        agent_ip: '10.21.3.16'
      },
      event_count: 6,
      high_severity_count: 5,
      maximum_severity: 9,
      confidence: 0.91,
      risk: 86,
      status: 'Escalated',
      correlation_reason: 'Malware Precursor → Configuration File Tampering → Abnormal Data Transfer',
      event_ids: [
        'ALT-2026-013', 'ALT-2026-014', 'ALT-2026-015', 'ALT-2026-016', 'ALT-2026-017', 'ALT-2026-018'
      ],
      rule_ids: ['150002', '40103', '1002', '5501', '1003', '1053'],
      decoders: ['windows-eventlog', 'firewall', 'auditd', 'sysmon']
    },
    {
      cluster_id: 'CORR-2026-003',
      entity: {
        agent_id: 'CORENET-02',
        agent_name: 'CORENET-02',
        agent_ip: '10.12.9.22'
      },
      event_count: 5,
      high_severity_count: 4,
      maximum_severity: 9,
      confidence: 0.88,
      risk: 82,
      status: 'Open',
      correlation_reason: 'Lateral Movement → Remote Service Execution → Core Switch Probing',
      event_ids: [
        'ALT-2026-020', 'ALT-2026-021', 'ALT-2026-022', 'ALT-2026-023', 'ALT-2026-024'
      ],
      rule_ids: ['1002', '31100', '5156', '1040', '1071'],
      decoders: ['firewall', 'sshd', 'windows-eventlog', 'auditd', 'bind']
    }
  ]
};

// 6. Risk Analytics (Overall Risk: 82 — HIGH)
export const mockRiskAnalytics = {
  overall_risk_score: 82,
  risk_level: 'HIGH',
  overall_risk: '82 — HIGH',
  entity_risk: 85,
  alert_risk: 88,
  behaviour_risk: 84,
  operational_weakness: 72,
  cyber_resilience: 61,
  trend: 'INCREASING',
  contributing_factors: [
    {
      factor: 'Authentication Anomaly Burst',
      value: 9,
      explanation: 'Repeated failed login bursts followed by successful external credential takeover on TELECOM-CORE-01.',
      evidence_references: ['ALT-2026-001', 'ALT-2026-002', 'ALT-2026-003']
    },
    {
      factor: 'Privilege Escalation & Execution',
      value: 9,
      explanation: 'Unauthorized token assignment to SYSTEM context and encoded PowerShell process creation.',
      evidence_references: ['ALT-2026-004', 'ALT-2026-005']
    },
    {
      factor: 'Outbound Transfer & C2 Communication',
      value: 8,
      explanation: 'Sustained anomalous TLS beaconing and staged egress transmission to unclassified external endpoints.',
      evidence_references: ['ALT-2026-006', 'ALT-2026-009', 'ALT-2026-015']
    },
    {
      factor: 'Healthcare Policy Integrity Violation',
      value: 7,
      explanation: 'Tampering with EHR access control policies following ransomware precursor execution on HEALTHNET-04.',
      evidence_references: ['ALT-2026-014', 'ALT-2026-016']
    },
    {
      factor: 'Lateral Movement across Core Segments',
      value: 7,
      explanation: 'Cross-segment SSH hop and remote service installation across internal core routing hosts on CORENET-02.',
      evidence_references: ['ALT-2026-021', 'ALT-2026-022']
    },
    {
      factor: 'Supervisory Investigation Gaps',
      value: 8,
      explanation: '7 identified containment evidence gaps and missing reviewer approval chains for high-priority incidents.',
      evidence_references: ['CASE-2026-01', 'CASE-2026-02']
    }
  ]
};

// 7. Supervisory Attention (Supervisory Attention: 89 — HIGH)
export const mockSupervisoryAttention = {
  attention_score: 89,
  attention_level: 'HIGH',
  priority: 'HIGH',
  entities_requiring_attention: 5,
  critical_findings: 3,
  evidence_gaps: 7,
  pending_investigations: 6,
  reasons: [
    'High alert volume (12 alerts) combined with repeated authentication anomalies has elevated supervisory attention for TELECOM-CORE-01.',
    'Privilege escalation and anomalous egress beaconing show incomplete containment evidence and missing administrative sign-off.',
    'Healthcare entity HEALTHNET-04 exhibits integrity tampering and ransomware precursor alerts without corresponding case resolution.',
    'Lateral movement across core networking appliances on CORENET-02 requires immediate operational review and segment isolation verification.',
    '7 evidence gaps identified in incident case records prevent formal closure of ongoing supervisory investigations.'
  ],
  evidence_gaps: [
    'Case CASE-2026-01 records do not fully capture host isolation and credential reset verification for TELECOM-CORE-01.',
    'Administrative approval chains are missing for the network privilege escalation incident.',
    'Forensic disk snapshot and memory dump artifacts are not attached to HEALTHNET-04 investigation file.',
    'Containment evidence for core switch remote service installation on CORENET-02 is incomplete.',
    'Firewall rule update confirmation for blocking C2 destination 198.51.100.21 has not been verified by a second reviewer.',
    'Incident responder handoff logs are missing for off-hours triage period.',
    'Supervisory sign-off on remediation plan is pending compliance officer review.'
  ],
  entities: [
    {
      entity: 'TELECOM-CORE-01',
      attention_score: 92,
      reason: 'Account compromise chain & egress beaconing',
      evidence_quality: 'High',
      priority: 'CRITICAL',
      recommended_review: 'Immediate credential reset & containment verification'
    },
    {
      entity: 'HEALTHNET-04',
      attention_score: 88,
      reason: 'Policy modification & malware precursor',
      evidence_quality: 'High',
      priority: 'HIGH',
      recommended_review: 'Host isolation & integrity policy audit'
    },
    {
      entity: 'CORENET-02',
      attention_score: 82,
      reason: 'Core network lateral movement & remote service',
      evidence_quality: 'Medium',
      priority: 'HIGH',
      recommended_review: 'Switch log review & ACL verification'
    },
    {
      entity: 'GOV-SEC-05',
      attention_score: 79,
      reason: 'Public portal exploit attempt & unauthorized certificate',
      evidence_quality: 'High',
      priority: 'HIGH',
      recommended_review: 'WAF rule audit & certificate store cleanup'
    },
    {
      entity: 'ENERGY-03',
      attention_score: 64,
      reason: 'Telemetry latency deviation during maintenance',
      evidence_quality: 'High',
      priority: 'MEDIUM',
      recommended_review: 'Scheduled baseline re-evaluation'
    }
  ],
  confidence: 0.91
};

// 8. Cyber Resilience (Cyber Resilience: 61 — MEDIUM)
export const mockCyberResilience = {
  resilience_score: 61,
  resilience_level: 'MODERATE',
  overall_resilience: '61 — MEDIUM',
  detection_capability: 72,
  response_capability: 64,
  recovery_capability: 55,
  evidence_quality: 61,
  operational_resilience: 63,
  reasons: [
    'Detection controls performed at expected levels (Score: 72), identifying initial access attempts within 4 minutes.',
    'Incident response capability scored 64/100, constrained by delayed containment execution on core network assets.',
    'Recovery capability scored 55/100 due to undocumented fallback verification and missing baseline restoration evidence.',
    'Evidence quality remains mixed (61/100) between high-fidelity endpoint telemetry and lower-confidence network perimeter signals.',
    'Operational resilience (63/100) reflects ongoing vulnerability to multi-stage credential abuse across sector boundaries.'
  ],
  entities: [
    { entity: 'TELECOM-CORE-01', score: 58, level: 'MEDIUM', detection: 70, response: 58, recovery: 50 },
    { entity: 'HEALTHNET-04', score: 62, level: 'MEDIUM', detection: 74, response: 62, recovery: 54 },
    { entity: 'CORENET-02', score: 64, level: 'MEDIUM', detection: 71, response: 66, recovery: 58 },
    { entity: 'FINANCE-07', score: 75, level: 'HIGH', detection: 82, response: 76, recovery: 70 },
    { entity: 'ENERGY-03', score: 79, level: 'HIGH', detection: 85, response: 80, recovery: 74 },
    { entity: 'GOV-SEC-05', score: 60, level: 'MEDIUM', detection: 68, response: 60, recovery: 52 }
  ]
};

// 9. Explainable Findings
export const mockFindings = {
  total_findings: 4,
  findings: [
    {
      finding_id: 'FND-2026-001',
      title: 'Multi-Stage Credential Abuse & Privilege Escalation Sequence',
      affected_entity: 'TELECOM-CORE-01',
      severity: 'Critical',
      finding_type: 'Account Compromise',
      evidence_status: 'Verified',
      reviewer_status: 'Action Required',
      risk_score: 94,
      explanation: 'Repeated failed logins followed by successful authentication from an external IP, subsequent administrator token acquisition, and execution of encoded PowerShell.',
      recommendation: 'Revoke compromised admin session tokens, enforce MFA on management interfaces, and isolate endpoint 10.14.8.31.',
      evidence_references: ['ALT-2026-001', 'ALT-2026-002', 'ALT-2026-003', 'ALT-2026-004', 'ALT-2026-005'],
      contributing_factors: ['Failed authentication storm', 'Privilege token elevation', 'PowerShell payload execution']
    },
    {
      finding_id: 'FND-2026-002',
      title: 'Healthcare Policy File Tampering & Data Staging',
      affected_entity: 'HEALTHNET-04',
      severity: 'Critical',
      finding_type: 'Data Integrity & Exfiltration',
      evidence_status: 'Corroborated',
      reviewer_status: 'Escalated',
      risk_score: 89,
      explanation: 'Ransomware precursor execution followed by unauthorized modification of EHR access policies and unusual outbound file transfers.',
      recommendation: 'Restore policy files from authoritative backup, restrict outbound egress on TCP 443 to approved destinations, and initiate forensic disk snapshot.',
      evidence_references: ['ALT-2026-013', 'ALT-2026-014', 'ALT-2026-015', 'ALT-2026-016'],
      contributing_factors: ['Dropper execution in temp directory', 'EHR policy file substitution', 'Large external egress flow']
    },
    {
      finding_id: 'FND-2026-003',
      title: 'Lateral Movement & Remote Service Creation on Core Switch',
      affected_entity: 'CORENET-02',
      severity: 'High',
      finding_type: 'Lateral Movement',
      evidence_status: 'Under Investigation',
      reviewer_status: 'Pending Review',
      risk_score: 82,
      explanation: 'Remote service execution observed on production network appliance without matching change management approval ticket.',
      recommendation: 'Audit active network appliance services, terminate unapproved service process, and verify segment boundary ACLs.',
      evidence_references: ['ALT-2026-020', 'ALT-2026-021', 'ALT-2026-022'],
      contributing_factors: ['SSH cross-segment hopping', 'Unauthorized SCM service creation', 'Promiscuous interface state']
    },
    {
      finding_id: 'FND-2026-004',
      title: 'Supervisory Documentation & Containment Evidence Deficit',
      affected_entity: 'TELECOM-CORE-01',
      severity: 'High',
      finding_type: 'Governance & Supervision',
      evidence_status: 'Gap Identified',
      reviewer_status: 'Open',
      risk_score: 78,
      explanation: '7 containment verification artifacts missing from case documentation, preventing formal incident sign-off.',
      recommendation: 'Require incident responders to attach host isolation logs and firewall drop verification before case closure.',
      evidence_references: ['CASE-2026-01', 'CASE-2026-02'],
      contributing_factors: ['Missing host isolation confirmation', 'Unsigned firewall block record', 'Unverified credential rotation']
    }
  ]
};

// 10. Overall Supervisory Assessment
export const mockAssessment = {
  assessment: {
    overall_risk: 82,
    overall_attention: 89,
    overall_resilience: 61,
    priority: 'HIGH',
    summary: 'Multiple telecom, healthcare, and core network entities show combined authentication, privilege, and outbound transfer anomalies. The most significant indicators depict a likely account compromise sequence with incomplete supervisory evidence for closure.'
  },
  evidence: mockAlerts,
  findings: mockFindings.findings
};

// 11. Execution Gaps Data
export const mockExecutionGaps = {
  statistics: {
    total_gaps: 7,
    critical_gaps: 3,
    unassigned_gaps: 1,
    resolved_gaps: 4,
    avg_resolution_time_hrs: 6.2
  },
  incidents: [
    {
      incident_id: 'INC-2026-001',
      entity: 'TELECOM-CORE-01',
      title: 'Telecom Core Privilege Escalation & Beaconing',
      severity: 'Critical',
      stage: 'Containment Pending',
      gap_type: 'Missing Containment Evidence',
      assigned: 'SOC Analyst',
      status: 'Active Gap',
      summary: 'Host isolation logs and credential reset confirmation missing from telecom incident record.',
      actions: [
        { action: 'CONTAINMENT_REQUESTED', timestamp: '2026-09-24T09:40:00Z', analyst: 'SOC Analyst', notes: 'Requested immediate host isolation from network ops.' },
        { action: 'CREDENTIAL_RESET_PENDING', timestamp: '2026-09-24T10:05:00Z', analyst: 'SOC Analyst', notes: 'Domain admin credentials marked for forced rotation.' }
      ]
    },
    {
      incident_id: 'INC-2026-002',
      entity: 'HEALTHNET-04',
      title: 'EHR Policy File Tampering',
      severity: 'High',
      stage: 'Eradication Incomplete',
      gap_type: 'Backup Restoration Unverified',
      assigned: 'Lead Responder',
      status: 'Active Gap',
      summary: 'Healthcare policy backup restoration has not been cryptographically verified against golden image.',
      actions: [
        { action: 'EVIDENCE_PRESERVED', timestamp: '2026-09-24T11:40:00Z', analyst: 'Lead Responder', notes: 'Disk image saved for forensic examination.' }
      ]
    },
    {
      incident_id: 'INC-2026-003',
      entity: 'CORENET-02',
      title: 'Core Switch Remote Service Installation',
      severity: 'High',
      stage: 'Identification Incomplete',
      gap_type: 'Scope Undetermined',
      assigned: 'Network Engineer',
      status: 'Under Review',
      summary: 'Lateral extent of remote service installation across secondary core switches remains unconfirmed.',
      actions: [
        { action: 'TRIAGE_OPENED', timestamp: '2026-09-24T13:10:00Z', analyst: 'Network Engineer', notes: 'Switch syslog analysis initiated.' }
      ]
    }
  ]
};

// 12. Negative Space Indicators
export const mockNegativeSpace = {
  status: 'critical',
  negative_space_score: 74,
  indicator_count: 3,
  message: 'Simulated SOC evidence identifies elevated negative-space indicators across telecom and healthcare telemetry.',
  indicators: [
    {
      title: 'Authentication volume spike',
      severity: 'critical',
      description: 'Authentication volume exceeds historical baseline for telecom access, while egress activity remains elevated.',
      evidence: 'TELECOM-CORE-01 / ALT-2026-001 / ALT-2026-003'
    },
    {
      title: 'Investigation documentation gap',
      severity: 'high',
      description: 'Final containment sequence is missing supervisory validation and case closure evidence.',
      evidence: 'CASE-2026-01 / TELECOM-CORE-01 / ALT-2026-006'
    },
    {
      title: 'Health system integrity deviation',
      severity: 'medium',
      description: 'Malware precursor behavior and configuration tampering suggest a narrow but significant telemetry blind spot.',
      evidence: 'HEALTHNET-04 / ALT-2026-014 / ALT-2026-016'
    }
  ]
};

// 13. Mock Users Directory
export const mockUsers = [
  { id: 'usr-001', name: 'Sarah Jenkins', username: 'sjenkins', role: 'Lead SOC Supervisor', status: 'ACTIVE', lastActivity: 'Just now' },
  { id: 'usr-002', name: 'Alex Rivera', username: 'arivera', role: 'SOC Analyst', status: 'ACTIVE', lastActivity: '2 mins ago' },
  { id: 'usr-003', name: 'Marcus Vance', username: 'mvance', role: 'Supervisory Compliance Officer', status: 'ACTIVE', lastActivity: '15 mins ago' },
  { id: 'usr-004', name: 'Elena Rostova', username: 'erostova', role: 'CSIRT Specialist', status: 'ACTIVE', lastActivity: '1 hour ago' },
  { id: 'usr-005', name: 'David Kim', username: 'dkim', role: 'Infrastructure Monitoring', status: 'ACTIVE', lastActivity: '3 hours ago' }
];

// Unified Central Dataset
export const demoDataset = {
  alerts: mockAlerts,
  baseline: mockBaseline,
  behaviour: mockBehaviour,
  correlation: mockCorrelations,
  attention: mockSupervisoryAttention,
  resilience: mockCyberResilience,
  risk: mockRiskAnalytics,
  findings: mockFindings,
  assessment: mockAssessment,
  entities: mockEntities,
  execution_gaps: mockExecutionGaps,
  negative_space: mockNegativeSpace,
  users: mockUsers
};

export const getDemoMockData = () => demoDataset;

export const getDemoDashboardSnapshot = () => ({
  alerts: mockAlerts,
  assessment: mockAssessment,
  attention: mockSupervisoryAttention,
  resilience: mockCyberResilience,
  risk: mockRiskAnalytics,
  findings: mockFindings,
  baseline: mockBaseline,
  behaviour: mockBehaviour,
  correlation: mockCorrelations
});

/**
 * Maps any API path to its corresponding slice of the centralized mock dataset.
 * Handles pagination limits safely and deterministically without random values.
 */
export const getMockResponseForPath = (path, limit = 100, postData = null) => {
  const safeLimit = Number(limit) || 100;
  const cleanPath = String(path || '').split('?')[0].replace(/\/$/, '');

  // Handle parameterized execution-gap routes
  if (cleanPath.startsWith('/api/execution-gaps/')) {
    const parts = cleanPath.split('/');
    const incidentId = parts[3];
    const subAction = parts[4];

    if (subAction === 'ai-assessment') {
      return {
        data: {
          assessment: `Simulated SOC Evidence (DEMO MODE): Gap analysis for ${incidentId} identifies that containment verification artifacts remain outstanding. Responders should verify host isolation logs and second-analyst sign-off before closing.`,
          recommendations: [
            'Enforce dual-custody verification for containment closure.',
            'Confirm DNS sinkholing of external C2 destinations.',
            'Attach cryptographically signed backup verification logs.'
          ]
        }
      };
    }

    if (subAction === 'actions') {
      return {
        data: {
          status: 'success',
          message: 'Simulated action recorded successfully in demo mode.',
          action: postData?.action || 'STATUS_UPDATE',
          timestamp: new Date().toISOString()
        }
      };
    }

    const matchedIncident = mockExecutionGaps.incidents.find(i => i.incident_id === incidentId) || mockExecutionGaps.incidents[0];
    return { data: matchedIncident };
  }

  switch (cleanPath) {
    case '/api/alerts': {
      const limited = mockAlerts.slice(0, safeLimit);
      return { data: { total: limited.length, alerts: limited } };
    }
    case '/api/baseline':
      return { data: { total_events: mockAlerts.length, entities: mockBaseline.entities } };
    case '/api/behaviour':
      return {
        data: {
          profiles: mockBehaviour.profiles,
          unusual_events: mockBehaviour.unusual_events,
          normal_events: mockBehaviour.normal_events,
          total_events_analyzed: mockBehaviour.total_events_analyzed
        }
      };
    case '/api/correlation':
      return {
        data: {
          clusters: mockCorrelations.clusters,
          correlated_clusters: mockCorrelations.correlated_clusters,
          total_events: mockCorrelations.total_events
        }
      };
    case '/api/analytics/attention':
      return { data: mockSupervisoryAttention };
    case '/api/analytics/resilience':
      return { data: mockCyberResilience };
    case '/api/analytics/risk':
      return { data: mockRiskAnalytics };
    case '/api/findings':
      return {
        data: {
          total_findings: mockFindings.total_findings,
          findings: mockFindings.findings
        }
      };
    case '/api/supervisory/assessment':
      return { data: mockAssessment };
    case '/api/supervisory/ai-assessment':
      return {
        data: {
          assessment: mockAssessment.assessment,
          evidence: mockAlerts.slice(0, 10),
          findings: mockFindings.findings
        }
      };
    case '/api/ai/chat':
      return {
        data: {
          answer: `SIMULATED SOC EVIDENCE — DEMO MODE: Analysis confirms 29 total alerts across 6 entities, with TELECOM-CORE-01 exhibiting an active multi-stage credential abuse and privilege escalation sequence. 7 evidence gaps currently prevent supervisory closure.`,
          response: `SIMULATED SOC EVIDENCE — DEMO MODE: Analysis confirms 29 total alerts across 6 entities, with TELECOM-CORE-01 exhibiting an active multi-stage credential abuse and privilege escalation sequence. 7 evidence gaps currently prevent supervisory closure.`,
          source: {
            events_analyzed: 29,
            findings: 4,
            attention_score: 89,
            resilience_score: 61,
            risk_score: 82
          }
        }
      };
    case '/api/ai/alert-explanation': {
      const alertId = postData?.alert_id || postData || 'ALT-2026-001';
      const targetAlert = mockAlerts.find(a => a.event_id === alertId) || mockAlerts[0];
      return {
        data: {
          summary: `SIMULATED SOC EVIDENCE — DEMO MODE: Alert ${targetAlert.event_id} indicates ${targetAlert.description}. This event correlates with an ongoing privilege elevation and egress beaconing cluster.`,
          source: {
            rule_id: targetAlert.rule?.id || '110003',
            severity: targetAlert.rule?.severity || 7,
            decoder: targetAlert.decoder || 'sshd',
            agent: targetAlert.agent?.name || 'TELECOM-CORE-01'
          },
          details: `The telemetry was received from ${targetAlert.location || 'core gateway'} at ${targetAlert.timestamp}. Evidence quality is assessed as ${targetAlert.evidence_quality || 'high'}.`,
          investigation_hints: [
            'Correlate with previous failed authentication attempts from external source IP 172.21.9.18.',
            'Inspect process execution logs around token assignment timestamp.',
            'Verify whether external TLS connection destination 198.51.100.21 is an approved partner IP.'
          ],
          recommendation: 'Isolate host from production VLAN and execute credential rotation for affected administrative accounts.'
        }
      };
    }
    case '/api/analytics/negative-space':
      return { data: mockNegativeSpace };
    case '/api/execution-gaps':
      return { data: mockExecutionGaps };
    case '/api/execution-gaps/statistics':
      return { data: mockExecutionGaps.statistics };
    default:
      return { data: { total: 0, items: [] } };
  }
};

export const demoModeDefault = true;
export default demoDataset;
