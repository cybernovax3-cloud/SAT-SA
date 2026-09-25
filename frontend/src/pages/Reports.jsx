import React, { useEffect, useMemo, useState } from 'react';
import { FileDown, Printer, RefreshCw, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from '../api/api';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import EmptyState from '../components/common/EmptyState';
import LiveIndicator from '../components/common/LiveIndicator';
import SeverityBadge from '../components/common/SeverityBadge';
import { useReports } from '../hooks/useReports';
import { createReportSnapshot, downloadJson } from '../utils/reportGenerator';
import { exportReportPdf } from '../utils/pdfExporter';
import '../styles/report.css';

const value = (item, fallback = 'N/A') => item === undefined || item === null || item === '' ? fallback : item;
const ReportBlock = ({ title, children }) => <section className="report-block"><h2>{title}</h2>{children}</section>;

const Reports = ({ setApiStatus, setLastUpdated }) => {
  const { data, loading, status, error, lastUpdated, autoRefresh, setAutoRefresh, refresh } = useReports();
  const [reportType, setReportType] = useState('Supervisory Assessment');
  const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState('');
  const [generatedAt, setGeneratedAt] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  useEffect(() => { setApiStatus?.(status === 'LIVE' || status === 'DEGRADED' ? 'LIVE' : status); if (lastUpdated) setLastUpdated?.(lastUpdated); }, [status, lastUpdated, setApiStatus, setLastUpdated]);
  const assessment = data?.assessment?.assessment;
  const evidence = data?.assessment?.evidence || data?.alerts || [];
  const filteredAlerts = useMemo(() => (data?.alerts || []).filter((alert) => (!startDate || String(alert.timestamp || '').slice(0, 10) >= startDate) && (!endDate || String(alert.timestamp || '').slice(0, 10) <= endDate)), [data, startDate, endDate]);
  const filteredEvidence = useMemo(() => evidence.filter((item) => (!startDate || String(item.timestamp || '').slice(0, 10) >= startDate) && (!endDate || String(item.timestamp || '').slice(0, 10) <= endDate)), [evidence, startDate, endDate]);
  const snapshot = data && createReportSnapshot({ ...data, alerts: filteredAlerts, assessment: { ...data.assessment, evidence: filteredEvidence } }, { generated_at: generatedAt || new Date().toISOString(), backend: API_BASE_URL || 'Not configured', report_type: reportType, data_last_updated: lastUpdated || null, date_filter: { start: startDate || null, end: endDate || null, applied_frontend: Boolean(startDate || endDate) } });
  const generate = async () => {
    setGenerationError(null);
    try {
      const refreshed = await refresh();
      if (!refreshed) {
        setGenerationError('We could not generate the report because the SAT-SA data source is unavailable.');
        return;
      }
      setGeneratedAt(new Date().toISOString());
    } catch {
      setGenerationError('We could not generate the report using the available data.');
    }
  };
  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data) return <div style={{ textAlign: 'center', padding: '15vh 20px' }}><ShieldAlert size={44} color="var(--danger)" /><h2>REPORT GENERATION FAILED</h2><p style={{ color: 'var(--text-secondary)' }}>Unable to retrieve current SAT-SA data.</p><button onClick={refresh}><RefreshCw size={15} /> Retry</button></div>;
  if (!data || !assessment) return <EmptyState title="INSUFFICIENT DATA" message="There is not enough current SAT-SA data to generate this report." />;

  return <div className="reports-page"><div className="report-controls"><header><div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><h1>SOC REPORTS</h1><LiveIndicator status={status === 'DEGRADED' ? 'OFFLINE' : status} /></div><p>Generate and export SAT-SA security assessments</p></div><div className="report-toolbar"><span>Last updated: {lastUpdated || '--'}</span><label><input type="checkbox" checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} /> Auto Refresh</label></div></header><div className="report-form"><label>REPORT TYPE<select value={reportType} onChange={(event) => setReportType(event.target.value)}><option>Supervisory Assessment</option><option>Security Findings</option><option>Alert Summary</option></select></label><label>START DATE<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>END DATE<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label><button className="report-generate-btn" onClick={generate} disabled={loading}>
  <RefreshCw size={15} /> {loading ? 'Generating...' : 'Generate Report'}
</button></div>{generationError && <div className="report-error" role="alert"><ShieldAlert size={17} /><span>{generationError}</span><button onClick={generate} disabled={loading}>Try Again</button></div>}</div>
    <article className="report-preview" id="report-preview"><div className="report-heading"><div><span>SAT-SA</span><h1>{reportType.toUpperCase()}</h1><p>Supervisory Analytics Tool for SOC Assessment</p></div><div><strong>{status === 'DEGRADED' ? 'DEGRADED' : 'READY'}</strong><div>Generated: {value(generatedAt ? new Date(generatedAt).toLocaleString() : null)}</div></div></div><ReportBlock title="EXECUTIVE SUMMARY"><p>{value(assessment.summary)}</p></ReportBlock><div className="report-grid"><ReportBlock title="RISK OVERVIEW"><div className="report-metric">{value(data.risk?.overall_risk_score ?? assessment.overall_risk)}</div><Detail label="Risk level" value={data.risk?.risk_level} /><Detail label="Overall risk" value={assessment.overall_risk} /></ReportBlock><ReportBlock title="SUPERVISORY ATTENTION"><Detail label="Level" value={data.attention?.attention_level} /><Detail label="Score" value={data.attention?.attention_score} /><Detail label="Priority" value={assessment.priority} />{data.attention?.reasons?.map((reason) => <p key={reason}>{reason}</p>)}</ReportBlock><ReportBlock title="CYBER RESILIENCE"><Detail label="Score" value={data.resilience?.resilience_score ?? assessment.overall_resilience} /><Detail label="Level" value={data.resilience?.resilience_level} /></ReportBlock></div><div className="report-grid"><ReportBlock title="ALERT SUMMARY"><Detail label="Total alerts" value={filteredAlerts.length} /><Detail label="High severity" value={filteredAlerts.filter((alert) => Number(alert.rule?.severity) >= 7).length} /></ReportBlock><ReportBlock title="BEHAVIOUR SUMMARY"><Detail label="Normal activity" value={data.behaviour?.normal_events} /><Detail label="Unusual activity" value={data.behaviour?.unusual_events} /><Detail label="Events analyzed" value={data.behaviour?.total_events_analyzed} /></ReportBlock><ReportBlock title="CORRELATION SUMMARY"><Detail label="Correlated events" value={data.correlation?.total_events} /><Detail label="Clusters" value={data.correlation?.correlated_clusters} /></ReportBlock></div><ReportBlock title="FINDINGS"><div className="report-list">{data.findings.map((finding) => <div key={finding.finding_id}><SeverityBadge severity={finding.severity} /><strong>{value(finding.title || finding.finding_id)}</strong><Detail label="Entity" value={finding.affected_entity} /><Detail label="Reason" value={finding.explanation} /><Detail label="Recommendation" value={finding.recommendation} /></div>)}</div></ReportBlock><ReportBlock title="SUPPORTING EVIDENCE"><div className="report-list">{filteredEvidence.slice(0, 20).map((item, index) => <div key={item.event_id || index}><strong>{value(item.event_id)}</strong><Detail label="Timestamp" value={item.timestamp} /><Detail label="Agent" value={item.agent?.name} /><Detail label="Agent IP" value={item.agent?.ip} /><Detail label="Rule" value={item.rule?.id} /><Detail label="Severity" value={item.rule?.severity} /><Detail label="Description" value={item.rule?.description} /></div>)}</div></ReportBlock><ReportBlock title="FINAL SUPERVISORY ASSESSMENT"><div className="final-assessment">{value(assessment.summary)}</div></ReportBlock></article><div className="report-actions"><button className="report-action-btn" onClick={() => exportReportPdf(snapshot)}><FileDown size={16} /> Export PDF</button><button className="report-action-btn" onClick={() => window.print()}><Printer size={16} /> Print</button><button className="report-action-btn" onClick={() => downloadJson(snapshot)}><FileDown size={16} /> Export JSON</button></div></div>;
};

const Detail = ({ label, value: detailValue }) => <div className="report-detail"><span>{label}</span><strong>{value(detailValue)}</strong></div>;
export default Reports;
