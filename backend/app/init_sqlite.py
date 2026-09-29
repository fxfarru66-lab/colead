"""
SQLite Database Initializer and Seeder for MemoryGrid.
Provides foundational data matching the MemoryGrid reference design:
- Product Team (Product & Innovation)
- Engineering (Technology & Platform)
- Design (UI/UX & Experience)
- Marketing (Growth & Brand)
And people:
- Sarah Kim (Product Manager)
- Alex Chen (Frontend Developer)
- Priya Sharma (UX Designer)
- Daniel Ortiz (Backend Developer)
- Maria Garcia (Full Stack Developer)
Plus discrete contribution records preserving actual attribution history.
"""

import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "memorygrid.db"))

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db(force_reseed=False):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("PRAGMA foreign_keys = ON;")

    if force_reseed:
        tables = ["sessions", "users", "memory_references", "recent_activity", "contributions", "work_records", "projects", "people", "teams", "organizations"]
        for t in tables:
            cursor.execute(f"DROP TABLE IF EXISTS {t};")
        conn.commit()

    # 0. Organizations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS organizations (
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
        team_size TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # 0B. Users (Authentication Accounts)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Member',
        is_creator INTEGER DEFAULT 0,
        avatar_url TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );
    """)

    # 0C. Sessions (Server-Side Session Store)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        organization_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );
    """)

    # 1. Teams
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teams (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        name TEXT NOT NULL,
        subtitle TEXT,
        department TEXT NOT NULL,
        mission TEXT,
        icon_type TEXT DEFAULT 'bronze_sphere',
        member_count INTEGER DEFAULT 0,
        project_count INTEGER DEFAULT 0,
        contribution_count INTEGER DEFAULT 0,
        memory_units INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    );
    """)

    # 2. People
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS people (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        user_id TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        title TEXT,
        team_id TEXT,
        department TEXT,
        years_of_experience INTEGER DEFAULT 3,
        areas_of_expertise TEXT,
        avatar_url TEXT,
        about TEXT,
        bio TEXT,
        skills TEXT,
        status TEXT DEFAULT 'Active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
    );
    """)

    # 3. Projects
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        progress INTEGER DEFAULT 60,
        project_lead_id TEXT,
        team_id TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (project_lead_id) REFERENCES people(id) ON DELETE SET NULL,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
    );
    """)

    # 4. Work Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS work_records (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        project_id TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        problem_statement TEXT NOT NULL,
        technical_decision TEXT NOT NULL,
        outcome TEXT NOT NULL,
        technology TEXT,
        artifact_url TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    """)

    # 5. Contributions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contributions (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        person_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        work_record_id TEXT,
        team_id TEXT,
        title TEXT NOT NULL,
        contribution_type TEXT NOT NULL,
        problem_solved TEXT NOT NULL,
        technical_decision TEXT NOT NULL,
        outcome TEXT NOT NULL,
        technology TEXT,
        artifact_reference TEXT,
        collaborators TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (work_record_id) REFERENCES work_records(id) ON DELETE SET NULL,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL
    );
    """)

    # 6. Recent Activity
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recent_activity (
        id TEXT PRIMARY KEY,
        team_id TEXT,
        person_id TEXT,
        person_name TEXT NOT NULL,
        action TEXT NOT NULL,
        time_ago TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # 7. Memory References (Hindsight Cloud Ready)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memory_references (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        contribution_id TEXT,
        work_record_id TEXT,
        hindsight_memory_id TEXT,
        hindsight_bank_id TEXT,
        document_type TEXT NOT NULL DEFAULT 'contribution_evidence',
        status TEXT NOT NULL DEFAULT 'retained',
        metadata_json TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (contribution_id) REFERENCES contributions(id) ON DELETE CASCADE,
        FOREIGN KEY (work_record_id) REFERENCES work_records(id) ON DELETE CASCADE
    );
    """)

    # 8. Project Blueprints (Project Architect Agent Persistence)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS project_blueprints (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL DEFAULT 'org_colead',
        project_name TEXT NOT NULL,
        blueprint_json TEXT NOT NULL,
        created_by TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );
    """)

    conn.commit()

    # Seed data if force_reseed or teams count < 4
    cursor.execute("SELECT COUNT(*) FROM teams;")
    team_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM people WHERE id='person_priya';")
    has_priya = cursor.fetchone()[0] > 0

    if force_reseed or team_count < 4 or not has_priya:
        seed_data(cursor)
        conn.commit()

    conn.close()
    print("Database initialized successfully at:", DB_PATH)

def seed_data(cursor):
    now = datetime.utcnow()
    t_now = now.isoformat()
    t_minus_90 = (now - timedelta(days=90)).isoformat()
    t_minus_60 = (now - timedelta(days=60)).isoformat()
    t_minus_45 = (now - timedelta(days=45)).isoformat()
    t_minus_30 = (now - timedelta(days=30)).isoformat()
    t_minus_15 = (now - timedelta(days=15)).isoformat()
    t_minus_5 = (now - timedelta(days=5)).isoformat()
    t_minus_2 = (now - timedelta(days=2)).isoformat()
    t_minus_1 = (now - timedelta(days=1)).isoformat()

    # 0. Seed Organization
    cursor.execute("""
        INSERT OR REPLACE INTO organizations (id, name, business_purpose, join_code, creator_id, tagline, industry, description, mission, website, location, team_size, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "org_colead",
        "CO-LEAD",
        "Technology & Product Engineering",
        "COLEAD-9X2P4",
        "usr_sarah",
        "Organizational Memory, Built for the People Who Create It.",
        "Enterprise Software & Distributed Systems",
        "Co-Lead builds resilient digital products and preserves organizational memory across projects, technical decisions, and individual contributions.",
        "Capture, connect and preserve your organization's knowledge. Turn everyday work into lasting memory.",
        "https://co-lead.internal",
        "San Francisco, CA",
        "50-200 Members",
        t_minus_90,
        t_now
    ))

    # 0B. Seed Users
    # Password hash demo placeholder (sha256 of 'renew' is standard)
    import hashlib
    default_pw_hash = hashlib.sha256("renew".encode()).hexdigest()
    users = [
        ("usr_sarah", "org_colead", "Sarah Kim", "sarah.kim@company.com", default_pw_hash, "Lead Product Manager", 1, "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_alex", "org_colead", "Alex Chen", "alex.chen@company.com", default_pw_hash, "Senior Frontend Engineer", 0, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_priya", "org_colead", "Priya Sharma", "priya.sharma@company.com", default_pw_hash, "Senior UX Designer", 0, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_daniel", "org_colead", "Daniel Ortiz", "daniel.ortiz@company.com", default_pw_hash, "Senior Backend Engineer", 0, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_maria", "org_colead", "Maria Garcia", "maria.garcia@company.com", default_pw_hash, "Full Stack Engineer", 0, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_elena", "org_colead", "Elena Vance", "elena.vance@company.com", default_pw_hash, "Staff Architect", 0, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_marcus", "org_colead", "Marcus Chen", "marcus.chen@company.com", default_pw_hash, "Junior Engineer", 0, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80", t_minus_90),
        ("usr_aisha", "org_colead", "Aisha Patel", "aisha.patel@company.com", default_pw_hash, "Security & Auth Engineer", 0, "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=240&auto=format&fit=crop&q=80", t_minus_90),
    ]
    for u in users:
        cursor.execute("INSERT OR REPLACE INTO users (id, organization_id, name, email, password_hash, role, is_creator, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", u)

    # 1. Seed Teams matching the reference image
    teams = [
        ("team_product", "org_colead", "Product Team", "Product & Innovation", "Product", "Define customer roadmaps, validate usability, and steward high-velocity product delivery.", "bronze_sphere", 5, 3, 12, 8, t_minus_90),
        ("team_engineering", "org_colead", "Engineering", "Technology & Platform", "Engineering", "Build resilient, distributed backend primitives, API services, and infrastructure.", "bronze_lattice", 8, 5, 28, 16, t_minus_90),
        ("team_design", "org_colead", "Design", "UI/UX & Experience", "Design", "Deliver cohesive design systems, accessible design tokens, and user research.", "bronze_curves", 4, 2, 10, 6, t_minus_90),
        ("team_marketing", "org_colead", "Marketing", "Growth & Brand", "Marketing", "Shape product narrative, drive customer acquisition, and scale global messaging.", "bronze_beacon", 3, 2, 7, 4, t_minus_90),
    ]
    for team in teams:
        cursor.execute("INSERT OR REPLACE INTO teams VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", team)

    # 2. Seed People matching the reference image and profiles
    people = [
        (
            "person_sarah",
            "org_colead",
            "usr_sarah",
            "Sarah Kim",
            "sarah.kim@company.com",
            "Product Manager",
            "Lead Product Manager",
            "team_product",
            "Product",
            8,
            "0-to-1 Product Strategy, Discovery, Sprint Planning, Metrics",
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80",
            "Customer-obsessed product lead with 8+ years guiding cross-functional teams from 0-to-1 launch to scale.",
            "Lead Product Manager and organization creator at CO-LEAD. Dedicated to capturing team context and ensuring decisions remain durable over time.",
            "Roadmapping, User Discovery, Sprint Planning, Metrics, Product Strategy, Analytics",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_alex",
            "org_colead",
            "usr_alex",
            "Alex Chen",
            "alex.chen@company.com",
            "Frontend Developer",
            "Senior Frontend Engineer",
            "team_product",
            "Engineering",
            5,
            "React, TypeScript, WebGL, Performance Optimization",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
            "Frontend specialist focused on performant React architectures, fluid animations, and accessible component libraries.",
            "Senior engineer building interface foundations and high-performance component systems.",
            "React, TypeScript, Tailwind CSS, Next.js, WebGL, CSS Architecture",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_priya",
            "org_colead",
            "usr_priya",
            "Priya Sharma",
            "priya.sharma@company.com",
            "UX Designer",
            "Senior UX & Interaction Designer",
            "team_product",
            "Design",
            6,
            "Design Systems, Mobile UX, Accessibility (WCAG 2.1 AA), User Research",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
            "Passionate about creating simple, user-centered digital experiences and working closely with product and engineering teams.",
            "Senior UX Designer with over 6 years of experience across web and native mobile applications. Specialized in transforming complex organizational data into intuitive, human workflows.",
            "Figma, UI/UX, Design Systems, Prototyping, Usability Testing, WCAG AA, User Journey Mapping",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_daniel",
            "org_colead",
            "usr_daniel",
            "Daniel Ortiz",
            "daniel.ortiz@company.com",
            "Backend Developer",
            "Senior Backend Engineer",
            "team_product",
            "Engineering",
            7,
            "Distributed Systems, Redis Locking, API Idempotency, Database Scaling",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
            "Distributed systems engineer with deep expertise in API resiliency, Redis locking, and database scalability.",
            "Backend engineer designing bulletproof data pipelines, multi-region caches, and idempotent financial ledger APIs.",
            "Node.js, PostgreSQL, Go, Redis, Docker, Microservices, System Architecture",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_maria",
            "org_colead",
            "usr_maria",
            "Maria Garcia",
            "maria.garcia@company.com",
            "Full Stack Developer",
            "Full Stack Engineer II",
            "team_product",
            "Engineering",
            4,
            "Full Stack React & Node, GraphQL Federations, Cloud API Design",
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80",
            "Versatile engineer working across frontend UI workflows and GraphQL microservices.",
            "Full stack engineer bridging rapid product prototyping with resilient schema-driven service backends.",
            "React, Node.js, GraphQL, Python, Cloud Architecture, REST APIs",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_elena",
            "org_colead",
            "usr_elena",
            "Elena Vance",
            "elena.vance@company.com",
            "Staff Architect",
            "Principal Infrastructure Architect",
            "team_engineering",
            "Engineering",
            11,
            "High Availability Topologies, Distributed Consensus, Chaos Engineering",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
            "Principal architect designing distributed ledger systems, failover topologies, and multi-region replication.",
            "Veteran infrastructure architect leading reliability and system resilience across cross-region clusters.",
            "Distributed Systems, Cloud Infrastructure, Database Internals, Chaos Engineering, Raft",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_marcus",
            "org_colead",
            "usr_marcus",
            "Marcus Chen",
            "marcus.chen@company.com",
            "Junior Engineer",
            "Software Engineer I",
            "team_engineering",
            "Engineering",
            2,
            "Async Task Processing, Event Queues, Observability",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80",
            "High-energy backend contributor specializing in queue processing, webhook ingestion, and API idempotency.",
            "Software engineer focused on queue ingestion performance and real-time observability pipelines.",
            "Go, Redis, Docker, Event-Driven Architecture, SQS, Prometheus",
            "Active",
            t_minus_90,
            t_now
        ),
        (
            "person_aisha",
            "org_colead",
            "usr_aisha",
            "Aisha Patel",
            "aisha.patel@company.com",
            "Security & Auth Engineer",
            "Senior Systems Engineer",
            "team_engineering",
            "Engineering",
            6,
            "OAuth 2.0 PKCE, Zero Trust Security, Cryptographic Key Management",
            "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=240&auto=format&fit=crop&q=80",
            "Security-focused engineer specializing in OAuth 2.0 PKCE, session synchronization, and zero-trust policies.",
            "Systems security engineer engineering enterprise identity brokers, session isolation, and compliance.",
            "TypeScript, OAuth 2.0, Cryptography, Security Auditing, Web Crypto API",
            "Active",
            t_minus_90,
            t_now
        ),
    ]
    for p in people:
        cursor.execute("INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", p)

    # 3. Seed Projects
    projects = [
        (
            "proj_mobile_redesign",
            "org_colead",
            "Mobile App Redesign",
            "MOB-REDESIGN",
            "Complete UX overhaul of the customer-facing mobile application with accessible component tokens and streamlined checkout.",
            "Active",
            60,
            "person_sarah",
            "team_product",
            t_minus_60
        ),
        (
            "proj_payment_gateway",
            "org_colead",
            "Payment Gateway Migration",
            "PAY-GATEWAY",
            "Migrated checkout routing to unified multi-processor API with distributed retry handling and zero duplicate webhook ingestion.",
            "Completed",
            100,
            "person_sarah",
            "team_product",
            t_minus_90
        ),
        (
            "proj_design_tokens",
            "org_colead",
            "Unified Design System",
            "DS-TOKENS",
            "Centralized Figma Variables and multi-platform semantic token pipeline for iOS, Android, and Web.",
            "Active",
            85,
            "person_priya",
            "team_design",
            t_minus_45
        ),
        (
            "proj_cloud_infra",
            "org_colead",
            "Multi-Region Cloud Failover",
            "INFRA-FAILOVER",
            "Autonomous zero-downtime failover between primary and secondary datacenter clusters.",
            "Active",
            70,
            "person_elena",
            "team_engineering",
            t_minus_30
        ),
        (
            "proj_auth_modernization",
            "org_colead",
            "SSO & Multi-Tenant Authentication",
            "AUTH-SSO",
            "Enterprise OAuth 2.0 PKCE modernization with seamless session synchronization and zero token leakage.",
            "Completed",
            100,
            "person_elena",
            "team_engineering",
            t_minus_60
        ),
        (
            "proj_search_indexer",
            "org_colead",
            "Real-Time Search & Event Indexing",
            "SEARCH-INDEX",
            "Distributed pipeline streaming change-data events into indexed full-text cluster with sub-100ms freshness.",
            "Active",
            75,
            "person_daniel",
            "team_engineering",
            t_minus_15
        )
    ]
    for pr in projects:
        cursor.execute("INSERT OR REPLACE INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", pr)

    # 4. Seed Work Records
    work_records = [
        (
            "work_onboarding_ux",
            "org_colead",
            "proj_mobile_redesign",
            "Streamlined Mobile Onboarding Experience",
            "Redesigned the multi-step registration flow to reduce cognitive fatigue and drop-off rates.",
            "Legacy onboarding required 8 modal screens with 34% abandonment before first project creation.",
            "Introduced progressive disclosure, biometric authentication fallback, and localized micro-copy.",
            "Reduced onboarding abandonment from 34% to 11% across 80,000 pilot mobile installs.",
            "Mobile, Figma, React Native",
            "https://figma.com/@company/mobile-onboarding-v3",
            t_minus_30
        ),
        (
            "work_retry_handling",
            "org_colead",
            "proj_payment_gateway",
            "Distributed Payment Retry & Webhook Deduplication",
            "Engineered zero-loss webhook ingestion pipeline handling bursty payment gateway retries.",
            "Legacy payment API caused gateway timeouts and double-charging during peak seasonal spikes.",
            "Adopted Redis distributed lock + SQLite atomic state transition with SHA-256 payload deduplication.",
            "Processed 1.4M transactions over peak season with 0 duplicate ledger updates and sub-40ms handler latency.",
            "Node.js, PostgreSQL, Redis",
            "https://github.com/internal/payments/pull/1428",
            t_minus_60
        )
    ]
    for wr in work_records:
        cursor.execute("INSERT OR REPLACE INTO work_records VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", wr)

    # 5. Seed Contributions (Attribution vs Ownership separation)
    contributions = [
        (
            "contrib_priya_analysis",
            "org_colead",
            "person_priya",
            "proj_mobile_redesign",
            "work_onboarding_ux",
            "team_product",
            "UX Comparison Analysis & User Onboarding Flow",
            "UX Design & Research",
            "Legacy 8-step registration modal caused 34% user drop-off during onboarding.",
            "Conducted competitive UX research and prototyped a 3-step progressive onboarding architecture.",
            "New onboarding design adopted; improved first-day user completion by 42%.",
            "Figma, Prototyping, Usability",
            "Research Doc: 'Mobile Onboarding Benchmark 2026' & Figma V3 Flow",
            "Sarah Kim (Product Lead review), Alex Chen (frontend feasibility)",
            t_minus_5
        ),
        (
            "contrib_priya_library",
            "org_colead",
            "person_priya",
            "proj_mobile_redesign",
            "work_onboarding_ux",
            "team_product",
            "UI Components Library & Accessibility Tokens",
            "Design Systems",
            "Inconsistent form inputs across iOS and Web broke WCAG AA contrast compliance.",
            "Standardized 24 high-contrast inputs with dynamic spacing tokens and dark-mode elevation.",
            "Passed WCAG 2.1 AA audit with 100% compliance across all mobile views.",
            "Figma, Design Tokens",
            "Figma: 'Components/Mobile/Forms/v3'",
            "Alex Chen (React implementation)",
            t_minus_2
        ),
        (
            "contrib_daniel_retry",
            "org_colead",
            "person_daniel",
            "proj_payment_gateway",
            "work_retry_handling",
            "team_product",
            "Implemented Payment Gateway Retry & Idempotency Broker",
            "Implementation & Reliability",
            "Third-party gateway retries overloaded worker queues and triggered duplicate debit attempts.",
            "Engineered Redis mutex with atomic SQLite state transitions and SHA-256 deduplication.",
            "Reduced payment failure rate to 0.002% across 1.4M transactions.",
            "Node.js, Redis, PostgreSQL",
            "PR #1428 (pkg/payments/retry.go)",
            "Sarah Kim (Product Lead review), Alex Chen (checkout frontend)",
            t_minus_60
        ),
        (
            "contrib_alex_frontend",
            "org_colead",
            "person_alex",
            "proj_mobile_redesign",
            "work_onboarding_ux",
            "team_product",
            "Interactive Onboarding Component System in React Native",
            "Frontend Engineering",
            "Legacy transitions suffered from frame stuttering on low-tier mobile devices.",
            "Engineered hardware-accelerated 60fps gesture transitions with zero JS thread blocking.",
            "Achieved constant 60fps animation performance across iOS and Android.",
            "React Native, TypeScript, Reanimated",
            "PR #214 (apps/mobile/onboarding)",
            "Priya Sharma (UX design specs)",
            t_minus_1
        ),
        (
            "contrib_maria_graphql",
            "org_colead",
            "person_maria",
            "proj_mobile_redesign",
            "work_onboarding_ux",
            "team_product",
            "Aggregated GraphQL Gateway for Mobile Profile Ingestion",
            "Full Stack Engineering",
            "Client required 4 separate HTTP calls to assemble profile and permission records.",
            "Built a federated GraphQL resolver consolidating customer profile, team, and entitlements into one call.",
            "Cut mobile initial load payload by 65% and reduced latency by 320ms.",
            "Node.js, GraphQL, Apollo",
            "PR #305 (services/gateway/profile.ts)",
            "Daniel Ortiz (backend review)",
            t_minus_15
        ),
        (
            "contrib_sarah_roadmap",
            "org_colead",
            "person_sarah",
            "proj_mobile_redesign",
            "work_onboarding_ux",
            "team_product",
            "Customer Research Synthesis & Q3 Mobile Roadmap",
            "Product Strategy",
            "Engineering lacked clear prioritization across 40 user feature requests.",
            "Synthesized 120 customer feedback sessions into a clear 3-phase delivery roadmap.",
            "Achieved unanimous stakeholder sign-off and on-time sprint execution.",
            "Product Strategy, Analytics",
            "PRD-202: Mobile Experience Evolution",
            "Priya Sharma, Alex Chen",
            t_minus_30
        ),
        (
            "contrib_elena_failover",
            "org_colead",
            "person_elena",
            "proj_cloud_infra",
            None,
            "team_engineering",
            "Multi-Region Database Synchronization & Failover Topology",
            "Architecture",
            "Single-datacenter outage posed existential risk of transaction loss.",
            "Designed dual-write transactional ledger with deterministic conflict resolution.",
            "Validated 1.8s warm failover with zero transactional anomalies.",
            "PostgreSQL, Raft, Distributed Systems",
            "RFC-104: Multi-Region Payment Ledger Topology",
            "Daniel Ortiz, Marcus Chen",
            t_minus_45
        ),
        (
            "contrib_marcus_webhook",
            "org_colead",
            "person_marcus",
            "proj_payment_gateway",
            "work_retry_handling",
            "team_engineering",
            "Webhook Queue Ingestion Worker with Jitter Backoff",
            "Implementation",
            "Bursty gateway retries caused worker thread exhaustion.",
            "Implemented async queue consumer with exponential backoff and jitter.",
            "Scaled to 800 events/sec with zero queue starvation.",
            "Go, Redis, SQS",
            "PR #1430 (pkg/webhooks/worker.go)",
            "Daniel Ortiz",
            t_minus_60
        ),
        (
            "contrib_aisha_tokens",
            "org_colead",
            "person_aisha",
            "proj_mobile_redesign",
            "work_onboarding_ux",
            "team_engineering",
            "Biometric Token Vault & Multi-Tab Web Locks Broker",
            "Security & Auth",
            "Concurrent app sessions triggered refresh token invalidation.",
            "Engineered Web Locks API coordinator with secure enclave biometric storage.",
            "Eliminated 99.8% of session eviction errors across active users.",
            "TypeScript, Web Crypto API",
            "PR #1440 (src/auth/token-broker.ts)",
            "Alex Chen",
            t_minus_30
        ),
        (
            "contrib_aisha_pkce",
            "org_colead",
            "person_aisha",
            "proj_auth_modernization",
            None,
            "team_engineering",
            "OAuth 2.0 PKCE Handshake & Silent Refresh Worker",
            "Security Engineering",
            "Third-party cookie phase-out caused silent authentication dropouts across subdomains.",
            "Architected partitioned cookie storage with Web Crypto PKCE verifiers and background refresh worker.",
            "Protected enterprise customer logins with zero session dropout across modern browser sandbox modes.",
            "OAuth 2.0, Web Crypto, TypeScript",
            "PR #1502 (pkg/auth/pkce-broker.ts)",
            "Elena Vance (Architecture review)",
            t_minus_60
        ),
        (
            "contrib_marcus_indexing",
            "org_colead",
            "person_marcus",
            "proj_search_indexer",
            None,
            "team_engineering",
            "Change-Data-Capture Pipeline & Elasticsearch Mapping",
            "Data & Indexing",
            "Real-time event indexing jammed worker buffers when datetime payloads had mixed timezones.",
            "Enforced UTC ISO-8601 normalization filter in Debezium connector before Elasticsearch ingestion.",
            "Restored sub-80ms full-text index freshness with zero dropped Kafka streaming records.",
            "Elasticsearch, Kafka, Go",
            "PR #1580 (services/indexer/normalizer.go)",
            "Daniel Ortiz (Staff review)",
            t_minus_15
        )
    ]
    for c in contributions:
        cursor.execute("INSERT OR REPLACE INTO contributions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", c)

    # 6. Seed Recent Activity matching the reference image
    activities = [
        ("act_1", "team_product", "person_sarah", "Sarah Kim", "Updated project roadmap", "2 hours ago", t_now),
        ("act_2", "team_product", "person_alex", "Alex Chen", "Merged pull request", "4 hours ago", t_now),
        ("act_3", "team_product", "person_priya", "Priya Sharma", "Added design document", "1 day ago", t_minus_1),
        ("act_4", "team_product", "person_daniel", "Daniel Ortiz", "Deployed payment retry broker", "2 days ago", t_minus_2),
        ("act_5", "team_engineering", "person_elena", "Elena Vance", "Published RFC-104 topology", "3 days ago", t_minus_5),
    ]
    for act in activities:
        cursor.execute("INSERT OR REPLACE INTO recent_activity VALUES (?, ?, ?, ?, ?, ?, ?)", act)

if __name__ == "__main__":
    init_db(force_reseed=True)
