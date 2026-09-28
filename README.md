SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

<p align="center">
  <strong>SIH26157 · Team CYBER NOVAX</strong>
</p>

<p align="center">
  An offline, air-gapped supervisory analytics platform for assessing periodic cybersecurity submissions from Critical Sector Entities (CSEs).
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Smart%20India%20Hackathon-2026-blue" alt="Smart India Hackathon 2026">
  <img src="https://img.shields.io/badge/Problem%20Statement-SIH26157-purple" alt="SIH26157">
  <img src="https://img.shields.io/badge/Deployment-Air--Gapped-success" alt="Air-Gapped">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

Overview

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

┌──────────────────────────────────────────────────────────────┐
│                 CSE PERIODIC DATA                            │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│          EVIDENCE QUALITY & NORMALIZATION                    │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│          ENTITY BASELINE & BEHAVIOUR PROFILING               │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│             SUPERVISORY SIGNAL EXTRACTION                   │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                CROSS-EVIDENCE CORRELATION                   │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│       EXECUTION GAP & NEGATIVE SPACE ANALYTICS              │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│             SUPERVISORY ATTENTION ASSESSMENT                │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                INTELLIGENT REVIEW SELECTION                 │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│         EXPLAINABLE EVIDENCE & FINDING GENERATION           │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                  HUMAN EXAMINER REVIEW                      │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│        SUPERVISORY FINDING / ASSESSMENT REPORT              │
└──────────────────────────────┬───────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────┐
│                EXAMINER FEEDBACK & CALIBRATION              │
└──────────────────────────────────────────────────────────────┘

Key Capabilities

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

┌─────────────────────────────────────────────────────────────────┐
│                     CSE PERIODIC SUBMISSIONS                    │
│              Alerts • Case Records • Evidence                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EVIDENCE PROCESSING LAYER                      │
│        Quality Assessment • Normalization • Traceability        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ENTITY INTELLIGENCE                         │
│      Baselines • Behaviour Profiling • Deviation Analysis       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              SUPERVISORY ANALYTICS & CORRELATION                │
│ Signals • Cross-Evidence Correlation • Execution Gaps           │
│                    Negative-Space Analytics                      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ATTENTION & REVIEW SELECTION                  │
│       Supervisory Attention Assessment • Intelligent Review     │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     EXPLAINABILITY & AI                         │
│             Evidence Explanation • Finding Generation           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       HUMAN EXAMINER                            │
│              Review • Validate • Challenge • Finalize           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPERVISORY OUTPUT                           │
│       Findings • Assessment Reports • Feedback & Calibration    │
└─────────────────────────────────────────────────────────────────┘

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

CSE Submission
      ↓
Normalization
      ↓
Profiling
      ↓
Signal Extraction
      ↓
Correlation
      ↓
Attention Assessment
      ↓
Review Selection
      ↓
Explainable Evidence
      ↓
Human Examiner Review
      ↓
Assessment Finding

Expected Outputs

Evidence Quality Indicators

Evidence quality and completeness assessment

Entity Profiles

Behavioural and historical entity context

Supervisory Signals

Signals requiring supervisory attention

Cross-Evidence Correlations

Relationships across submitted evidence

Execution-Gap Indicators

Indicators of execution or operational gaps

Negative-Space Indicators

Indicators derived from missing or insufficient evidence

Supervisory Attention Assessment

Identification of areas requiring deeper review

Intelligent Review Selection

Prioritization of entities, evidence and investigations

Explainable Evidence

Evidence-linked analytical explanations

Examiner-Assisted Findings

Finding-generation assistance for examiners

Assessment Reports

Structured supervisory assessment output

Examiner Feedback & Calibration

Feedback loop for improving analytical support

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
