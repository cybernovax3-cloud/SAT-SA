# SAT-SA — SOC Supervisory Analytics Tool for SOC Assessment

**SIH26157 | Team CYBER NOVAX**

## 📌 Project Overview

**SAT-SA** is an offline, air-gapped supervisory analytics platform designed to support cybersecurity supervisors and examiners in assessing periodic submissions from **Critical Sector Entities (CSEs)**.

SAT-SA processes submitted **alerts, case records, and supporting evidence** to assist examiners with:

* Evidence normalization
* Evidence analysis
* Alert prioritization
* Explainable supervisory review

The system is designed for **controlled, on-premise, and air-gapped deployment**.

---

## ⚙️ Setup Instructions

### Prerequisites

Install the following before running the project:

* **Python 3.x**
* **Node.js and npm**
* **Git**

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/cybernovax3-cloud/SAT-SA.git
cd SAT-SA
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

#### Create a Python Virtual Environment

```bash
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**Linux / Ubuntu:**

```bash
source .venv/bin/activate
```

#### Install Backend Dependencies

```bash
pip install -r requirements.txt
```

Configure any environment values required by the submitted backend.

#### Start the Backend

Start the **FastAPI** application using the FastAPI entry point configured in the `backend` directory.

---

### 3. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```bash
cd frontend
```

#### Install Frontend Dependencies

```bash
npm install
```

#### Start the Development Server

```bash
npm run dev
```

Open the **local URL displayed by Vite** in your browser.

---

## 🔗 Repository

**GitHub Repository:**
[https://github.com/cybernovax3-cloud/SAT-SA](https://github.com/cybernovax3-cloud/SAT-SA)


---

## 📄 License

This project is licensed under the **MIT License**.

**Copyright © 2026 Team CYBER NOVAX**
