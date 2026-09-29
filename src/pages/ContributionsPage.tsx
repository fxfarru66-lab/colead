import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Contribution, Project } from '../types';
import { getProjectVisual } from '../utils/projectVisuals';
import { Search, Filter, ArrowRight, User, ShieldCheck } from 'lucide-react';

interface ContributionsPageProps {
  onOpenPersonDetail?: (personId: string) => void;
}

export const ContributionsPage: React.FC<ContributionsPageProps> = ({
  onOpenPersonDetail,
}) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [contribs, projs] = await Promise.all([
          apiService.getContributions(),
          apiService.getProjects(),
        ]);
        setContributions(contribs);
        setProjects(projs);
      } catch (err: any) {
        console.error('Failed to load contributions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredContributions = contributions.filter((c) => {
    const matchesProject =
      selectedProjectId === 'all' || c.project_id === selectedProjectId;
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.person_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problem_solved.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.technical_decision.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.project_name && c.project_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProject && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266]">Loading Attributions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-4 animate-page-enter text-[#342F2A]">
      {/* 1. Header: Who Did What */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B8A48D]/35 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase mb-1 font-semibold">
            <span>Attribution Ledger</span>
            <span>·</span>
            <span>{contributions.length} Documented Contributions</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#342F2A]">
            Who Did What
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5B5045] font-light">
            See the people behind the work, what they contributed, and the results achieved.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-[#7E7266] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search person or contribution..."
              className="h-10 pl-10 pr-4 rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2]/60 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] w-60 font-medium transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-[#5B5045]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-10 rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2]/60 px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] font-medium cursor-pointer"
            >
              <option value="all">All Projects ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Premium Horizontal Contribution Cards (Section 8) */}
      <div className="space-y-6">
        {filteredContributions.map((contrib) => {
          const projectImg = getProjectVisual(contrib.project_id, contrib.project_name);

          return (
            <div
              key={contrib.id}
              onClick={() => onOpenPersonDetail && onOpenPersonDetail(contrib.person_id)}
              className="rounded-3xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 sm:p-8 shadow-xs card-3d cursor-pointer flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between group hover:border-[#342F2A]"
            >
              {/* LEFT: Person Photo + Overlapping Project Thumbnail (Section 8) */}
              <div className="relative shrink-0 flex items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#B8A48D] group-hover:scale-105 transition-transform shadow-sm bg-[#E8DED2]">
                  <img
                    src={contrib.person_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                    alt={contrib.person_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Subtly Overlapping Project Image */}
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#FBF9F5] shadow-md absolute -bottom-1 -right-2 bg-[#342F2A]">
                  <img
                    src={projectImg}
                    alt={contrib.project_name}
                    className="w-full h-full object-cover"
                    title={contrib.project_name}
                  />
                </div>
              </div>

              {/* RIGHT: Person Details + What They Contributed + Outcome (Section 8) */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors leading-tight">
                      {contrib.person_name}
                    </h3>
                    <div className="text-xs text-[#5B5045] font-medium">
                      {contrib.person_role} · <span className="text-[#7E7266] font-mono">{contrib.project_name}</span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8DED2] text-[#5B5045] self-start sm:self-auto uppercase">
                    {contrib.contribution_type}
                  </span>
                </div>

                {/* What they contributed */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold block">
                    What They Contributed
                  </span>
                  <p className="text-xs sm:text-sm text-[#342F2A] font-medium leading-relaxed">
                    "{contrib.title}" — {contrib.technical_decision || contrib.problem_solved}
                  </p>
                </div>

                {/* Outcome */}
                <div className="p-3.5 rounded-2xl bg-[#E8DED2]/45 border border-[#B8A48D]/35 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-[#7E7266] font-bold block">
                    Delivered Outcome
                  </span>
                  <p className="text-xs text-[#342F2A] font-semibold leading-relaxed">
                    {contrib.outcome}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#342F2A] group-hover:text-[#5B5045]">
                  <span className="text-[11px] font-mono text-[#7E7266]">
                    {contrib.technology || 'Core Infrastructure'}
                  </span>
                  <span className="flex items-center gap-1">
                    View Full Profile &amp; Experience Map
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
