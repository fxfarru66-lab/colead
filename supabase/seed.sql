-- ============================================================================
-- COLEAD FOUNDATIONAL SEED DATA (SUPABASE / POSTGRESQL)
-- ============================================================================

-- 1. Organizations
INSERT INTO public.organizations (
    id, name, business_purpose, join_code, creator_id, tagline, industry, description, mission, website, location, team_size, created_at, updated_at
) VALUES (
    'org_colead',
    'CO-LEAD',
    'Technology & Product Engineering',
    'COLEAD-9X2P4',
    'usr_sarah',
    'Organizational Memory, Built for the People Who Create It.',
    'Enterprise Software & Distributed Systems',
    'Co-Lead builds resilient digital products and preserves organizational memory across projects, technical decisions, and individual contributions.',
    'Capture, connect and preserve your organization''s knowledge. Turn everyday work into lasting memory.',
    'https://co-lead.internal',
    'San Francisco, CA',
    '50-200 Members',
    NOW() - INTERVAL '90 days',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. Users (Accounts)
INSERT INTO public.users (
    id, organization_id, name, email, password_hash, role, is_creator, avatar_url, created_at
) VALUES 
('usr_sarah', 'org_colead', 'Sarah Kim', 'sarah.kim@company.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Lead Administrator', TRUE, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80', NOW() - INTERVAL '90 days'),
('usr_alex', 'org_colead', 'Alex Chen', 'alex.chen@company.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Member', FALSE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80', NOW() - INTERVAL '80 days'),
('usr_priya', 'org_colead', 'Priya Sharma', 'priya.sharma@company.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Member', FALSE, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80', NOW() - INTERVAL '75 days'),
('usr_daniel', 'org_colead', 'Daniel Ortiz', 'daniel.ortiz@company.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Member', FALSE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80', NOW() - INTERVAL '70 days'),
('usr_maria', 'org_colead', 'Maria Garcia', 'maria.garcia@company.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 'Member', FALSE, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80', NOW() - INTERVAL '65 days')
ON CONFLICT (id) DO NOTHING;

-- 3. Teams
INSERT INTO public.teams (
    id, organization_id, name, subtitle, department, mission, icon_type, member_count, project_count, contribution_count, memory_units, created_at
) VALUES
('team_product', 'org_colead', 'Product Team', 'Product & Innovation', 'Product', 'Guiding product strategy, user discovery, and roadmap execution across core domains.', 'bronze_sphere', 3, 3, 24, 12, NOW() - INTERVAL '90 days'),
('team_engineering', 'org_colead', 'Engineering', 'Technology & Platform', 'Engineering', 'Architecting resilient distributed systems, high-performance APIs, and cloud services.', 'slate_cube', 4, 4, 38, 20, NOW() - INTERVAL '90 days'),
('team_design', 'org_colead', 'Design', 'UI/UX & Experience', 'Design', 'Crafting intentional design systems, fluid motion, and accessible user experiences.', 'silver_torus', 2, 2, 16, 8, NOW() - INTERVAL '90 days'),
('team_growth', 'org_colead', 'Marketing & Growth', 'Growth & Brand', 'Marketing', 'Driving enterprise adoption, audience engagement, and go-to-market execution.', 'slate_cube', 2, 2, 12, 6, NOW() - INTERVAL '90 days')
ON CONFLICT (id) DO NOTHING;

-- 4. People
INSERT INTO public.people (
    id, organization_id, user_id, name, email, role, title, team_id, department, years_of_experience, areas_of_expertise, avatar_url, about, bio, skills, status, created_at, updated_at
) VALUES
('person_sarah', 'org_colead', 'usr_sarah', 'Sarah Kim', 'sarah.kim@company.com', 'Lead Administrator', 'Lead Product Manager', 'team_product', 'Product', 7, 'Product Strategy, Roadmapping, User Discovery, API Productization', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80', 'Senior product leader spearheading multi-tenant architectures and data attribution workflows.', 'Leading core product initiatives and organizational memory retention.', 'Product Strategy, Roadmapping, Agile, User Research, System Architecture', 'Active', NOW() - INTERVAL '90 days', NOW()),
('person_alex', 'org_colead', 'usr_alex', 'Alex Chen', 'alex.chen@company.com', 'Staff Engineer', 'Staff Frontend Architect', 'team_engineering', 'Engineering', 6, 'React, TypeScript, 3D Spatial UI, State Architecture, Canvas & WebGL', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80', 'Frontend architect specializing in high-performance web applications and 3D interfaces.', 'Specializing in React, WebGL, and scalable frontend design systems.', 'React, TypeScript, Tailwind CSS, Three.js, Next.js, WebGL', 'Active', NOW() - INTERVAL '80 days', NOW()),
('person_priya', 'org_colead', 'usr_priya', 'Priya Sharma', 'priya.sharma@company.com', 'Staff Designer', 'Principal UX Designer', 'team_design', 'Design', 5, 'Design Systems, Spatial UI, Motion Design, Accessibility (WCAG AAA)', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80', 'Design systems leader dedicated to typography, micro-interactions, and spatial visual hierarchy.', 'Passionate about craft, tactile design languages, and spatial product design.', 'Figma, Design Systems, Typography, Motion UI, User Research', 'Active', NOW() - INTERVAL '75 days', NOW()),
('person_daniel', 'org_colead', 'usr_daniel', 'Daniel Ortiz', 'daniel.ortiz@company.com', 'Principal Engineer', 'Principal Backend Architect', 'team_engineering', 'Engineering', 8, 'Distributed Systems, PostgreSQL, SQLite, Real-Time WebSockets, Vector Databases', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80', 'Distributed systems engineer focused on reliable memory persistence and sub-millisecond query caches.', 'Deep experience in PostgreSQL, high-throughput caching, and async pipelines.', 'PostgreSQL, Python, Node.js, SQLite, Redis, Distributed Systems', 'Active', NOW() - INTERVAL '70 days', NOW()),
('person_maria', 'org_colead', 'usr_maria', 'Maria Garcia', 'maria.garcia@company.com', 'Senior Engineer', 'Senior Full Stack Engineer', 'team_engineering', 'Engineering', 5, 'Full Stack TypeScript, Stripe Payment Integrations, GraphQL, Enterprise Security', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80', 'Full stack engineer with a proven track record delivering payment gateways and real-time dashboards.', 'Delivering resilient e-commerce checkout funnels and webhook pipelines.', 'TypeScript, Node.js, Stripe API, PostgreSQL, React, WebSockets', 'Active', NOW() - INTERVAL '65 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Projects
INSERT INTO public.projects (
    id, organization_id, name, code, description, status, progress, project_lead_id, team_id, created_at
) VALUES
('proj_checkout', 'org_colead', 'Checkout 2.0 & Payment Flow', 'CHK-2024', 'Re-architecting checkout funnel with multi-currency Stripe support, idempotent order tracking, and 99.99% uptime guarantees.', 'Active', 85, 'person_maria', 'team_engineering', NOW() - INTERVAL '60 days'),
('proj_memorygrid', 'org_colead', 'CoLead 3D Organizational Memory', 'MEM-2025', 'Spatial command center for enterprise memory recall, AI reasoning via Gemini, and Hindsight vector persistence.', 'Active', 92, 'person_alex', 'team_engineering', NOW() - INTERVAL '45 days'),
('proj_design_system', 'org_colead', 'Obsidian Design System', 'DS-V3', 'Tactile enterprise UI foundation with spatial elevation, WCAG AAA contrast, and warm ivory/charcoal aesthetics.', 'Active', 95, 'person_priya', 'team_design', NOW() - INTERVAL '70 days'),
('proj_mobile', 'org_colead', 'Mobile Intelligence Suite', 'MOB-2025', 'Offline-first progressive web companion with native voice synthesis and biometric access pass verification.', 'Active', 40, 'person_sarah', 'team_product', NOW() - INTERVAL '20 days')
ON CONFLICT (id) DO NOTHING;

-- 6. Work Records
INSERT INTO public.work_records (
    id, organization_id, project_id, title, summary, problem_statement, technical_decision, outcome, technology, artifact_url, created_at
) VALUES
('rec_stripe_idempotency', 'org_colead', 'proj_checkout', 'Stripe Idempotency & Webhook Queue Architecture', 'Engineered bulletproof payment webhook processing preventing double-charge anomalies.', 'High-concurrency checkout bursts caused duplicate payment event handling during network retries.', 'Introduced transactional Redis locks + PostgreSQL deduplication with strict idempotency keys.', 'Zero duplicate charges across 250k+ transactions with <15ms webhook resolution.', 'Stripe API, Node.js, PostgreSQL, Redis', 'https://github.com/colead/checkout-core/pull/142', NOW() - INTERVAL '40 days'),
('rec_spatial_graph', 'org_colead', 'proj_memorygrid', '3D Spatial Graph Orbit & Vector Rendering Engine', 'Implemented performant CSS 3D matrix transformations and orbital canvas for memory navigation.', 'Complex knowledge graphs felt flat and unengaging in standard list/table views.', 'Designed layered 3D coordinate orbit cards with depth parallax, dynamic lighting, and zero lag.', 'Interactive 60fps graph rendering with instant visual understanding of contributor relationships.', 'React, TypeScript, CSS 3D, WebGL', 'https://github.com/colead/orbit-engine/pull/88', NOW() - INTERVAL '30 days'),
('rec_hindsight_retention', 'org_colead', 'proj_memorygrid', 'Hindsight Cloud Memory Bank Integration', 'Connected CoLead with Hindsight Cloud for semantic memory retention and cross-project knowledge recall.', 'Engineering teams were repeatedly re-solving identical architectural hurdles without shared memory.', 'Integrated Hindsight REST API with automatic contribution summarization and semantic embeddings.', 'Saved an estimated 120 engineering hours in the first month by recalling past decisions.', 'Hindsight Cloud API, Python, SQLite, PostgreSQL', 'https://api.hindsight.vectorize.io', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- 7. Contributions
INSERT INTO public.contributions (
    id, organization_id, person_id, project_id, work_record_id, team_id, title, contribution_type, problem_solved, technical_decision, outcome, technology, artifact_reference, collaborators, created_at
) VALUES
('contrib_stripe_webhook', 'org_colead', 'person_maria', 'proj_checkout', 'rec_stripe_idempotency', 'team_engineering', 'Implemented Idempotent Stripe Webhook Handler', 'Backend Engineering', 'Prevented duplicate charges during flaky network retry spikes.', 'Implemented transactional PostgreSQL locks paired with unique idempotency keys.', '100% payment consistency and zero chargeback disputes.', 'Stripe API, Node.js, PostgreSQL', 'PR #142', 'Daniel Ortiz', NOW() - INTERVAL '40 days'),
('contrib_spatial_orbit', 'org_colead', 'person_alex', 'proj_memorygrid', 'rec_spatial_graph', 'team_engineering', 'Engineered 3D Orbit Knowledge Graph Visualizer', 'Frontend Architecture', 'Transformed dense tabular memory data into an intuitive spatial experience.', 'Built custom CSS 3D matrix math and orbital physics animations.', 'Smooth 60 FPS spatial navigation and high user engagement.', 'React, TypeScript, CSS 3D Matrix', 'PR #88', 'Priya Sharma', NOW() - INTERVAL '30 days'),
('contrib_design_elevation', 'org_colead', 'person_priya', 'proj_design_system', 'rec_spatial_graph', 'team_design', 'Designed Warm Ivory & Charcoal Spatial Tokens', 'UI/UX Design', 'Inconsistent visual hierarchy and dark-mode eye fatigue across team dashboards.', 'Created cohesive 3D elevation system, warm neutral palettes, and accessible contrast ratios.', 'Adopted across 100% of application views with WCAG AAA compliance.', 'Figma, Tailwind CSS, Design Tokens', 'Design System v3.2', 'Alex Chen', NOW() - INTERVAL '50 days'),
('contrib_hindsight_pipeline', 'org_colead', 'person_daniel', 'proj_memorygrid', 'rec_hindsight_retention', 'team_engineering', 'Integrated Hindsight Semantic Retention Engine', 'Distributed Systems', 'Fragmented memory silos between product and engineering pods.', 'Built asynchronous Hindsight Cloud bridge with background batching and fallback.', 'Sub-100ms semantic recall across all past engineering decisions.', 'Hindsight Cloud, Python, PostgreSQL', 'Bridge v1.4', 'Sarah Kim', NOW() - INTERVAL '25 days')
ON CONFLICT (id) DO NOTHING;

-- 8. Recent Activity
INSERT INTO public.recent_activity (
    id, organization_id, team_id, person_id, person_name, action, time_ago, created_at
) VALUES
('act_1', 'org_colead', 'team_engineering', 'person_maria', 'Maria Garcia', 'Retained technical decision on Stripe Idempotency into Hindsight', '2 hours ago', NOW() - INTERVAL '2 hours'),
('act_2', 'org_colead', 'team_engineering', 'person_alex', 'Alex Chen', 'Optimized 3D Orbit Spatial Render Engine for mobile viewports', '4 hours ago', NOW() - INTERVAL '4 hours'),
('act_3', 'org_colead', 'team_design', 'person_priya', 'Priya Sharma', 'Published Obsidian 3D Design Tokens and Elevation Guidelines', '1 day ago', NOW() - INTERVAL '1 day'),
('act_4', 'org_colead', 'team_product', 'person_sarah', 'Sarah Kim', 'Generated Project Architect Blueprint for E-Commerce Platform', '2 days ago', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;
