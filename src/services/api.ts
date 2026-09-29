import {
  HealthStatus,
  Stats,
  Team,
  Person,
  PersonDetail,
  Project,
  WorkRecord,
  Contribution,
  Organization,
  UserSession,
  OrganizationMember,
  HindsightCloudHealth,
  HindsightAskResult,
  ProjectArchitectBlueprint,
  ProjectArchitectState,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('colead_session_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-session-token'] = token;
    }
  } catch {}
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || errorBody.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const apiService = {
  // Check active session on server
  async checkSession(): Promise<{ authenticated: boolean; user?: UserSession; person?: Person; organization?: Organization }> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.status === 401) {
        return { authenticated: false };
      }
      return handleResponse(res);
    } catch {
      return { authenticated: false };
    }
  },

  // Sign In to existing account
  async signIn(data: {
    email: string;
    password?: string;
    organizationName?: string;
  }): Promise<{ status: string; token?: string; user: UserSession; person: Person; organization: Organization }> {
    const res = await fetch(`${API_BASE}/auth/signin`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const parsed = await handleResponse<{ status: string; token?: string; user: UserSession; person: Person; organization: Organization }>(res);
    if (parsed.token) {
      try {
        localStorage.setItem('colead_session_token', parsed.token);
      } catch {}
    }
    return parsed;
  },

  // Verify 2FA
  async verify2FA(data: {
    code: string;
    email: string;
    organization?: string;
  }): Promise<{ status: string; token: string; user: UserSession }> {
    const res = await fetch(`${API_BASE}/auth/verify-2fa`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const parsed = await handleResponse<{ status: string; token: string; user: UserSession }>(res);
    if (parsed.token) {
      try {
        localStorage.setItem('colead_session_token', parsed.token);
      } catch {}
    }
    return parsed;
  },

  // Verify Organization Join Code
  async verifyJoinCode(joinCode: string): Promise<{ valid: boolean; organization: { id: string; name: string; business_purpose?: string; join_code: string } }> {
    const res = await fetch(`${API_BASE}/auth/verify-join-code`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ joinCode }),
    });
    return handleResponse(res);
  },

  // Create New Organization (Org Creator)
  async createOrganization(data: {
    organizationName: string;
    businessPurpose?: string;
    creatorName: string;
    email: string;
    password?: string;
    accessPassword: string;
  }): Promise<{ status: string; token?: string; user: UserSession; organization: Organization; person_id: string }> {
    const res = await fetch(`${API_BASE}/auth/create-organization`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const parsed = await handleResponse<{ status: string; token?: string; user: UserSession; organization: Organization; person_id: string }>(res);
    if (parsed.token) {
      try {
        localStorage.setItem('colead_session_token', parsed.token);
      } catch {}
    }
    return parsed;
  },

  // Join Existing Organization
  async joinOrganization(data: {
    joinCode: string;
    name: string;
    email: string;
    password?: string;
    accessPassword: string;
    role?: string;
    department?: string;
  }): Promise<{ status: string; token?: string; user: UserSession; organization: Organization; person_id: string }> {
    const res = await fetch(`${API_BASE}/auth/join-organization`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const parsed = await handleResponse<{ status: string; token?: string; user: UserSession; organization: Organization; person_id: string }>(res);
    if (parsed.token) {
      try {
        localStorage.setItem('colead_session_token', parsed.token);
      } catch {}
    }
    return parsed;
  },

  // Sign Out (clears session and cookie)
  async signOut(): Promise<{ success: boolean }> {
    try {
      localStorage.removeItem('colead_session_token');
    } catch {}
    const res = await fetch(`${API_BASE}/auth/signout`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Regenerate Join Code
  async regenerateJoinCode(): Promise<{ join_code: string; status: string }> {
    const res = await fetch(`${API_BASE}/auth/regenerate-join-code`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Get Organization Details
  async getOrganization(): Promise<Organization> {
    const res = await fetch(`${API_BASE}/organization`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<Organization>(res);
  },

  // Update Organization Details
  async updateOrganization(data: Partial<Organization>): Promise<{ status: string; id: string }> {
    const res = await fetch(`${API_BASE}/organization`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Get Organization Members
  async getOrganizationMembers(): Promise<OrganizationMember[]> {
    const res = await fetch(`${API_BASE}/organization/members`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<OrganizationMember[]>(res);
  },

  // Update Personal Profile
  async updateProfile(data: Partial<Person>): Promise<{ status: string; person: Person }> {
    const res = await fetch(`${API_BASE}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Upload Profile Photo
  async uploadProfilePhoto(dataUrl: string, fileName?: string): Promise<{ success: boolean; avatarUrl: string }> {
    const res = await fetch(`${API_BASE}/users/profile-photo`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ dataUrl, fileName }),
    });
    return handleResponse(res);
  },

  async getHealth(): Promise<HealthStatus> {
    const res = await fetch(`${API_BASE}/health`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<HealthStatus>(res);
  },

  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<Stats>(res);
  },

  async getTeams(): Promise<Team[]> {
    const res = await fetch(`${API_BASE}/teams`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<Team[]>(res);
  },

  async getTeamWorkspace(id: string): Promise<Team> {
    const res = await fetch(`${API_BASE}/teams/${id}/workspace`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<Team>(res);
  },

  async createTeam(data: {
    name: string;
    subtitle?: string;
    department?: string;
    mission?: string;
    member_ids?: string[];
  }): Promise<Team> {
    const res = await fetch(`${API_BASE}/teams`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse<Team>(res);
  },

  async getPeople(): Promise<Person[]> {
    const res = await fetch(`${API_BASE}/people`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<Person[]>(res);
  },

  async getPersonDetail(id: string): Promise<PersonDetail> {
    const res = await fetch(`${API_BASE}/people/${id}/detail`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<PersonDetail>(res);
  },

  async getProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<Project[]>(res);
  },

  async createProject(data: {
    name: string;
    code?: string;
    description: string;
    status?: string;
    progress?: number;
    team_id?: string;
    project_lead_id?: string;
  }): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse<Project>(res);
  },

  async getWorkRecords(): Promise<WorkRecord[]> {
    const res = await fetch(`${API_BASE}/work-records`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<WorkRecord[]>(res);
  },

  async getContributions(filters?: { projectId?: string; personId?: string; teamId?: string }): Promise<Contribution[]> {
    const params = new URLSearchParams();
    if (filters?.projectId) params.set('project_id', filters.projectId);
    if (filters?.personId) params.set('person_id', filters.personId);
    if (filters?.teamId) params.set('team_id', filters.teamId);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/contributions${query}`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<Contribution[]>(res);
  },

  async createContribution(data: {
    person_id: string;
    project_id: string;
    title: string;
    contribution_type: string;
    problem_solved: string;
    technical_decision: string;
    outcome: string;
    technology?: string;
    artifact_reference?: string;
    collaborators?: string;
  }): Promise<{ id: string; status: string }> {
    const res = await fetch(`${API_BASE}/contributions`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async createWorkRecord(data: {
    project_id: string;
    title: string;
    summary: string;
    problem_statement: string;
    technical_decision: string;
    outcome: string;
    technology?: string;
    artifact_url?: string;
  }): Promise<{ id: string; status: string; title?: string }> {
    const res = await fetch(`${API_BASE}/work-records`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Hindsight Cloud AI Memory
  async getHindsightHealth(): Promise<HindsightCloudHealth> {
    const res = await fetch(`${API_BASE}/hindsight/health`, {
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    return handleResponse<HindsightCloudHealth>(res);
  },

  async askHindsight(query: string): Promise<HindsightAskResult> {
    const res = await fetch(`${API_BASE}/hindsight/ask`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ query }),
    });
    return handleResponse<HindsightAskResult>(res);
  },

  async reflectHindsight(query: string): Promise<{ reflection: string | null; cloud_connected: boolean; bank_id?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/hindsight/reflect`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ query }),
    });
    return handleResponse(res);
  },

  async demonstrateLearningLoop(topic?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/hindsight/learning-loop`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ topic }),
    });
    return handleResponse(res);
  },

  async seedHindsight(): Promise<{ status: string; seeded_count: number }> {
    const res = await fetch(`${API_BASE}/hindsight/seed`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
    });
    return handleResponse(res);
  },

  // Project Architect Agent (Phase 5)
  async planProjectArchitect(prompt: string, options?: any): Promise<ProjectArchitectBlueprint> {
    const res = await fetch(`${API_BASE}/architect/plan`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ prompt, options }),
    });
    return handleResponse<ProjectArchitectBlueprint>(res);
  },

  async retainProjectBlueprint(blueprint: ProjectArchitectBlueprint, projectName?: string): Promise<{ status: string; message: string; result: any }> {
    const res = await fetch(`${API_BASE}/architect/retain-blueprint`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      credentials: 'include',
      body: JSON.stringify({ blueprint, project_name: projectName }),
    });
    return handleResponse(res);
  },

  async getProjectArchitectState(): Promise<ProjectArchitectState> {
    const res = await fetch(`${API_BASE}/architect/state`, {
      headers: getAuthHeaders(),
      credentials: 'include',
    });
    return handleResponse<ProjectArchitectState>(res);
  },
};
