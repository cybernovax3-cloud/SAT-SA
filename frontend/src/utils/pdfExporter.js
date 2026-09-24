import { jsPDF } from 'jspdf';

export const exportReportPdf = (snapshot) => {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const lines = [];
  const assessment = snapshot.assessment?.assessment;
  const add = (label, value) => { if (value !== undefined && value !== null && value !== '') lines.push(`${label}: ${value}`); };
  lines.push('SAT-SA SECURITY ASSESSMENT', 'Supervisory Analytics Tool for SOC Assessment', '');
  add('Generated At', snapshot.generated_at); add('Backend', snapshot.backend); add('Report Type', snapshot.report_type); add('Data Last Updated', snapshot.data_last_updated); lines.push('');
  lines.push('EXECUTIVE SUMMARY'); add('Summary', assessment?.summary); lines.push('');
  lines.push('RISK AND POSTURE'); add('Overall Risk', assessment?.overall_risk); add('Risk Score', snapshot.risk?.overall_risk_score); add('Risk Level', snapshot.risk?.risk_level); add('Attention', assessment?.overall_attention ?? snapshot.attention?.attention_level); add('Resilience', assessment?.overall_resilience ?? snapshot.resilience?.resilience_score); add('Priority', assessment?.priority); lines.push('');
  lines.push('ALERTS AND FINDINGS'); add('Total Alerts', snapshot.alerts?.length); add('Findings', snapshot.findings?.length); snapshot.findings?.forEach((finding) => add('Finding', `${finding.title || finding.finding_id || ''} (${finding.severity || ''})`)); lines.push('');
  lines.push('SUPPORTING EVIDENCE'); snapshot.assessment?.evidence?.forEach((item) => add('Evidence', `${item.timestamp || ''} ${item.event_id || ''} ${item.agent?.name || ''} ${item.agent?.ip || ''} Rule ${item.rule?.id || ''} ${item.rule?.description || ''}`));
  pdf.setFontSize(11); const wrapped = pdf.splitTextToSize(lines.join('\n'), 500); pdf.text(wrapped, 48, 56); pdf.save(`sat-sa-report-${Date.now()}.pdf`);
};