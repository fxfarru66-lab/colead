export interface Organization {
  id: string;
  name: string;
  business_purpose?: string;
  business_type?: string;
  primary_domain?: string;
  join_code?: string;
  creator_id?: string;
  tagline: string;
  industry: string;
  description: string;
  mission: string;
  website: string;
  location: string;
  team_size: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  organization_id?: string;
  avatarUrl: string;
  is_creator?: boolean;
  token?: string;
}

export interface OrganizationMember {
  person_id: string;
  user_id?: string;
  name: string;
  email: string;
  role: string;
  title: string | null;
  department?: string;
  avatar_url?: string;
  years_of_experience?: number;
  skills?: string;
  areas_of_expertise?: string;
  about?: string;
  bio?: string;
  created_at: string;
  status: string;
  team_name?: string;
  is_creator: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string | null;
  avatar_url?: string;
  about?: string;
  skills?: string;
  status?: string;
  created_at: string;
  contribution_count: number;
  is_lead: number;
}

export interface TeamProjectRef {
  id: string;
  name: string;
  code: string;
  status: string;
  progress?: number;
  description?: string;
}

export interface RecentActivityItem {
  id: string;
  team_id?: string;
  person_id?: string;
  person_name: string;
  action: string;
  time_ago: string;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  subtitle?: string;
  department: string;
  mission?: string | null;
  icon_type?: string;
  created_at: string;
  member_count: number;
  project_count: number;
  active_projects_count?: number;
  contribution_count: number;
  memory_units?: number;
  members?: TeamMember[];
  team_lead?: string;
  team_lead_role?: string | null;
  projects?: TeamProjectRef[];
  recent_activity?: RecentActivityItem[];
}

export interface Person {
  id: string;
  organization_id?: string;
  user_id?: string;
  name: string;
  email: string;
  role: string;
  title: string | null;
  team_id: string | null;
  team_name: string | null;
  team_department?: string;
  team_subtitle?: string | null;
  avatar_url?: string;
  about?: string;
  bio?: string;
  skills?: string;
  department?: string;
  years_of_experience?: number;
  areas_of_expertise?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
  contribution_count: number;
  relevant_projects_count: number;
  projects_led_count: number;
  is_creator?: boolean;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  status: string;
  progress?: number;
  project_lead_id: string | null;
  project_lead_name: string | null;
  project_lead_role: string | null;
  team_id?: string | null;
  team_name?: string | null;
  created_at: string;
  contributor_count: number;
  contribution_count: number;
  work_record_count: number;
}

export interface WorkRecord {
  id: string;
  project_id: string;
  project_name?: string;
  project_code?: string;
  team_name?: string;
  title: string;
  summary: string;
  problem_statement: string;
  technical_decision: string;
  outcome: string;
  technology?: string;
  artifact_url: string | null;
  created_at: string;
  contribution_count?: number;
  people_involved?: Array<{ id: string; name: string; role: string; avatar_url?: string }>;
}

export interface Contribution {
  id: string;
  person_id: string;
  project_id: string;
  work_record_id: string | null;
  team_id: string | null;
  title: string;
  contribution_type: string;
  problem_solved: string;
  technical_decision: string;
  outcome: string;
  technology?: string;
  artifact_reference: string | null;
  collaborators: string | null;
  created_at: string;
  person_name: string;
  person_role: string;
  person_avatar?: string;
  project_name: string;
  project_code: string;
  project_lead_name: string | null;
  project_status?: string;
  is_lead: boolean;
  team_name: string | null;
}

export interface PersonDetail {
  person: Person;
  overview: {
    about: string;
    team: string;
    email: string;
    skills: string[];
    current_work?: {
      name: string;
      description: string;
      progress: number;
    };
    recent_contributions: Contribution[];
  };
  current_work?: any[];
  previous_work?: any[];
  context_metrics?: any;
  contributions: Contribution[];
  projects: Array<{
    id: string;
    name: string;
    code: string;
    description: string;
    status: string;
    progress?: number;
    created_at: string;
    is_lead: boolean;
  }>;
  decisions: Array<{
    id: string;
    project_name: string;
    title: string;
    decision: string;
    outcome: string;
    created_at: string;
  }>;
  memories: Array<{
    id: string;
    document_type: string;
    status: string;
    hindsight_bank_id?: string;
    created_at: string;
    contribution_title?: string;
  }>;
}

export interface Stats {
  memory_units: number;
  organizational_memories: number;
  projects: number;
  teams: number;
  contributors: number;
  people: number;
  total_contributions: number;
  contributions: number;
}

export interface HealthStatus {
  status: string;
  service: string;
  version: string;
  database: string;
  database_engine?: string;
  hindsight?: {
    service: string;
    base_url: string;
    bank_id: string;
    bank_id_configured: boolean;
    api_key_configured: boolean;
    status: string;
  };
}

export interface HindsightCloudHealth {
  connected: boolean;
  cloud_reachable: boolean;
  configured: boolean;
  bank_id?: string | null;
  api_version?: string | null;
  error?: string;
  status_code?: number;
}

export interface HindsightAskResult {
  answer: string;
  why: string;
  people: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    highlight?: string;
    team?: string;
  }>;
  past_work: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  outcome: string | null;
  evidence: Array<{
    id: string;
    type: string;
    project_id?: string;
    project_name?: string;
    project_code?: string;
    person_id?: string;
    person_name?: string;
    person_role?: string;
    person_avatar?: string;
    team_name?: string;
    contribution?: string;
    problem?: string;
    solution?: string;
    outcome?: string;
    artifact?: string;
    date?: string;
    raw_text?: string;
  }>;
  has_memory: boolean;
  hindsight_cloud_used: boolean;
  gemini_reasoning_used?: boolean;
  gemini_model?: string;
}

export interface DatabaseHealth {
  status: string;
  connected: boolean;
  engine: string;
  database: string;
  table_counts?: Record<string, number>;
  latency_ms?: number;
}

export interface SystemHealthReport {
  colead_core: {
    status: 'CONNECTED' | 'NOT CONFIGURED' | 'CONNECTION ERROR';
    version: string;
    environment: string;
    uptime_seconds?: number;
  };
  gemini: {
    status: 'CONNECTED' | 'NOT CONFIGURED' | 'CONNECTION ERROR' | 'AUTHORIZATION REQUIRED';
    model: string;
    configured: boolean;
    reasoning_enabled: boolean;
    error?: string;
  };
  hindsight: {
    status: 'CONNECTED' | 'NOT CONFIGURED' | 'CONNECTION ERROR' | 'AUTHORIZATION REQUIRED';
    cloud_reachable: boolean;
    base_url: string;
    configured: boolean;
    api_version?: string;
    error?: string;
  };
  hindsight_bank: {
    status: 'CONNECTED' | 'NOT CONFIGURED' | 'CONNECTION ERROR';
    bank_id: string | null;
    configured: boolean;
    error?: string;
  };
  database: {
    status: 'CONNECTED' | 'NOT CONFIGURED' | 'CONNECTION ERROR';
    engine: string;
    connected: boolean;
    total_records?: number;
  };
  authentication: {
    status: 'CONNECTED';
    isolation: 'multi-tenant';
    access_pass_configured: boolean;
  };
}

export interface ProjectUnderstanding {
  project_name: string;
  purpose: string;
  target_users: string;
  main_features: string[];
  technical_requirements: string[];
  integrations: string[];
  expected_outcomes: string;
  required_capabilities: string[];
  potential_risks: string[];
  unknown_information: string;
}

export interface RequiredRole {
  role_name: string;
  category: string;
  description: string;
  why_relevant: string;
  required_skills: string[];
}

export interface ContributionActivityMetrics {
  projects_contributed_to: number;
  documented_contributions: number;
  problems_solved: number;
  decisions_contributed: number;
  successful_outcomes: number;
  relevant_skills_match: string[];
  relevant_projects: string[];
}

export interface SuggestedContributor {
  role_name: string;
  role_category: string;
  person_id: string;
  person_name: string;
  person_role: string;
  person_avatar?: string;
  team_name?: string;
  why_suggested: string;
  contribution_activity: ContributionActivityMetrics;
  evidence: Array<{
    project_name: string;
    contribution_title: string;
    problem_solved?: string;
    technical_decision?: string;
    outcome?: string;
    technology?: string;
    date?: string;
  }>;
}

export interface HistoricalLesson {
  category: string;
  previous_project: string;
  historical_issue: string;
  proven_solution: string;
  outcome: string;
  potential_application: string;
  contributor?: string;
  source_type?: string;
}

export interface RoadmapPhase {
  phase_number: string;
  phase_name: string;
  objective: string;
  tasks: string[];
  relevant_role: string;
  suggested_contributor: string;
  dependencies: string[];
  historical_lesson?: string;
  status: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  category:
    | 'project'
    | 'capability'
    | 'role'
    | 'person'
    | 'technology'
    | 'phase'
    | 'lesson'
    | 'risk'
    | 'problem'
    | 'decision'
    | 'solution'
    | 'outcome'
    | 'milestone'
    | 'team'
    | 'skill';
  depth: number;
  color?: string;
  subtitle?: string;
  details?: string;
  avatar?: string;
  evidence_count?: number;
  evidence_data?: any;
  x?: number;
  y?: number;
  z?: number;
}

export interface MindMapLink {
  source: string;
  target: string;
  relationship: string;
}

export interface ProjectStateProgress {
  track: string;
  percentage: number;
  status: string;
}

export interface NextActionItem {
  action: string;
  reason: string;
  owner?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ProjectArchitectBlueprint {
  project_understanding: ProjectUnderstanding;
  executive_summary?: string;
  success_criteria?: string[];
  required_roles: RequiredRole[];
  suggested_contributors: SuggestedContributor[];
  historical_lessons: HistoricalLesson[];
  roadmap: RoadmapPhase[];
  mindmap: {
    nodes: MindMapNode[];
    links: MindMapLink[];
  };
  current_state: {
    status_summary: string;
    active_organizational_projects_count: number;
    completed_projects_count: number;
    total_documented_contributions: number;
    total_work_records: number;
    progress_breakdown: ProjectStateProgress[];
    next_actions: NextActionItem[];
  };
  hindsight_evidence?: Array<{
    id: string;
    text: string;
    metadata?: any;
  }>;
  hindsight_cloud_used: boolean;
  organization_id: string;
  created_at: string;
}

export interface ProjectArchitectState {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_contributions: number;
  total_work_records: number;
  active_projects_list: Project[];
  recent_contributions: Contribution[];
  progress_breakdown: ProjectStateProgress[];
  next_actions: NextActionItem[];
}

export type PageId =
  | 'signin'
  | 'verify-2fa'
  | 'create-first-team'
  | 'dashboard'
  | 'work-memory'
  | 'contributions'
  | 'ask'
  | 'teams'
  | 'people'
  | 'new-work'
  | 'profile'
  | 'organization'
  | 'team-orbit'
  | 'person-profile'
  | 'system-health';
