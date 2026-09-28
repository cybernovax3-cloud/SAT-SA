SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

SIH26157 | Team CYBERNOVA

SAT-SA is an offline, air-gapped supervisory analytics platform that supports cybersecurity supervisors and examiners in assessing periodic submissions from Critical Sector Entities (CSEs). It converts alerts, case records and supporting evidence into normalized, correlated, prioritized and explainable supervisory intelligence, while keeping the human examiner as the final decision-maker.

 Problem & Solution

Manual supervisory assessment can require reviewing large volumes of alerts, investigations, evidence and case records, making it difficult to consistently identify supervisory attention areas, behavioural deviations, execution gaps, missing evidence and cross-evidence patterns. SAT-SA provides a dedicated supervisory analytics layer to structure, correlate and prioritize submitted evidence without replacing the SOC or examiner.

Core Workflow

CSE PERIODIC DATA → EVIDENCE QUALITY & NORMALIZATION → ENTITY BASELINE & BEHAVIOUR PROFILING → SUPERVISORY SIGNAL EXTRACTION → CROSS-EVIDENCE CORRELATION → EXECUTION GAP & NEGATIVE SPACE ANALYTICS → SUPERVISORY ATTENTION ASSESSMENT → INTELLIGENT REVIEW SELECTION → EXPLAINABLE EVIDENCE & FINDING GENERATION → HUMAN EXAMINER REVIEW → SUPERVISORY FINDING / ASSESSMENT REPORT → EXAMINER FEEDBACK & CALIBRATION

 Key Capabilities

Evidence Intelligence: validation, quality assessment, normalization and traceability.

Entity Profiling: behavioural baselines, historical patterns and deviation analysis.

Supervisory Analytics: signal extraction, cross-evidence correlation, execution-gap and negative-space analysis.

Intelligent Review Selection: identifies entities, evidence and investigations requiring deeper supervisory review.

Explainable AI: evidence-linked explanations and finding-generation assistance using locally deployed AI/XAI.

Human-in-the-Loop: examiner reviews, validates, challenges and finalizes findings.

Offline by Design: on-premise, air-gapped deployment without mandatory cloud AI/API dependency.

 System Architecture

CSE PERIODIC SUBMISSIONS
          ↓
Evidence Quality & Normalization
          ↓
Entity Baseline & Behaviour Profiling
          ↓
Supervisory Signal Extraction
          ↓
Cross-Evidence Correlation
          ↓
Execution Gap & Negative Space Analytics
          ↓
Supervisory Attention Assessment
          ↓
Intelligent Review Selection
          ↓
Explainable Evidence & Finding Generation
          ↓
HUMAN EXAMINER REVIEW
          ↓
Supervisory Finding / Assessment Report
          ↓
Examiner Feedback & Calibration

Technology Stack

Layer

Technologies

Frontend

React, TypeScript, Tailwind CSS, ECharts

Backend / API

FastAPI

Processing

Celery, Redis

Analytics

Scikit-learn, PyOD, Behavioural / Anomaly Analytics

AI / XAI

Local Ollama, SHAP

Storage / Search

PostgreSQL, TimescaleDB, OpenSearch

Security

Keycloak RBAC, Nginx, Audit Trail

Deployment

Docker, On-Premise, Air-Gapped

 Evidence Sources

SAT-SA can consume authorized structured evidence originating from platforms such as Wazuh, TheHive, Splunk/Elastic and MISP. These are external evidence sources/integrations, not internal SAT-SA services. SAT-SA provides the supervisory analytics and assessment layer over submitted evidence.

Security, AI & Human Oversight

Designed for controlled supervisory environments with RBAC, evidence traceability, auditability, local processing and air-gapped deployment. AI provides decision-support, not autonomous decisions. The examiner remains responsible for evidence review, validation, challenge/override and final supervisory findings.

Quick Setup

git clone https://github.com/cybernovax3-cloud/SAT-SA.git
cd SAT-SA

Backend

cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux:   source .venv/bin/activate
pip install -r requirements.txt

Configure required environment values and start the API using the FastAPI entry point configured in the submitted repository.

Frontend

cd ../frontend
npm install
npm run dev

Evaluation / Demo Flow

CSE Submission → Normalization → Profiling → Signal Extraction → Correlation → Attention Assessment → Review Selection → Explainable Evidence → Human Examiner Review → Assessment Finding

Scope

SAT-SA is not a SIEM, not a real-time SOC monitoring platform, not a SOC replacement, and not an autonomous supervisory decision-maker. It focuses on supervisory assessment and analytics of periodic CSE submissions.

##  Expected Outputs

Evidence Quality Indicators • Entity Profiles • Supervisory Signals • Cross-Evidence Correlations • Execution-Gap Indicators • Negative-Space Indicators • Supervisory Attention Assessment • Intelligent Review Selection • Explainable Evidence • Examiner-Assisted Findings • Assessment Reports • Examiner Feedback & Calibration

### Team CYBERNOVA
**Smart India Hackathon 2026 | Problem Statement SIH26157**

### 📄 License
This project is licensed under the **MIT License**.
