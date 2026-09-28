SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

SIH26157 | Team CYBERNOVA

SAT-SA is an offline, air-gapped supervisory analytics platform that helps cybersecurity examiners assess periodic submissions from Critical Sector Entities (CSEs). It transforms alerts, case records and supporting evidence into correlated, prioritized and explainable review intelligence, while keeping the human examiner as the final decision-maker.

Core Workflow

CSE Periodic Data → Evidence Quality & Normalization → Entity Baseline & Behaviour Profiling → Supervisory Signal Extraction → Cross-Evidence Correlation → Execution Gap & Negative Space Analytics → Supervisory Attention Assessment → Intelligent Review Selection → Explainable Evidence & Finding Generation → Human Examiner Review → Supervisory Finding / Assessment Report → Examiner Feedback & Calibration

Key Capabilities

Evidence Intelligence: validation, normalization and evidence traceability.

Entity Profiling: behavioural baselines and deviation analysis.

Supervisory Analytics: cross-evidence correlation and execution-gap / negative-space analysis.

Intelligent Prioritization: identifies entities and evidence requiring supervisory attention.

Explainable AI: evidence-linked explanations and finding-generation assistance using local AI/XAI.

Human-in-the-Loop: examiner validates, challenges and finalizes findings.

Offline by Design: on-premise, air-gapped deployment without cloud AI/API dependency.

Technology Stack

Frontend: React + TypeScript, Tailwind CSS, ECharts
Backend: FastAPI, Celery, Redis
Analytics: Scikit-learn, PyOD, behavioural/anomaly analytics
AI/XAI: Local Ollama, SHAP
Storage/Search: PostgreSQL, TimescaleDB, OpenSearch
Security: Keycloak RBAC, Nginx, Audit Trail
Deployment: Docker, On-Premise, Air-Gapped

Quick Setup

1. Clone

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SAT-SA

2. Backend

cd backend
python -m venv .venv

Windows

.venv\Scripts\activate

Linux

source .venv/bin/activate

pip install -r requirements.txt

Configure the environment values required by the submitted backend, then start the API using the actual FastAPI entry point in the repository.

3. Frontend

cd ../frontend
npm install
npm run dev

Open the local URL displayed by Vite.

4. Docker

docker compose build
docker compose up -d
docker compose ps

Stop services:

docker compose down

Evaluation / Demo Flow

Submission → Normalization → Profiling → Correlation → Attention Assessment → Review Selection → Explainable Evidence → Examiner Review → Assessment Finding

Security & Scope

SAT-SA is designed for authorized supervisory use with RBAC, evidence traceability and auditability. It is not a SIEM, not a real-time SOC monitoring platform, not a SOC replacement, and does not make the final supervisory decision.
