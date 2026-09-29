/**
 * Curated high-resolution realistic product & project imagery
 * Communicates the actual domain of work before reading text:
 * - Mobile app -> realistic smartphone product UI
 * - Payment gateway -> realistic checkout & payment technology
 * - Design system -> realistic design token library / UI system
 * - Cloud infrastructure -> realistic multi-region server cluster
 */

export interface ProjectVisualInfo {
  imageUrl: string;
  category: string;
  tag: string;
}

export const PROJECT_VISUALS: Record<string, ProjectVisualInfo> = {
  proj_mobile_redesign: {
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&auto=format&fit=crop&q=80',
    category: 'Mobile Application',
    tag: 'iOS & Android Onboarding',
  },
  proj_payment_gateway: {
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1000&auto=format&fit=crop&q=80',
    category: 'Payment Infrastructure',
    tag: 'Multi-Processor Broker',
  },
  proj_design_tokens: {
    imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1000&auto=format&fit=crop&q=80',
    category: 'Design Systems',
    tag: 'Figma Tokens & WCAG AA',
  },
  proj_cloud_infra: {
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
    category: 'Cloud Architecture',
    tag: 'Multi-Region Failover',
  },
  proj_auth_modernization: {
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1000&auto=format&fit=crop&q=80',
    category: 'Security & Identity',
    tag: 'SSO & OAuth 2.0 PKCE',
  },
  proj_search_indexer: {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80',
    category: 'Data Platform',
    tag: 'Real-Time Event Indexing',
  },
};

export function getProjectVisual(projectId?: string, projectName?: string): string {
  if (projectId && PROJECT_VISUALS[projectId]) {
    return PROJECT_VISUALS[projectId].imageUrl;
  }

  const nameLower = (projectName || '').toLowerCase();
  if (nameLower.includes('auth') || nameLower.includes('security') || nameLower.includes('sso')) {
    return PROJECT_VISUALS.proj_auth_modernization.imageUrl;
  }
  if (nameLower.includes('search') || nameLower.includes('index') || nameLower.includes('data')) {
    return PROJECT_VISUALS.proj_search_indexer.imageUrl;
  }
  if (nameLower.includes('mobile') || nameLower.includes('app') || nameLower.includes('ios')) {
    return PROJECT_VISUALS.proj_mobile_redesign.imageUrl;
  }
  if (nameLower.includes('pay') || nameLower.includes('checkout') || nameLower.includes('billing')) {
    return PROJECT_VISUALS.proj_payment_gateway.imageUrl;
  }
  if (nameLower.includes('token') || nameLower.includes('design') || nameLower.includes('ui') || nameLower.includes('figma')) {
    return PROJECT_VISUALS.proj_design_tokens.imageUrl;
  }
  if (nameLower.includes('cloud') || nameLower.includes('infra') || nameLower.includes('failover') || nameLower.includes('backend')) {
    return PROJECT_VISUALS.proj_cloud_infra.imageUrl;
  }

  // Tasteful default enterprise product visual
  return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80';
}
