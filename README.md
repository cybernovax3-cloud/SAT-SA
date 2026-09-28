SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

SIH26157 | Team CYBER NOVAX

SAT-SA is an offline, air-gapped supervisory analytics platform designed to support cybersecurity supervisors and examiners in assessing periodic submissions from Critical Sector Entities (CSEs). It transforms alerts, case records and supporting evidence into normalized, correlated, prioritized and explainable supervisory intelligence, while keeping the human examiner as the final decision-maker.

Problem & Proposed Solution

Problem

Supervisory assessment can involve large volumes of alerts, investigations, evidence and case records, making it difficult to consistently identify:

Supervisory attention areas

Behavioural deviations and recurring patterns

Execution gaps

Missing or insufficient evidence

Cross-evidence patterns requiring deeper review

Solution

SAT-SA provides a dedicated supervisory analytics and decision-support layer that structures, correlates and prioritizes submitted evidence, assists examiners with explainable insights, and preserves human supervisory authority.

Core Supervisory Workflow

CSE PERIODIC DATA
        ↓
EVIDENCE QUALITY & NORMALIZATION
        ↓
ENTITY BASELINE & BEHAVIOUR PROFILING
        ↓
SUPERVISORY SIGNAL EXTRACTION
        ↓
CROSS-EVIDENCE CORRELATION
        ↓
EXECUTION GAP & NEGATIVE SPACE ANALYTICS
        ↓
SUPERVISORY ATTENTION ASSESSMENT
        ↓
INTELLIGENT REVIEW SELECTION
        ↓
EXPLAINABLE EVIDENCE & FINDING GENERATION
        ↓
HUMAN EXAMINER REVIEW
        ↓
SUPERVISORY FINDING / ASSESSMENT REPORT
        ↓
EXAMINER FEEDBACK & CALIBRATION

 Key Capabilities

Capability

Purpose

Evidence Intelligence

Validation, quality assessment, normalization & traceability

Entity Profiling

Behavioural baselines, historical patterns & deviation analysis

Supervisory Analytics

Signal extraction, cross-evidence correlation, execution-gap & negative-space analysis

Intelligent Review Selection

Prioritizes entities, evidence & investigations requiring deeper review

Explainable AI

Evidence-linked explanations & finding-generation assistance using local AI/XAI

Human-in-the-Loop

Examiner reviews, validates, challenges & finalizes findings

Offline by Design

On-premise, air-gapped deployment without mandatory cloud AI/API dependency

 System Architecture

┌──────────────────────────────────────────────────────────────┐
│ CSE PERIODIC SUBMISSIONS                                     │
│ Alerts • Case Records • Supporting Evidence                  │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ EVIDENCE PROCESSING                                           │
│ Quality Assessment • Normalization • Traceability             │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ ENTITY INTELLIGENCE                                           │
│ Baselines • Behaviour Profiling • Deviation Analysis          │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ SUPERVISORY ANALYTICS & CORRELATION                           │
│ Signals • Cross-Evidence Correlation • Execution Gaps         │
│ Negative-Space Analytics                                      │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ ATTENTION & REVIEW SELECTION                                  │
│ Supervisory Attention Assessment • Intelligent Review         │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ EXPLAINABILITY & AI                                           │
│ Evidence Explanation • Finding Generation                     │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ HUMAN EXAMINER                                                │
│ Review • Validate • Challenge • Finalize                       │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│ SUPERVISORY OUTPUT                                            │
│ Findings • Assessment Reports • Feedback & Calibration        │
└──────────────────────────────────────────────────────────────┘

 Evidence Sources

Authorized structured evidence can originate from platforms such as:

Wazuh · TheHive · Splunk / Elastic · MISP

These are external evidence sources/integrations, not internal SAT-SA services. SAT-SA provides the supervisory analytics and assessment layer over submitted evidence.

Security, AI & Human Oversight

RBAC · Evidence Traceability · Auditability · Local Processing · On-Premise · Air-Gapped Deployment

AI assists the examiner; the examiner makes the supervisory decision.

SAT-SA uses analytics and local AI/XAI for decision-support, explanations and finding-generation assistance. The examiner remains responsible for evidence review, validation, challenge/override and final supervisory findings.

 Quick Setup

Prerequisites

Python 3.x

Node.js / npm

1. Clone Repository

git clone https://github.com/cybernovax3-cloud/SAT-SA.git
cd SAT-SA

2. Backend

cd backend
python -m venv .venv

Windows

.venv\Scripts\activate

Linux / Ubuntu

source .venv/bin/activate

pip install -r requirements.txt

Configure the required environment values and start the API using the FastAPI entry point configured in the submitted repository.

3. Frontend

cd ../frontend
npm install
npm run dev

Evaluation / Demo Flow

CSE Submission → Normalization → Profiling → Signal Extraction → Correlation → Attention Assessment → Review Selection → Explainable Evidence → Human Examiner Review → Assessment Finding

Expected Outputs

Evidence Quality Indicators · Entity Profiles · Supervisory Signals · Cross-Evidence Correlations · Execution-Gap Indicators · Negative-Space Indicators · Supervisory Attention Assessment · Intelligent Review Selection · Explainable Evidence · Examiner-Assisted Findings · Assessment Reports · Examiner Feedback & Calibration

Scope & Boundaries

SAT-SA is designed specifically for supervisory assessment of periodic CSE submissions. It provides analytics and decision-support to help examiners identify evidence patterns, supervisory signals and areas requiring deeper review.

What SAT-SA Provides

Supervisory Analytics — analyzes submitted evidence to identify relevant supervisory signals.

Decision Support — assists examiners in prioritizing entities, evidence and investigations for review.

Evidence Correlation — connects information across alerts, case records and supporting evidence.

Explainable Intelligence — provides evidence-linked analytical explanations to support examiner review.

Human-in-the-Loop Assessment — keeps the examiner responsible for validation, challenge, interpretation and final supervisory findings.

Offline & Air-Gapped Operation — supports controlled on-premise deployment without mandatory cloud dependency for the core workflow.

What SAT-SA Is Not

Not a SIEM — it does not replace security event management or SOC monitoring platforms.

Not Real-Time SOC Monitoring — it analyzes periodic CSE submissions rather than continuously monitoring live SOC activity.

Not a SOC Replacement — it supports supervisory assessment and does not replace SOC operations.

Not an Autonomous Decision-Maker — analytical outputs are reviewed and validated by authorized human examiners.

Not Dependent on Cloud AI — the core supervisory workflow is designed for local, air-gapped deployment.

SAT-SA assists the examiner; the examiner remains the final decision-maker.

Team CYBER NOVAX

Smart India Hackathon 2026 · Problem Statement SIH26157

License

This project is licensed under the MIT License.

Copyright © 2026 Team CYBER NOVAX
