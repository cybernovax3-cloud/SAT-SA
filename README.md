SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

SIH26157 | Team CYBER NOVAX

SAT-SA is an offline, air-gapped supervisory analytics platform designed to support cybersecurity supervisors and examiners in assessing periodic submissions from Critical Sector Entities (CSEs).

Project

SAT-SA processes submitted alerts, case records and supporting evidence to assist examiners with evidence normalization, analysis, prioritization and explainable supervisory review.

The system is designed for controlled, on-premise and air-gapped deployment.

SAT-SA assists the examiner; the examiner remains the final decision-maker.

Setup Instructions

Prerequisites

Install the following before running the project:

Python 3.x

Node.js and npm

Git

Docker Desktop / Docker Engine and Docker Compose (for containerized setup)

1. Clone the Repository

git clone https://github.com/cybernovax3-cloud/SAT-SA.git
cd SAT-SA

2. Backend Setup

Open a terminal in the project directory:

cd backend

Create a Python virtual environment:

python -m venv .venv

Windows

.venv\Scripts\activate

Linux / Ubuntu

source .venv/bin/activate

Install the backend dependencies:

pip install -r requirements.txt

Configure any environment values required by the submitted backend.

Start the FastAPI application using the FastAPI entry point configured in the backend directory.

3. Frontend Setup

Open a new terminal:

cd frontend

Install the frontend dependencies:

npm install

Start the development server:

npm run dev

Open the local URL displayed by Vite in your browser.

Project Structure

SAT-SA/
├── backend/              
├── frontend/
├── .github/
│   └── workflows/        
├── LICENSE
├── README.md
└── gen_ns_card.py

Repository

GitHub:
https://github.com/cybernovax3-cloud/SAT-SA

Problem Statement: SIH26157

Team: CYBER NOVAX

License

This project is licensed under the MIT License.

Copyright © 2026 Team CYBER NOVAX
