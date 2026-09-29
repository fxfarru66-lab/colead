# CoLead Supabase PostgreSQL Database Architecture

This directory contains the production database migrations, schemas, and seeds for CoLead.

## Architecture Overview

CoLead's database is designed for enterprise multi-tenancy, strict organization isolation, high-performance attribution tracking, and seamless integration with **Hindsight Cloud Memory** and the **Project Architect Agent**.

### Core Tables

| Table | Purpose | Multi-Tenant Key | Primary Relationships |
|---|---|---|---|
| `organizations` | Workspace metadata & join codes | `id` | Root entity |
| `users` | User accounts, credentials & roles | `organization_id` | `organizations(id)` |
| `sessions` | Server-side authenticated sessions | `organization_id` | `users(id)`, `organizations(id)` |
| `teams` | Product & engineering departments | `organization_id` | `organizations(id)` |
| `people` | Contributor profiles, skills & expertise | `organization_id` | `teams(id)`, `users(id)` |
| `projects` | Projects, code identifiers & status | `organization_id` | `teams(id)`, `people(id)` |
| `work_records` | Technical decisions & problem statements | `organization_id` | `projects(id)` |
| `contributions` | Discrete attribution & work evidence | `organization_id` | `people(id)`, `projects(id)`, `work_records(id)` |
| `recent_activity` | Real-time audit log of team actions | `organization_id` | `teams(id)`, `people(id)` |
| `memory_references` | Hindsight Cloud bank references & vectors | `organization_id` | `contributions(id)`, `work_records(id)` |
| `project_blueprints` | AI-synthesized architectural plans | `organization_id` | `users(id)` |

## Deployment Instructions

### 1. Apply Schema via Supabase Dashboard / CLI
Run the migration script in your Supabase SQL Editor:
```sql
\i supabase/migrations/20260929000000_initial_schema.sql
```
Or paste the contents of `supabase/schema.sql`.

### 2. Populate Foundational Seed Data
```sql
\i supabase/seed.sql
```

### 3. Environment Variables
Configure your `.env` file with your credentials:
```env
SUPABASE_URL=https://wwcxwzvgvrzmqwyazinn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
*(Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code).*
