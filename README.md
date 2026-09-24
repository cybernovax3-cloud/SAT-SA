# SAT-SA — Supervisory Analytics Tool for SOC Assessment

SAT-SA is an AI-assisted supervisory analytics platform designed to support the assessment of Security Operations Centers (SOCs).

## Overview

SAT-SA analyzes SOC alerts, investigation records, entity behaviour, evidence quality, operational gaps, and cyber-resilience indicators to support supervisory assessment.

It is designed to assist human examiners and does not replace SOC operations, SIEM platforms, or human supervisory judgement.

## Key Capabilities

- SOC Alert Analysis
- Evidence Normalization
- Entity Baseline & Behaviour Profiling
- Cross-Evidence Correlation
- Risk Analytics
- Supervisory Attention Assessment
- Cyber-Resilience Analytics
- Operational Execution-Gap Analysis
- Explainable Findings
- Investigation & Assessment Workflows
- Supervisory Reporting

## System Workflow

SOC Alerts + Case Records  
↓  
Evidence Normalization  
↓  
Entity Baseline & Behaviour Profiling  
↓  
Cross-Evidence Correlation  
↓  
Risk & Resilience Analytics  
↓  
Supervisory Attention Assessment  
↓  
Intelligent Review Selection  
↓  
Explainable Evidence & Findings  
↓  
Human Examiner Review  
↓  
Supervisory Assessment / Report

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Lucide React
- jsPDF

### Backend

- Python
- FastAPI
- Uvicorn
- REST APIs

### Security Analytics

- Wazuh Indexer
- Alert Normalization
- Behaviour Profiling
- Entity Baselining
- Evidence Correlation
- Risk Analytics
- Cyber-Resilience Analysis
- Supervisory Attention Analytics

### AI

- Local Ollama Integration
- AI-Assisted Intelligence Generation
- Explainable Analysis
- Local Model Support

## Repository Structure

```text
SAT-SA/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── LICENSE
├── README.md
└── .gitignore
