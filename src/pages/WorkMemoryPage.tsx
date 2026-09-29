import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { WorkRecord, Project, Contribution } from '../types';
import { getProjectVisual } from '../utils/projectVisuals';
import {
  Search,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Layers,
  ChevronRight
} from 'lucide-react';

interface WorkMemoryPageProps {
  onOpenPersonProfile?: (personId: string) => void;
}

export const WorkMemoryPage: React.FC<WorkMemoryPageProps> = ({
  onOpenPersonProfile,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [projs, contribs] = await Promise.all([
          apiService.getProjects(),
          apiService.getContributions(),
        ]);
        setProjects(projs);
        setContributions(contribs);
      } catch (err: any) {
        console.error('Failed to load past work:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectContributions = selectedProject
    ? contributions.filter((c) => c.project_id === selectedProject.id)
    : [];

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.team_name && p.team_name.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266]">Loading Past Work...</span>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED PROJECT DETAIL VIEW (Section 7: Image Left, Data Right)
  // =========================================================================
  if (selectedProject) {
    const projectImg = getProjectVisual(selectedProject.id, selectedProject.name);
    const topContributors = projectContributions.slice(0, 4);

    return (
      <div className="space-y-12 py-4 animate-page-enter text-[#342F2A]">
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-4">
          <button
            onClick={() => setSelectedProjectId(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] transition-colors bg-[#E8DED2]/80 hover:bg-[#E8DED2] px-4 py-2 rounded-xl border border-[#B8A48D]/40 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Past Work</span>
          </button>
          <span className="text-[11px] font-mono text-[#7E7266] uppercase font-bold">
            {selectedProject.code} · {selectedProject.team_name || 'Engineering'}
          </span>
        </div>

        {/* Hero Section: Image Left, Data Right (Section 7) */}
        <div className="rounded-3xl border border-[#B8A48D]/60 bg-[#FBF9F5] overflow-hidden shadow-md card-3d flex flex-col lg:flex-row">
          {/* LEFT: Large Project Image */}
          <div className="lg:w-1/2 min-h-[300px] lg:min-h-[400px] relative overflow-hidden bg-[#E8DED2]">
            <img
              src={projectImg}
              alt={selectedProject.name}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md">
              {selectedProject.code}
            </div>
          </div>

          {/* RIGHT: Project Information (Section 7) */}
          <div className="lg:w-1/2 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-[#E8DED2] text-[#342F2A] font-bold uppercase border border-[#B8A48D]/50">
                  {selectedProject.team_name || 'ENGINEERING'}
                </span>
                <span className="text-[#5B5045]">
                  {projectContributions.length || selectedProject.contributor_count || 4} Contributors
                </span>
                <span className="text-emerald-700 font-semibold">· {selectedProject.status}</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#342F2A]">
                {selectedProject.name}
              </h1>

              <p className="text-sm sm:text-base text-[#5B5045] font-light leading-relaxed">
                {selectedProject.description}
              </p>
            </div>

            {/* Outcome Highlight */}
            <div className="p-4 rounded-2xl bg-[#E8DED2]/50 border border-[#B8A48D]/40 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[#7E7266]">
                Delivered Outcome
              </span>
              <p className="text-xs text-[#342F2A] font-semibold leading-relaxed">
                {projectContributions[0]?.outcome ||
                  'Successfully delivered with complete test coverage, documented architecture, and zero regressions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Semicircle / Key Contributors Section */}
        {topContributors.length > 0 && (
          <div className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold">
                  Core Contributor Team
                </span>
                <h3 className="font-heading text-xl font-bold text-[#342F2A]">
                  Key People on this Project
                </h3>
              </div>
              <span className="text-xs text-[#5B5045] font-mono">
                {topContributors.length} Primary Contributors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topContributors.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onOpenPersonProfile && onOpenPersonProfile(c.person_id)}
                  className="p-5 rounded-2xl bg-[#E8DED2]/40 border border-[#B8A48D]/40 hover:border-[#342F2A] hover:bg-[#E8DED2] transition-all cursor-pointer space-y-3 group card-3d"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.person_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                      alt={c.person_name}
                      className="w-11 h-11 rounded-full object-cover border border-[#B8A48D] group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#342F2A] group-hover:underline truncate">
                        {c.person_name}
                      </div>
                      <div className="text-[11px] text-[#5B5045] truncate">{c.person_role}</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5B5045] line-clamp-2 leading-tight font-light border-t border-[#B8A48D]/30 pt-2">
                    "{c.title}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Structured Sections: Problem → Contributions → Outcome → Lessons (Section 7) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. PROBLEM */}
          <div className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 space-y-3 shadow-xs card-3d">
            <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold tracking-wider">
              01. The Problem
            </span>
            <h4 className="font-heading text-lg font-bold text-[#342F2A]">Challenge &amp; Context</h4>
            <p className="text-xs text-[#5B5045] leading-relaxed font-light">
              {projectContributions[0]?.problem_solved ||
                'Required eliminating legacy blockers and improving user reliability across core organizational touchpoints.'}
            </p>
          </div>

          {/* 2. CONTRIBUTIONS */}
          <div className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 space-y-3 shadow-xs card-3d">
            <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold tracking-wider">
              02. Technical Decisions
            </span>
            <h4 className="font-heading text-lg font-bold text-[#342F2A]">Who Did What</h4>
            <p className="text-xs text-[#5B5045] leading-relaxed font-light">
              {projectContributions[0]?.technical_decision ||
                'Engineered full-stack architecture with modular components, standardized tokens, and resilient API contracts.'}
            </p>
          </div>

          {/* 3. OUTCOME */}
          <div className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 space-y-3 shadow-xs card-3d">
            <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold tracking-wider">
              03. Proven Outcome
            </span>
            <h4 className="font-heading text-lg font-bold text-[#342F2A]">Achieved Result</h4>
            <p className="text-xs text-[#342F2A] font-semibold leading-relaxed">
              {projectContributions[0]?.outcome ||
                'Successfully delivered on schedule with verified production metrics and zero regressions.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: HORIZONTAL PROJECT CARDS (Section 6: Large Visual Left, Data Right)
  // =========================================================================
  return (
    <div className="space-y-10 py-4 animate-page-enter text-[#342F2A]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B8A48D]/35 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase mb-1 font-semibold">
            <span>Portfolio of Experience</span>
            <span>·</span>
            <span>{projects.length} Preserved Projects</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#342F2A]">
            Past Work
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5B5045] font-light">
            Explore previous initiatives, problems solved, and organizational outcomes.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#7E7266] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past projects..."
            className="h-10 pl-10 pr-4 rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2]/60 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] w-64 font-medium transition-all"
          />
        </div>
      </div>

      {/* Horizontal Project Cards (Section 6) */}
      <div className="space-y-6">
        {filteredProjects.map((p) => {
          const projectImg = getProjectVisual(p.id, p.name);
          const pContribs = contributions.filter((c) => c.project_id === p.id);
          const problemText = pContribs[0]?.problem_solved || p.description;
          const outcomeText = pContribs[0]?.outcome || 'Verified and preserved in institutional memory.';

          return (
            <div
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] overflow-hidden flex flex-col md:flex-row card-3d cursor-pointer group shadow-xs hover:border-[#342F2A]"
            >
              {/* LARGE PROJECT IMAGE LEFT (Section 6) */}
              <div className="md:w-5/12 h-56 md:h-auto min-h-[220px] relative overflow-hidden bg-[#E8DED2] shrink-0">
                <img
                  src={projectImg}
                  alt={p.name}
                  className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
                    {p.team_name || 'ENGINEERING'}
                  </span>
                  <span className="text-[11px] font-medium drop-shadow-sm">
                    {pContribs.length || p.contributor_count || 4} Contributors
                  </span>
                </div>
              </div>

              {/* PROJECT DETAILS RIGHT (Section 6) */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-heading text-2xl font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors">
                    {p.name}
                  </h3>

                  {/* One short problem statement */}
                  <div className="text-xs text-[#5B5045] leading-relaxed font-light">
                    <strong className="font-semibold text-[#342F2A]">Problem:</strong> {problemText}
                  </div>

                  {/* One short outcome */}
                  <div className="text-xs text-[#342F2A] pt-1">
                    <strong className="font-semibold">Outcome:</strong> {outcomeText}
                  </div>
                </div>

                {/* View Project CTA */}
                <div className="pt-3 border-t border-[#B8A48D]/25 flex items-center justify-between text-xs font-semibold text-[#342F2A] group-hover:text-[#5B5045]">
                  <span>View Project Details</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
