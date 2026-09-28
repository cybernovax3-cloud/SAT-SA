SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

SIH26157 | Team CYBER NOVAX

SAT-SA is an offline, air-gapped supervisory analytics platform designed to support cybersecurity supervisors and examiners in assessing periodic submissions from Critical Sector Entities (CSEs). It transforms alerts, case records and supporting evidence into normalized, correlated, prioritized and explainable supervisory intelligence, while keeping the human examiner as the final decision-maker.

PROBLEM & PROPOSED SOLUTION

Problem

Supervisory assessment can involve large volumes of alerts, investigations, evidence and case records, making it difficult to consistently identify supervisory attention areas, behavioural deviations, execution gaps, missing evidence and cross-evidence patterns.

Solution

SAT-SA provides a dedicated supervisory analytics and decision-support layer that structures, correlates and prioritizes submitted evidence, assists examiners with explainable insights, and preserves human supervisory authority.

CORE SUPERVISORY WORKFLOW

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

KEY CAPABILITIES

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

🏗️ SYSTEM ARCHITECTURE

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

EVIDENCE SOURCES

Authorized structured evidence can originate from platforms such as Wazuh, TheHive, Splunk/Elastic and MISP.

These are external evidence sources/integrations, not internal SAT-SA services. SAT-SA provides the supervisory analytics and assessment layer over submitted evidence.

 SECURITY, AI & HUMAN OVERSIGHT

RBAC • Evidence Traceability • Auditability • Local Processing • On-Premise • Air-Gapped Deployment

AI assists the examiner; the examiner makes the supervisory decision.

SAT-SA uses analytics and local AI/XAI for decision-support, explanations and finding-generation assistance. The examiner remains responsible for evidence review, validation, challenge/override and final supervisory findings.

 QUICK SETUP

Prerequisites

Python 3.x • Node.js/npm 

Clone Repository

git clone https://github.com/cybernovax3-cloud/SAT-SA.git
cd SAT-SA

Backend

cd backend
python -m venv .venv

Windows

.venv\Scripts\activate

Linux / Ubuntu

source .venv/bin/activate

pip install -r requirements.txt

Configure required environment values and start the API using the FastAPI entry point configured in the submitted repository.

Frontend

cd ../frontend
npm install
npm run dev

EVALUATION / DEMO FLOW

CSE Submission → Normalization → Profiling → Signal Extraction → Correlation → Attention Assessment → Review Selection → Explainable Evidence → Human Examiner Review → Assessment Finding

EXPECTED OUTPUTS

Evidence Quality Indicators • Entity Profiles • Supervisory Signals • Cross-Evidence Correlations • Execution-Gap Indicators • Negative-Space Indicators • Supervisory Attention Assessment • Intelligent Review Selection • Explainable Evidence • Examiner-Assisted Findings • Assessment Reports • Examiner Feedback & Calibration

SCOPE & BOUNDARIES

SAT-SA is designed for supervisory assessment of periodic CSE submissions.

NOT a SIEM • NOT real-time SOC monitoring • NOT a SOC replacement • NOT an autonomous supervisory decision-maker • NOT dependent on cloud-hosted AI for its core workflow

TEAM CYBERNOVA

Smart India Hackathon 2026 | Problem Statement SIH26157

📄 LICENSE

This project is licensed under the MIT License.

Copyright © 2026 Team CYBERNOVA
