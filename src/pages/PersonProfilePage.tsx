import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { PersonDetail, Contribution } from '../types';
import { getProjectVisual } from '../utils/projectVisuals';
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Layers,
  Sparkles,
  ShieldCheck,
  Target,
  FolderGit2,
  Code2,
  Compass
} from 'lucide-react';

interface PersonProfilePageProps {
  personId: string;
  onBack: () => void;
  onSelectProject?: (projectId: string) => void;
}

export const PersonProfilePage: React.FC<PersonProfilePageProps> = ({
  personId,
  onBack,
  onSelectProject,
}) => {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [activeMindmapNode, setActiveMindmapNode] = useState<{
    type: string;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await apiService.getPersonDetail(personId);
        setDetail(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load contributor details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [personId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266]">Loading Contributor Profile...</span>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <div className="text-sm text-red-800 bg-red-50 p-4 rounded-xl border border-red-200">
          {error || 'Contributor profile not found.'}
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#342F2A] text-[#F3F0E9] text-xs font-semibold cursor-pointer"
        >
          ← Return
        </button>
      </div>
    );
  }

  const { person, overview, contributions, projects, decisions } = detail;
  const heroProjectImage = projects[0]
    ? getProjectVisual(projects[0].id, projects[0].name)
    : getProjectVisual();

  const problemsSolvedCount = contributions.filter((c) => c.problem_solved).length;

  return (
    <div className="space-y-12 animate-page-enter pb-16 text-[#342F2A]">
      {/* Back navigation strip */}
      <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] transition-colors bg-[#E8DED2]/80 hover:bg-[#E8DED2] px-4 py-2 rounded-xl border border-[#B8A48D]/40 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E7266] font-bold">
          Contributor Profile · {person.team_name || 'Engineering'}
        </span>
      </div>

      {/* =========================================================================
          SECTION 9: PREMIUM REALISTIC HERO (Blurred Background + Foreground Cutout)
         ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-[#B8A48D]/60 shadow-xl bg-[#342F2A] min-h-[340px] flex items-end">
        {/* Large Blurred Project Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-110 opacity-40 pointer-events-none"
          style={{ backgroundImage: `url(${heroProjectImage})` }}
        />
        {/* Cinematic Soft Dark & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#231F1C] via-[#342F2A]/85 to-transparent pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 p-6 sm:p-10 w-full flex flex-col md:flex-row items-center md:items-end gap-8 text-[#F3F0E9]">
          {/* Foreground Profile Cutout */}
          <div className="relative shrink-0 person-cutout-hero">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-3 border-[#B8A48D] shadow-2xl bg-[#E8DED2]/30 backdrop-blur-md">
              <img
                src={person.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#342F2A] text-[#F3F0E9] border-2 border-[#B8A48D] shadow-md">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
          </div>

          {/* Right Side Adjacent Information (Section 9) */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                {person.name}
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-white/20 backdrop-blur-md text-[#F3F0E9] border border-white/30">
                {person.team_name || 'Core Contributor'}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#E8DED2] font-medium drop-shadow-sm">
              {person.title || person.role} · {person.department || 'Product & Technology'}
            </p>

            <p className="text-xs sm:text-sm text-[#E8DED2]/90 leading-relaxed max-w-2xl font-light drop-shadow-sm">
              {person.about || overview.about}
            </p>

            {/* Documented Skills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {(overview.skills || []).map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-black/40 backdrop-blur-md text-[#F3F0E9] border border-white/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 9: FACTUAL CONTRIBUTION ACTIVITY (No scores or ratings)
         ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-1 shadow-xs card-3d">
          <div className="text-[11px] font-mono text-[#7E7266] uppercase font-semibold">
            Projects Contributed To
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
            {projects.length}
          </div>
          <div className="text-[11px] text-[#5B5045]">Active initiative records</div>
        </div>

        <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-1 shadow-xs card-3d">
          <div className="text-[11px] font-mono text-[#7E7266] uppercase font-semibold">
            Documented Contributions
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
            {contributions.length}
          </div>
          <div className="text-[11px] text-[#5B5045]">Attributed engineering records</div>
        </div>

        <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-1 shadow-xs card-3d">
          <div className="text-[11px] font-mono text-[#7E7266] uppercase font-semibold">
            Problems Solved
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
            {problemsSolvedCount}
          </div>
          <div className="text-[11px] text-[#5B5045]">Documented solutions</div>
        </div>

        <div className="rounded-3xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-1 shadow-xs card-3d">
          <div className="text-[11px] font-mono text-[#7E7266] uppercase font-semibold">
            Decisions Contributed To
          </div>
          <div className="font-heading text-3xl sm:text-4xl font-extrabold text-[#342F2A]">
            {decisions.length}
          </div>
          <div className="text-[11px] text-[#5B5045]">Preserved architectural decisions</div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 10: RECENT CONTRIBUTIONS (PROJECT IMAGE LEFT, DATA RIGHT)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="border-b border-[#B8A48D]/30 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold">
              Documented Record
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-[#342F2A]">
              Recent Contributions
            </h2>
          </div>
          <span className="text-xs font-mono text-[#7E7266]">
            {contributions.length} Verified Records
          </span>
        </div>

        <div className="space-y-5">
          {contributions.map((cb) => {
            const projectImg = getProjectVisual(cb.project_id, cb.project_name);

            return (
              <div
                key={cb.id}
                className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] overflow-hidden flex flex-col md:flex-row card-3d shadow-xs hover:border-[#342F2A]"
              >
                {/* PROJECT IMAGE LEFT (Section 10) */}
                <div className="md:w-4/12 h-48 md:h-auto min-h-[180px] relative overflow-hidden bg-[#E8DED2] shrink-0">
                  <img
                    src={projectImg}
                    alt={cb.project_name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white text-xs font-mono font-bold">
                    {cb.project_name}
                  </div>
                </div>

                {/* DATA RIGHT (Section 10) */}
                <div className="p-6 md:p-7 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#342F2A] font-mono text-xs">
                        "{cb.title}"
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#E8DED2] text-[#5B5045] uppercase">
                        {cb.contribution_type}
                      </span>
                    </div>

                    <p className="text-xs text-[#5B5045] leading-relaxed font-light">
                      <strong className="font-semibold text-[#342F2A]">Problem Solved:</strong> {cb.problem_solved}
                    </p>

                    <div className="p-3 rounded-xl bg-[#E8DED2]/40 border border-[#B8A48D]/30 text-xs text-[#342F2A]">
                      <strong className="font-semibold">Outcome:</strong> {cb.outcome}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs border-t border-[#B8A48D]/20">
                    <span className="text-[11px] font-mono text-[#7E7266]">{cb.technology || 'Technology'}</span>
                    <button
                      onClick={() => setSelectedContribution(cb)}
                      className="text-xs font-semibold text-[#342F2A] hover:underline cursor-pointer"
                    >
                      View Full Memory Evidence →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 11: PROFILE MIND MAP
          Center: PERSON
          Connections: PROJECTS, CONTRIBUTIONS, SKILLS, PROBLEMS, OUTCOMES
         ========================================================================= */}
      <div className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="border-b border-[#B8A48D]/30 pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold">
              Experience Network
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-[#342F2A]">
              Organizational Experience Map
            </h2>
          </div>
          <span className="text-xs text-[#5B5045] font-light">
            Hover or click nodes to reveal connections
          </span>
        </div>

        {/* Sleek Mind Map Canvas (Section 11) */}
        <div className="p-8 bg-[#E8DED2]/40 rounded-3xl border border-[#B8A48D]/40 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          {/* Top Nodes: Projects */}
          <div className="flex flex-wrap items-center justify-center gap-3 z-10">
            {projects.map((pr) => (
              <button
                key={pr.id}
                onClick={() =>
                  setActiveMindmapNode({
                    type: 'Project',
                    title: pr.name,
                    description: pr.description || 'Active project recorded in memory.',
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#FBF9F5] border border-[#B8A48D] hover:border-[#342F2A] hover:scale-105 shadow-xs text-xs font-semibold text-[#342F2A] flex items-center gap-2 transition-all cursor-pointer"
              >
                <FolderGit2 className="h-3.5 w-3.5 text-[#5B5045]" />
                <span>{pr.name}</span>
              </button>
            ))}
          </div>

          {/* Central Hub with Connecting Links */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 w-full max-w-2xl relative z-10">
            {/* Left Node: Skills */}
            <div className="flex flex-col items-end space-y-2 flex-1">
              {(overview.skills || []).slice(0, 3).map((sk: string) => (
                <button
                  key={sk}
                  onClick={() =>
                    setActiveMindmapNode({
                      type: 'Skill',
                      title: sk,
                      description: `Demonstrated capability through shipped contributions.`,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#FBF9F5] border border-[#B8A48D]/60 hover:border-[#342F2A] hover:scale-105 text-[#5B5045] transition-all cursor-pointer truncate max-w-[180px]"
                >
                  {sk}
                </button>
              ))}
            </div>

            {/* Center Anchor: Person (The Hub) */}
            <div className="relative flex flex-col items-center shrink-0">
              <div className="w-20 h-20 rounded-full border-3 border-[#342F2A] overflow-hidden shadow-xl bg-[#FBF9F5]">
                <img
                  src={person.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-heading text-sm font-bold text-[#342F2A] mt-2">
                {person.name}
              </span>
              <span className="text-[10px] text-[#7E7266] font-mono">{person.role}</span>
            </div>

            {/* Right Node: Contributions */}
            <div className="flex flex-col items-start space-y-2 flex-1">
              {contributions.slice(0, 3).map((cb) => (
                <button
                  key={cb.id}
                  onClick={() =>
                    setActiveMindmapNode({
                      type: 'Contribution',
                      title: cb.title,
                      description: `${cb.problem_solved} → Outcome: ${cb.outcome}`,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#FBF9F5] border border-[#B8A48D]/60 hover:border-[#342F2A] hover:scale-105 text-[#5B5045] transition-all cursor-pointer truncate max-w-[180px]"
                >
                  {cb.title}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Nodes: Technical Decisions & Outcomes */}
          <div className="flex flex-wrap items-center justify-center gap-3 z-10">
            {decisions.slice(0, 2).map((dec) => (
              <button
                key={dec.id}
                onClick={() =>
                  setActiveMindmapNode({
                    type: 'Technical Decision',
                    title: dec.title,
                    description: `${dec.decision} → Outcome: ${dec.outcome}`,
                  })
                }
                className="px-4 py-2 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/60 hover:border-[#342F2A] hover:scale-105 text-xs text-[#5B5045] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                <span className="font-medium">{dec.title}</span>
              </button>
            ))}
          </div>

          {/* Active Node Detail Box */}
          {activeMindmapNode && (
            <div className="w-full max-w-xl p-4 rounded-2xl bg-[#FBF9F5] border border-[#B8A48D] shadow-sm space-y-1.5 animate-fade-in text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold">
                  {activeMindmapNode.type} Detail
                </span>
                <button
                  onClick={() => setActiveMindmapNode(null)}
                  className="text-xs text-[#7E7266] hover:text-[#342F2A]"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs font-bold text-[#342F2A]">{activeMindmapNode.title}</div>
              <p className="text-xs text-[#5B5045] leading-relaxed">
                {activeMindmapNode.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Detail Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-[#B8A48D] bg-[#FBF9F5] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#B8A48D]/30 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold">
                  {selectedContribution.project_name} · {selectedContribution.contribution_type}
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#342F2A]">
                  {selectedContribution.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedContribution(null)}
                className="text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] p-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase text-[#7E7266] font-bold block mb-1">
                  Problem Solved
                </span>
                <p className="text-[#5B5045] leading-relaxed bg-[#E8DED2]/40 p-3.5 rounded-xl border border-[#B8A48D]/30">
                  {selectedContribution.problem_solved}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#7E7266] font-bold block mb-1">
                  Technical Decision
                </span>
                <p className="text-[#5B5045] leading-relaxed bg-[#E8DED2]/40 p-3.5 rounded-xl border border-[#B8A48D]/30">
                  {selectedContribution.technical_decision}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-[#7E7266] font-bold block mb-1">
                  Outcome &amp; Result
                </span>
                <p className="text-[#342F2A] font-semibold leading-relaxed bg-[#E8DED2] p-3.5 rounded-xl border border-[#B8A48D]/50">
                  {selectedContribution.outcome}
                </p>
              </div>

              {selectedContribution.artifact_reference && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#7E7266] font-bold block mb-1">
                    Artifact Reference
                  </span>
                  <p className="text-[11px] font-mono text-[#5B5045]">
                    {selectedContribution.artifact_reference}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#B8A48D]/30 flex justify-end">
              <button
                onClick={() => setSelectedContribution(null)}
                className="px-5 py-2.5 rounded-xl bg-[#342F2A] text-[#F3F0E9] text-xs font-semibold hover:bg-[#5B5045] cursor-pointer transition-colors"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
