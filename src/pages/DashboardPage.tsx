import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  FolderKanban,
  Building,
  BrainCircuit,
  Search,
  BookOpen,
  History,
  Layers,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { apiService } from '../services/api';
import { Stats, Project, Contribution, PageId, Person } from '../types';
import { getProjectVisual } from '../utils/projectVisuals';
import { ScrollReveal, AnimatedCounter, KineticText } from '../components/ScrollReveal';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onSearchQuery?: (q: string) => void;
  onOpenPersonProfile?: (personId: string) => void;
  onSelectProjectDetail?: (project: Project) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenPersonProfile,
  onSelectProjectDetail,
}) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLearningModal, setSelectedLearningModal] = useState<{
    title: string;
    learning: string;
    learnedFrom: string;
    details: string;
    projectId?: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [statsData, projsData, peopleData] = await Promise.all([
          apiService.getStats(),
          apiService.getProjects(),
          apiService.getPeople(),
        ]);
        setStats(statsData);
        setProjects(projsData);
        setPeople(peopleData);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const recentProjects = projects.slice(0, 3);
  const keyContributors = people.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266]">Loading Overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-20 py-4 text-[#342F2A]">
      {/* =========================================================================
          1. CINEMATIC HERO SECTION: Blurred Background Layer + Kinetic Text
         ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-[#B8A48D]/50 text-[#342F2A] shadow-md p-8 sm:p-12 lg:p-16 bg-transparent">
        {/* Subtle Ambient Accent Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* CoLead Logo Mark */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 shadow-lg border border-emerald-400/30">
              <svg className="w-7 h-7 text-emerald-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" className="opacity-20" />
                <path d="M12 3a9 9 0 0 1 9 9" className="text-emerald-300" />
                <path d="M12 21a9 9 0 0 1-9-9" />
                <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" fill="currentColor" className="text-emerald-400" />
              </svg>
            </div>
            <span className="font-heading text-2xl font-black tracking-tight text-[#342F2A] flex items-center gap-1.5">
              Co<span className="text-emerald-700">Lead</span>
            </span>
          </div>

          <KineticText
            tagline="Organizational Memory & Experience Intelligence"
            text="CoLead helps organizations remember what they learned from previous work and use that experience in future projects."
            className="text-balance"
          />

          <ScrollReveal direction="up" delay={300}>
            <p className="text-base sm:text-lg text-[#5B5045] max-w-2xl mx-auto font-normal leading-relaxed text-balance">
              Work → Memory → Learning → Better Work. CoLead turns past engineering outcomes into searchable institutional intelligence.
            </p>
          </ScrollReveal>

          {/* Quick Ask CoLead Bar */}
          <ScrollReveal direction="up" delay={400} className="pt-2 max-w-xl mx-auto">
            <button
              onClick={() => onNavigate('ask')}
              className="w-full h-14 px-5 rounded-2xl border border-[#B8A48D]/60 bg-[#FBF9F5] hover:bg-white text-xs text-[#342F2A] flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <span className="flex items-center gap-3">
                <Search className="h-4 w-4 text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                <span className="font-medium text-sm text-[#5B5045]">Ask what your organization already knows...</span>
              </span>
              <span className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
                Ask CoLead →
              </span>
            </button>
          </ScrollReveal>
        </div>
      </div>

      {/* =========================================================================
          2. STATS OVERVIEW: Animated Count-Up Counters
         ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ScrollReveal direction="up" delay={100}>
          <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 text-center space-y-1 shadow-xs card-3d">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
              <AnimatedCounter end={stats?.projects || projects.length || 4} />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#5B5045] font-semibold">
              Projects
            </div>
            <p className="text-[11px] text-[#7E7266] pt-0.5">Documented initiatives</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200}>
          <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 text-center space-y-1 shadow-xs card-3d">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
              <AnimatedCounter end={stats?.total_contributions || 8} />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#5B5045] font-semibold">
              Contributions
            </div>
            <p className="text-[11px] text-[#7E7266] pt-0.5">Attributed engineering records</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={300}>
          <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 text-center space-y-1 shadow-xs card-3d">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
              <AnimatedCounter end={stats?.teams || 3} />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#5B5045] font-semibold">
              Teams
            </div>
            <p className="text-[11px] text-[#7E7266] pt-0.5">Connected workspaces</p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={400}>
          <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 text-center space-y-1 shadow-xs card-3d">
            <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
              <AnimatedCounter end={stats?.people || people.length || 6} />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#5B5045] font-semibold">
              Contributors
            </div>
            <p className="text-[11px] text-[#7E7266] pt-0.5">Domain practitioners</p>
          </div>
        </ScrollReveal>
      </div>

      {/* =========================================================================
          3. EDITORIAL SECTION: RECENT WORK (Alternating Image / Data Layouts)
         ========================================================================= */}
      <div className="space-y-8">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex items-center justify-between border-b border-[#B8A48D]/35 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E7266] font-bold block mb-0.5">
                Portfolio of Experience
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#342F2A]">
                Recent Work
              </h2>
            </div>
            <button
              onClick={() => onNavigate('work-memory')}
              className="text-xs font-semibold text-[#342F2A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all past work</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {recentProjects.map((project, index) => {
            const visual = getProjectVisual(project.id, project.name);
            const isEven = index % 2 === 0;

            return (
              <ScrollReveal
                key={project.id}
                direction="up"
                delay={index * 120}
                duration={600}
                blur={true}
              >
                <div
                  onClick={() => onNavigate('work-memory')}
                  className={`rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] overflow-hidden shadow-sm hover:border-[#342F2A] hover:shadow-xl transition-all duration-300 card-3d cursor-pointer group flex flex-col ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Visual Image Side */}
                  <div className="relative md:w-5/12 h-60 md:h-auto min-h-[240px] overflow-hidden bg-[#E8DED2] shrink-0">
                    <img
                      src={visual}
                      alt={project.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/20">
                      {project.code}
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#5B5045]">
                        <span className="font-bold text-[#342F2A]">{project.team_name || 'Engineering'}</span>
                        <span>·</span>
                        <span>{project.contributor_count || 4} contributors</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-bold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                          {project.status}
                        </span>
                      </div>

                      <h3 className="font-heading text-2xl font-bold text-[#342F2A] group-hover:text-amber-800 transition-colors">
                        {project.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#5B5045] leading-relaxed font-light line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#B8A48D]/25 flex items-center justify-between text-xs">
                      <span className="text-[#7E7266] font-mono text-[11px] flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5 text-amber-700" />
                        Verified institutional memory record
                      </span>
                      <span className="font-bold text-[#342F2A] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Project Details →
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          4. SECTION: WHAT WE LEARNED (Retained Wisdom Cards with Glass Depth)
         ========================================================================= */}
      <div className="space-y-6">
        <ScrollReveal direction="up" delay={50}>
          <div className="border-b border-[#B8A48D]/35 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E7266] font-bold block mb-0.5">
              Retained Wisdom
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#342F2A]">
              What We Learned
            </h2>
            <p className="text-xs text-[#5B5045] font-light mt-0.5">
              Key takeaways captured from past problem-solving, preserving future organizational velocity.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <ScrollReveal direction="up" delay={100}>
            <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-4 flex flex-col justify-between hover:border-[#342F2A]/60 transition-all shadow-xs hover:shadow-lg card-3d h-full">
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E7266] font-bold block">
                  Payment Integration
                </span>
                <p className="font-heading text-base font-bold text-[#342F2A] leading-snug">
                  "We learned that retry handling is critical when external payment services become slow."
                </p>
              </div>
              <div className="pt-4 border-t border-[#B8A48D]/30 flex items-center justify-between text-xs">
                <div className="text-[11px] text-[#5B5045]">
                  <span className="text-[10px] text-[#7E7266] block font-mono">Learned from:</span>
                  <span className="font-semibold text-[#342F2A]">Daniel Ortiz + Engineering</span>
                </div>
                <button
                  onClick={() =>
                    setSelectedLearningModal({
                      title: 'Payment Integration',
                      learning: 'We learned that retry handling is critical when external payment services become slow.',
                      learnedFrom: 'Daniel Ortiz + Engineering',
                      details: 'During peak traffic periods, external payment gateways experience intermittent latency spikes. By engineering an asynchronous retry broker with exponential backoff and Redis mutex locking, we avoided worker thread starvation and eliminated double-charge debit anomalies.',
                      projectId: 'proj_payment_gateway',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#E8DED2] hover:bg-[#342F2A] hover:text-[#F3F0E9] text-xs font-semibold text-[#342F2A] transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal direction="up" delay={200}>
            <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-4 flex flex-col justify-between hover:border-[#342F2A]/60 transition-all shadow-xs hover:shadow-lg card-3d h-full">
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E7266] font-bold block">
                  Mobile Onboarding
                </span>
                <p className="font-heading text-base font-bold text-[#342F2A] leading-snug">
                  "User research proved that the initial onboarding flow had too many upfront steps."
                </p>
              </div>
              <div className="pt-4 border-t border-[#B8A48D]/30 flex items-center justify-between text-xs">
                <div className="text-[11px] text-[#5B5045]">
                  <span className="text-[10px] text-[#7E7266] block font-mono">Learned from:</span>
                  <span className="font-semibold text-[#342F2A]">Priya Sharma + Product</span>
                </div>
                <button
                  onClick={() =>
                    setSelectedLearningModal({
                      title: 'Mobile Onboarding',
                      learning: 'User research proved that the initial onboarding flow had too many upfront steps.',
                      learnedFrom: 'Priya Sharma + Product',
                      details: 'User testing revealed that asking for profile setup upfront caused a 34% drop-off. By switching to progressive onboarding—letting members create their first work record before asking for organization settings—completion jumped to 89%.',
                      projectId: 'proj_mobile_redesign',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#E8DED2] hover:bg-[#342F2A] hover:text-[#F3F0E9] text-xs font-semibold text-[#342F2A] transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal direction="up" delay={300}>
            <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-4 flex flex-col justify-between hover:border-[#342F2A]/60 transition-all shadow-xs hover:shadow-lg card-3d h-full">
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E7266] font-bold block">
                  Design System &amp; Accessibility
                </span>
                <p className="font-heading text-base font-bold text-[#342F2A] leading-snug">
                  "Standardizing 24 accessible tokens prevented WCAG contrast regressions across platforms."
                </p>
              </div>
              <div className="pt-4 border-t border-[#B8A48D]/30 flex items-center justify-between text-xs">
                <div className="text-[11px] text-[#5B5045]">
                  <span className="text-[10px] text-[#7E7266] block font-mono">Learned from:</span>
                  <span className="font-semibold text-[#342F2A]">Priya Sharma + Design</span>
                </div>
                <button
                  onClick={() =>
                    setSelectedLearningModal({
                      title: 'Design System & Tokens',
                      learning: 'Standardizing 24 accessible tokens prevented WCAG contrast regressions across platforms.',
                      learnedFrom: 'Priya Sharma + Design',
                      details: 'Creating unified semantic design tokens in Figma and syncing them automatically via GitHub Action saved an estimated 120 engineering hours per quarter and achieved 100% WCAG AA compliance.',
                      projectId: 'proj_design_tokens',
                    })
                  }
                  className="px-3 py-1.5 rounded-xl bg-[#E8DED2] hover:bg-[#342F2A] hover:text-[#F3F0E9] text-xs font-semibold text-[#342F2A] transition-colors cursor-pointer"
                >
                  Details
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* =========================================================================
          5. SECTION: PEOPLE BEHIND THE WORK (Profile Cards)
         ========================================================================= */}
      <div className="space-y-6">
        <ScrollReveal direction="up" delay={50}>
          <div className="flex items-center justify-between border-b border-[#B8A48D]/35 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E7266] font-bold block mb-0.5">
                Contributor Attribution
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#342F2A]">
                People Behind the Work
              </h2>
              <p className="text-xs text-[#5B5045] font-light mt-0.5">
                Click any contributor to view their documented project history and evidence.
              </p>
            </div>
            <button
              onClick={() => onNavigate('people')}
              className="text-xs font-semibold text-[#342F2A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all people</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {keyContributors.map((p, idx) => {
            const contributionHighlight =
              p.id === 'person_priya'
                ? 'Mobile onboarding UX'
                : p.id === 'person_daniel'
                ? 'Payment retry broker'
                : p.id === 'person_alex'
                ? 'Component library'
                : 'Project roadmap delivery';

            return (
              <ScrollReveal key={p.id} direction="up" delay={idx * 100}>
                <button
                  onClick={() => onOpenPersonProfile && onOpenPersonProfile(p.id)}
                  className="w-full rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 text-center flex flex-col items-center space-y-3 hover:border-[#342F2A] shadow-xs hover:shadow-md transition-all card-3d group cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#B8A48D] group-hover:scale-105 transition-transform duration-200 shadow-sm">
                    <img
                      src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-heading text-sm font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[#7E7266] font-medium">
                      {p.role}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#B8A48D]/30 w-full text-[10px] text-[#5B5045] font-mono truncate">
                    "{contributionHighlight}"
                  </div>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Modal for Retained Organizational Memory Detail */}
      {selectedLearningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-[#B8A48D] bg-[#FBF9F5] p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#B8A48D]/30 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E7266] font-bold">
                  Retained Organizational Memory
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#342F2A] mt-0.5">
                  {selectedLearningModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLearningModal(null)}
                className="text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] p-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8DED2]/60 border border-[#B8A48D]/50 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-[#5B5045]">
                Core Lesson Learned
              </span>
              <p className="font-heading text-base font-bold text-[#342F2A] leading-snug">
                "{selectedLearningModal.learning}"
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase font-bold text-[#7E7266]">
                Context &amp; Practical Application
              </span>
              <p className="text-[#5B5045] leading-relaxed bg-[#F3F0E9] p-4 rounded-2xl border border-[#B8A48D]/30">
                {selectedLearningModal.details}
              </p>
            </div>

            <div className="pt-2 border-t border-[#B8A48D]/30 flex items-center justify-between text-xs">
              <div className="text-[11px] text-[#5B5045]">
                <span className="text-[10px] text-[#7E7266] block font-mono">Preserved from:</span>
                <span className="font-semibold text-[#342F2A]">{selectedLearningModal.learnedFrom}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedLearningModal(null);
                  onNavigate('work-memory');
                }}
                className="px-4 py-2 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] font-semibold text-xs transition-colors cursor-pointer"
              >
                View in Past Work
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
