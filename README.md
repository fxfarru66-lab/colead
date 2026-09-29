# MemoryGrid

> **“Every project teaches the company something. MemoryGrid remembers it.”**

MemoryGrid is an organizational-memory and contribution-visibility platform designed specifically for software engineering companies.

---

## The Core Problem

1. **Organizational Memory**: Companies finish projects, experience is gained, problems are solved, but teams move on and the knowledge becomes invisible or forgotten.
2. **Contribution Visibility**: Junior and quieter engineers often make pivotal technical contributions, yet project ownership and seniority compress history until only the project lead is remembered.

### The Governing Principle

> **“Ownership is not the same as contribution.”**

A project lead is responsible for stewardship and coordination. Actual contributions—the specific problems solved, technical decisions made, and artifacts delivered—are individually preserved with evidence for every contributor, regardless of seniority.

---

## Architectural Loop

```
WORK  ──▶  CONTRIBUTION  ──▶  OUTCOME  ──▶  MEMORY  ──▶  ORGANIZATIONAL LEARNING  ──▶  FUTURE WORK
```

---

## Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Python FastAPI & SQLite
- **Memory Engine**: Hindsight Cloud API (`https://api.hindsight.vectorize.io`)
- **Database**: SQLite (`memorygrid.db`)

### Core Entities

- **Team**: Departments and functional groups.
- **Person**: Engineering and design contributors.
- **Project**: Initiatives with an assigned project lead.
- **Work Record**: High-level problem statements, technical decisions, and milestones.
- **Contribution**: Granular evidence units attributing who solved what, how, and the verifiable outcome.
- **Memory Reference**: Hindsight Cloud ingestion and retrieval references.

---

## Quickstart

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Hindsight Cloud credentials when ready:
```ini
HINDSIGHT_BASE_URL="https://api.hindsight.vectorize.io"
HINDSIGHT_API_KEY="your_api_key"
HINDSIGHT_BANK_ID="your_bank_id"
```

### 2. Run the Full Stack Application
```bash
npm run dev
```
The application will launch at `http://localhost:3000` with the API served under `/api/*`.

### 3. Verification Endpoints
- `GET /api/health` — Service health & Hindsight service status
- `GET /api/stats` — Organizational memory metrics
- `GET /api/contributions` — Evidence-based contribution ledger
- `GET /api/projects` — Projects with lead vs contributors
- `GET /api/teams` — Teams & member counts
- `GET /api/people` — People and contribution history
