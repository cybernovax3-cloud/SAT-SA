SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

SIH26157 | Team CYBER NOVAX

SAT-SA is an offline, air-gapped supervisory analytics platform designed to support cybersecurity supervisors and examiners in assessing periodic submissions from Critical Sector Entities (CSEs).

📌 Project

SAT-SA processes submitted alerts, case records and supporting evidence to assist examiners with:

Evidence normalization

Analysis

Prioritization

Explainable supervisory review

The system is designed for controlled, on-premise and air-gapped deployment.

SAT-SA assists the examiner; the examiner remains the final decision-maker.

⚙️ Setup Instructions

Prerequisites

Install the following before running the project:

Python 3.x

Node.js and npm

Git

1. Clone the Repository

Open a terminal and run:

git clone https://github.com/cybernovax3-cloud/SAT-SA.git
cd SAT-SA

2. Backend Setup

Open a terminal in the project directory:

cd backend

Create a Python Virtual Environment

python -m venv .venv

Windows

.venv\Scripts\activate

Linux / Ubuntu

source .venv/bin/activate

Install Backend Dependencies

pip install -r requirements.txt

Configure any environment values required by the submitted backend.

Start the Backend

Start the FastAPI application using the FastAPI entry point configured in the backend directory.

3. Frontend Setup

Open a new terminal and navigate to the frontend:

cd frontend

Install Frontend Dependencies

npm install

Start the Development Server

npm run dev

Open the local URL displayed by Vite in your browser.

🔗 Repository

GitHub Repository:
https://github.com/cybernovax3-cloud/SAT-SA

Problem Statement: SIH26157

Team: CYBER NOVAX

📄 License

This project is licensed under the MIT License.

Copyright © 2026 Team CYBER NOVAX
