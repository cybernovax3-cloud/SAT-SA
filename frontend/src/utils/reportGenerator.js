export const createReportSnapshot = (data, metadata) => ({
  ...metadata,
  assessment: data.assessment,
  risk: data.risk,
  attention: data.attention,
  resilience: data.resilience,
  alerts: data.alerts,
  behaviour: data.behaviour,
  correlation: data.correlation,
  findings: data.findings,
});

export const downloadJson = (snapshot) => {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = `sat-sa-report-${Date.now()}.json`;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};