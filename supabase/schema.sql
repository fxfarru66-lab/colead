-- ============================================================================
-- COLEAD PRODUCTION DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- ============================================================================
-- Multi-tenant Organizational Memory & Attribution Engine
-- Generated for CoLead Enterprise Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ORGANIZATIONS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    business_purpose TEXT,
    join_code TEXT UNIQUE,
    creator_id TEXT,
    tagline TEXT,
    industry TEXT,
    description TEXT,
    mission TEXT,
    website TEXT,
    location TEXT,
    team_size TEXT DEFAULT '1-50 Members',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. USERS (Authentication & Role Accounts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Member',
    is_creator BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. SESSIONS (Server-Side Session Store)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. TEAMS (Departments & Product Pods)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subtitle TEXT,
    department TEXT NOT NULL,
    mission TEXT,
    icon_type TEXT DEFAULT 'bronze_sphere',
    member_count INTEGER NOT NULL DEFAULT 0,
    project_count INTEGER NOT NULL DEFAULT 0,
    contribution_count INTEGER NOT NULL DEFAULT 0,
    memory_units INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. PEOPLE (Member Profiles & Expertise)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.people (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    title TEXT,
    team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
    department TEXT,
    years_of_experience INTEGER DEFAULT 3,
    areas_of_expertise TEXT,
    avatar_url TEXT,
    about TEXT,
    bio TEXT,
    skills TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. PROJECTS (Organizational Projects & Initiatives)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    progress INTEGER NOT NULL DEFAULT 60,
    project_lead_id TEXT REFERENCES public.people(id) ON DELETE SET NULL,
    team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. WORK RECORDS (Technical Decisions & Problem Statements)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.work_records (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    technical_decision TEXT NOT NULL,
    outcome TEXT NOT NULL,
    technology TEXT,
    artifact_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. CONTRIBUTIONS (Discrete Attribution & Work Entries)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contributions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    person_id TEXT NOT NULL REFERENCES public.people(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    work_record_id TEXT REFERENCES public.work_records(id) ON DELETE SET NULL,
    team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    contribution_type TEXT NOT NULL,
    problem_solved TEXT NOT NULL,
    technical_decision TEXT NOT NULL,
    outcome TEXT NOT NULL,
    technology TEXT,
    artifact_reference TEXT,
    collaborators TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. RECENT ACTIVITY (Live Feed of Actions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recent_activity (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE DEFAULT 'org_colead',
    team_id TEXT REFERENCES public.teams(id) ON DELETE SET NULL,
    person_id TEXT REFERENCES public.people(id) ON DELETE SET NULL,
    person_name TEXT NOT NULL,
    action TEXT NOT NULL,
    time_ago TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. MEMORY REFERENCES (Hindsight Cloud Retention & Vector Index References)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memory_references (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE DEFAULT 'org_colead',
    contribution_id TEXT REFERENCES public.contributions(id) ON DELETE CASCADE,
    work_record_id TEXT REFERENCES public.work_records(id) ON DELETE CASCADE,
    hindsight_memory_id TEXT,
    hindsight_bank_id TEXT,
    document_type TEXT NOT NULL DEFAULT 'contribution_evidence',
    status TEXT NOT NULL DEFAULT 'retained',
    metadata_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 11. PROJECT BLUEPRINTS (Project Architect AI Generated Blueprints)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_blueprints (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    blueprint_json JSONB NOT NULL,
    created_by TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE & FAST QUERYING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_org ON public.users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_org ON public.sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_teams_org ON public.teams(organization_id);
CREATE INDEX IF NOT EXISTS idx_people_org ON public.people(organization_id);
CREATE INDEX IF NOT EXISTS idx_people_team ON public.people(team_id);
CREATE INDEX IF NOT EXISTS idx_people_user ON public.people(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_team ON public.projects(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_lead ON public.projects(project_lead_id);
CREATE INDEX IF NOT EXISTS idx_work_records_org ON public.work_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_work_records_project ON public.work_records(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_org ON public.contributions(organization_id);
CREATE INDEX IF NOT EXISTS idx_contributions_person ON public.contributions(person_id);
CREATE INDEX IF NOT EXISTS idx_contributions_project ON public.contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_work_rec ON public.contributions(work_record_id);
CREATE INDEX IF NOT EXISTS idx_memory_refs_org ON public.memory_references(organization_id);
CREATE INDEX IF NOT EXISTS idx_memory_refs_contrib ON public.memory_references(contribution_id);
CREATE INDEX IF NOT EXISTS idx_project_blueprints_org ON public.project_blueprints(organization_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant Isolation by Organization ID
-- ============================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recent_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_blueprints ENABLE ROW LEVEL SECURITY;

-- Allow public read of organizations for join-code lookups & anonymous landing
CREATE POLICY "Allow public read organizations" ON public.organizations
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access organizations" ON public.organizations
    FOR ALL USING (auth.role() = 'service_role');

-- Teams: Authenticated users can view teams in their organization
CREATE POLICY "Allow read teams" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access teams" ON public.teams
    FOR ALL USING (auth.role() = 'service_role');

-- People: Read access
CREATE POLICY "Allow read people" ON public.people
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access people" ON public.people
    FOR ALL USING (auth.role() = 'service_role');

-- Projects: Read access
CREATE POLICY "Allow read projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access projects" ON public.projects
    FOR ALL USING (auth.role() = 'service_role');

-- Work Records: Read access
CREATE POLICY "Allow read work_records" ON public.work_records
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access work_records" ON public.work_records
    FOR ALL USING (auth.role() = 'service_role');

-- Contributions: Read access
CREATE POLICY "Allow read contributions" ON public.contributions
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access contributions" ON public.contributions
    FOR ALL USING (auth.role() = 'service_role');

-- Blueprints & Memory References
CREATE POLICY "Allow read memory_references" ON public.memory_references
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access memory_references" ON public.memory_references
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow read project_blueprints" ON public.project_blueprints
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access project_blueprints" ON public.project_blueprints
    FOR ALL USING (auth.role() = 'service_role');
