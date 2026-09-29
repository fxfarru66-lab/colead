import React, { useState, useEffect } from 'react';
import { PageId, UserSession, Team } from './types';
import { apiService } from './services/api';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SignInPage } from './pages/SignInPage';
import { TwoFactorPage } from './pages/TwoFactorPage';
import { CreateFirstTeamPage } from './pages/CreateFirstTeamPage';
import { TeamsPage } from './pages/TeamsPage';
import { TeamOrbitalView } from './components/TeamOrbitalView';
import { FindPeoplePage } from './pages/FindPeoplePage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkMemoryPage } from './pages/WorkMemoryPage';
import { ContributionsPage } from './pages/ContributionsPage';
import { AskOrgPage } from './pages/AskOrgPage';
import { NewWorkPage } from './pages/NewWorkPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrganizationPage } from './pages/OrganizationPage';
import { PersonProfilePage } from './pages/PersonProfilePage';

function getPageFromPath(path: string): PageId {
  const clean = path.replace(/\/+$/, '') || '/';
  if (clean === '/login' || clean === '/signin') return 'signin';
  if (clean === '/verify-2fa') return 'verify-2fa';
  if (clean === '/profile') return 'profile';
  if (clean === '/organization') return 'organization';
  if (clean === '/teams') return 'teams';
  if (clean === '/people') return 'people';
  if (clean.startsWith('/people/')) return 'person-profile';
  if (clean === '/work-memory' || clean === '/past-work') return 'work-memory';
  if (clean === '/contributions' || clean === '/who-did-what') return 'contributions';
  if (clean === '/ask-organization' || clean === '/ask') return 'ask';
  if (clean === '/new-work') return 'new-work';
  if (clean === '/create-team') return 'create-first-team';
  return 'dashboard';
}

function getPathFromPage(page: PageId, personId?: string): string {
  switch (page) {
    case 'signin': return '/login';
    case 'verify-2fa': return '/verify-2fa';
    case 'profile': return '/profile';
    case 'organization': return '/organization';
    case 'teams': return '/teams';
    case 'team-orbit': return '/teams';
    case 'people': return '/people';
    case 'person-profile': return personId ? `/people/${personId}` : '/people';
    case 'work-memory': return '/past-work';
    case 'contributions': return '/who-did-what';
    case 'ask': return '/ask-organization';
    case 'new-work': return '/new-work';
    case 'create-first-team': return '/create-team';
    case 'dashboard':
    default:
      return '/dashboard';
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [previousPage, setPreviousPage] = useState<PageId>('dashboard');

  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingOrg, setPendingOrg] = useState('');

  // Active Team for Orbital View
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);

  // Active Person for Dedicated Profile View
  const [activePersonId, setActivePersonId] = useState<string>('person_priya');

  // Search query carried over to Ask Org
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Initial Session Check on Server
  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const sessionRes = await apiService.checkSession();
        if (!isMounted) return;

        if (sessionRes.authenticated && sessionRes.user) {
          setCurrentUser(sessionRes.user);
          const targetPage = getPageFromPath(window.location.pathname);
          if (targetPage === 'signin' || targetPage === 'verify-2fa') {
            setCurrentPage('dashboard');
            window.history.replaceState(null, '', '/dashboard');
          } else {
            setCurrentPage(targetPage);
          }
        } else {
          // Unauthenticated: Protected Routes Enforcement
          setCurrentUser(null);
          setCurrentPage('signin');
          if (window.location.pathname !== '/login' && window.location.pathname !== '/signin' && window.location.pathname !== '/verify-2fa') {
            window.history.replaceState(null, '', '/login');
          }
        }
      } catch {
        if (!isMounted) return;
        setCurrentUser(null);
        setCurrentPage('signin');
        window.history.replaceState(null, '', '/login');
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    initSession();

    // Browser back/forward navigation sync
    const handlePopState = () => {
      const page = getPageFromPath(window.location.pathname);
      setCurrentPage(page);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Preload team workspace for orbital readiness
  useEffect(() => {
    async function loadDefaultTeam() {
      try {
        const teams = await apiService.getTeams();
        if (teams.length > 0) {
          const productTeam = teams.find((t) => t.id === 'team_product') || teams[0];
          const fullWorkspace = await apiService.getTeamWorkspace(productTeam.id);
          setActiveTeam(fullWorkspace || productTeam);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (currentUser) {
      loadDefaultTeam();
    }
  }, [currentUser]);

  // Unified Route Navigator with browser URL update & auth guard
  const navigateTo = (page: PageId, personId?: string, userOverride?: UserSession | null) => {
    const user = userOverride !== undefined ? userOverride : currentUser;
    if (!user && page !== 'signin' && page !== 'verify-2fa') {
      setCurrentPage('signin');
      window.history.pushState(null, '', '/login');
      return;
    }

    setPreviousPage(currentPage);
    setCurrentPage(page);
    if (personId) {
      setActivePersonId(personId);
    }
    const newPath = getPathFromPage(page, personId || activePersonId);
    window.history.pushState(null, '', newPath);
  };

  const handleOpenPersonProfile = (personId: string) => {
    setActivePersonId(personId);
    navigateTo('person-profile', personId);
  };

  const handleSignInSuccess = (user: UserSession, requires2FA?: boolean, email?: string, orgName?: string) => {
    if (requires2FA) {
      setPendingEmail(email || user.email);
      setPendingOrg(orgName || user.organization);
      navigateTo('verify-2fa', undefined, user);
    } else {
      setCurrentUser(user);
      // Section 2: Always land on Overview (dashboard) after login
      navigateTo('dashboard', undefined, user);
    }
  };

  const handle2FAVerifySuccess = (user: UserSession) => {
    setCurrentUser(user);
    // Section 2: Always land on Overview (dashboard)
    navigateTo('dashboard', undefined, user);
  };

  const handleSignOut = async () => {
    try {
      await apiService.signOut();
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    navigateTo('signin', undefined, null);
  };

  const handleSelectTeam = async (team: Team) => {
    try {
      const full = await apiService.getTeamWorkspace(team.id);
      setActiveTeam(full || team);
    } catch {
      setActiveTeam(team);
    }
    navigateTo('team-orbit');
  };

  const handleTeamCreated = (newTeam: Team) => {
    setActiveTeam(newTeam);
    navigateTo('teams');
  };

  // Loading Screen: Minimal polished CoLead restoring state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F0E9] flex flex-col items-center justify-center space-y-4 text-[#342F2A]">
        <div className="font-heading text-3xl font-extrabold text-[#342F2A] tracking-tight">CoLead</div>
        <div className="w-7 h-7 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266] uppercase tracking-wider">Restoring your workspace...</span>
      </div>
    );
  }

  // Protected Route Check: Unauthenticated users MUST see Login or 2FA
  if (!currentUser) {
    if (currentPage === 'verify-2fa') {
      return (
        <ErrorBoundary>
          <TwoFactorPage
            email={pendingEmail}
            organization={pendingOrg}
            onVerifySuccess={handle2FAVerifySuccess}
            onBackToSignIn={() => navigateTo('signin', undefined, null)}
          />
        </ErrorBoundary>
      );
    }

    return (
      <ErrorBoundary>
        <SignInPage
          onSignInSuccess={handleSignInSuccess}
          onBypassToApp={async () => {
            try {
              const res = await apiService.signIn({
                email: 'sarah.kim@company.com',
                password: 'renew',
              });
              setCurrentUser(res.user);
              navigateTo('dashboard', undefined, res.user);
            } catch {
              const fallbackUser: UserSession = {
                id: 'usr_sarah',
                name: 'Sarah Kim',
                email: 'sarah.kim@company.com',
                role: 'Lead Product Manager',
                organization: 'CO-LEAD',
                organization_id: 'org_colead',
                avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
                is_creator: true,
              };
              setCurrentUser(fallbackUser);
              navigateTo('dashboard', undefined, fallbackUser);
            }
          }}
        />
      </ErrorBoundary>
    );
  }

  // Authenticated: Resolve target page cleanly (avoid blank if currentPage was 'signin')
  const activePage: PageId = (currentPage === 'signin' || currentPage === 'verify-2fa')
    ? 'dashboard'
    : currentPage;

  // Authenticated Application Shell
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F3F0E9] text-[#342F2A] flex flex-col font-sans selection:bg-[#B8A48D] selection:text-[#342F2A]">
        {/* Persistent Global Top Navigation */}
        <Navigation
          currentPage={activePage}
          onNavigate={navigateTo}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* Main Page Area with 3D Page Entrance */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 perspective-1200">
          <ErrorBoundary>
            {/* Screen: My Profile (/profile) */}
            {activePage === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                onProfileUpdated={(updatedUser) => setCurrentUser(updatedUser)}
              />
            )}

            {/* Screen: Organization (/organization) */}
            {activePage === 'organization' && (
              <OrganizationPage
                currentUser={currentUser}
                onOpenPersonProfile={handleOpenPersonProfile}
              />
            )}

            {/* Screen 2: Create First Team */}
            {activePage === 'create-first-team' && (
              <CreateFirstTeamPage
                onBack={() => navigateTo('teams')}
                onTeamCreated={handleTeamCreated}
              />
            )}

            {/* Screen 3: Teams Page (Horizontal Scrollable) */}
            {activePage === 'teams' && (
              <TeamsPage
                onSelectTeam={handleSelectTeam}
                onOpenCreateTeam={() => navigateTo('create-first-team')}
              />
            )}

            {/* Screen 4: Team Orbital View */}
            {activePage === 'team-orbit' && activeTeam && (
              <TeamOrbitalView
                team={activeTeam}
                onBackToTeams={() => navigateTo('teams')}
                onSelectMember={handleOpenPersonProfile}
              />
            )}

            {/* Screen 6: Find People */}
            {activePage === 'people' && (
              <FindPeoplePage
                onOpenPersonProfile={handleOpenPersonProfile}
              />
            )}

            {/* Dedicated Contributor Profile View */}
            {activePage === 'person-profile' && (
              <PersonProfilePage
                personId={activePersonId}
                onBack={() => navigateTo(previousPage === 'person-profile' ? 'people' : previousPage)}
                onSelectProject={(_pId) => navigateTo('work-memory')}
              />
            )}

            {/* Screen 7: Overview (Dashboard - default and fallback) */}
            {(activePage === 'dashboard' || (![
              'profile', 'organization', 'create-first-team', 'teams', 'team-orbit',
              'people', 'person-profile', 'work-memory', 'contributions', 'ask', 'new-work'
            ].includes(activePage))) && (
              <DashboardPage
                onNavigate={navigateTo}
                onSearchQuery={(q) => {
                  setSearchQuery(q);
                  navigateTo('ask');
                }}
                onOpenPersonProfile={handleOpenPersonProfile}
              />
            )}

            {/* Screen 8: Past Work */}
            {activePage === 'work-memory' && (
              <WorkMemoryPage
                onOpenPersonProfile={handleOpenPersonProfile}
              />
            )}

            {/* Screen 9: Who Did What */}
            {activePage === 'contributions' && (
              <ContributionsPage
                onOpenPersonDetail={handleOpenPersonProfile}
              />
            )}

            {/* Screen 10: Ask CoLead */}
            {activePage === 'ask' && (
              <AskOrgPage
                initialQuery={searchQuery}
                onOpenPersonDetail={handleOpenPersonProfile}
              />
            )}

            {/* Screen 11: New Work */}
            {activePage === 'new-work' && (
              <NewWorkPage onNavigate={navigateTo} />
            )}
          </ErrorBoundary>
        </main>

        {/* Persistent Warm Editorial Footer */}
        <footer className="border-t border-[#B8A48D]/30 bg-[#E8DED2] py-8 text-xs text-[#5B5045] mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-heading font-extrabold text-[#342F2A] tracking-wider text-base">
                CoLead
              </span>
              <span aria-hidden="true" className="text-[#B8A48D]">·</span>
              <span className="text-[#7E7266] font-medium">Organizational Experience Intelligence</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5B5045]">
              <span>Capture</span>
              <span>→</span>
              <span>Connect</span>
              <span>→</span>
              <span>Build</span>
              <span>→</span>
              <span className="font-bold text-[#342F2A]">Remember</span>
            </div>

            <div className="text-[11px] text-[#7E7266] font-serif italic">
              Better teams. Greater knowledge. Lasting impact.
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
