import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Alerts from '../pages/Alerts';
import AlertDetails from '../pages/AlertDetails';
import Baseline from '../pages/Baseline';
import BaselineDetails from '../pages/BaselineDetails';
import Behaviour from '../pages/Behaviour';
import BehaviourDetails from '../pages/BehaviourDetails';
import Correlation from '../pages/Correlation';
import Attention from '../pages/Attention';
import Resilience from '../pages/Resilience';
import Risk from '../pages/Risk';
import Findings from '../pages/Findings';
import SupervisoryAssessment from '../pages/SupervisoryAssessment';
import EvidenceExplorer from '../pages/Evidence';
import LiveMonitoring from '../pages/LiveMonitoring';
import Investigation from '../pages/Investigation';
import SystemHealth from '../pages/SystemHealth';
import Reports from '../pages/Reports';
import UserManagement from '../pages/UserManagement';
import ExecutionGaps from '../pages/ExecutionGaps';

const AppRoutes = ({ apiStatus, setApiStatus, setLastUpdated }) => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={<Dashboard setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />}
      />
      <Route
        path="/alerts"
        element={<Alerts setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />}
      />
      <Route
        path="/alerts/:eventId"
        element={<AlertDetails setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />}
      />
      <Route path="/baseline" element={<Baseline setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/baseline/:entityId" element={<BaselineDetails />} />
      <Route path="/behaviour" element={<Behaviour setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/behaviour/:entityId" element={<BehaviourDetails />} />
      <Route path="/correlation" element={<Correlation />} />
      <Route path="/risk" element={<Risk />} />
      <Route path="/attention" element={<Attention />} />
      <Route path="/resilience" element={<Resilience />} />
      <Route path="/findings" element={<Findings setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/monitor" element={<LiveMonitoring setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/investigation" element={<Investigation setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/investigation/:eventId" element={<Investigation setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/evidence" element={<EvidenceExplorer setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/assessment" element={<SupervisoryAssessment setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/system-health" element={<SystemHealth setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/reports" element={<Reports setApiStatus={setApiStatus} setLastUpdated={setLastUpdated} />} />
      <Route path="/users" element={<UserManagement apiStatus={apiStatus} />} />
      <Route path="/execution-gaps" element={<ExecutionGaps />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
