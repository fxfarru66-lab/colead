import React, { useState, useEffect } from 'react';
import { PersonDetail, Contribution } from '../types';
import { apiService } from '../services/api';
import {
  X,
  Mail,
  Users,
  Briefcase,
  GitCommit,
  CheckCircle2,
  Calendar,
  Layers,
  FileCode,
  Shield,
  Sparkles,
} from 'lucide-react';

interface MemberProfileModalProps {
  personId: string;
  onClose: () => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  personId,
  onClose,
}) => {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'contributions' | 'projects' | 'decisions' | 'memory'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiService.getPersonDetail(personId);
        setDetail(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load contributor record');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId]);

  if (!personId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342F2A]/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-[#B8A48D]/70 bg-[#FBF9F5] shadow-2xl overflow-hidden text-[#342F2A] my-8 animate-scale-up">
        
        {loading ? (
          <div className="p-12 space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#E8DED2]" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-48 bg-[#E8DED2] rounded" />
                <div className="h-4 w-32 bg-[#E8DED2] rounded" />
              </div>
            </div>
            <div className="h-64 bg-[#E8DED2] rounded-xl" />
          </div>
        ) : error || !detail ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-sm text-red-700">{error || 'Contributor details not found'}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs border border-[#5B5045] rounded-lg text-[#342F2A]"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            {/* Modal Header matching Screen 5 in reference */}
            <div className="p-6 sm:p-8 pb-4 border-b border-[#B8A48D]/30 relative flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-[#7E7266] hover:text-[#342F2A] transition-colors p-1 rounded-full hover:bg-[#E8DED2]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative">
                <img
                  src={detail.person.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80'}
                  alt={detail.person.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#B8A48D] shadow-md"
                />
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-[#FBF9F5]" />
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#342F2A]">
                  {detail.person.name}
                </h2>
                <div className="text-xs font-semibold text-[#5B5045]">
                  {detail.person.role} {detail.person.title && `· ${detail.person.title}`}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8DED2] text-[#342F2A] text-[11px] font-medium border border-[#B8A48D]/40">
                    <Users className="h-3 w-3 text-[#5B5045]" />
                    <span>{detail.person.team_name || 'Product Team'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>{detail.person.status || 'Active'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs matching Screen 5 */}
            <div className="flex items-center border-b border-[#B8A48D]/30 px-6 sm:px-8 gap-6 overflow-x-auto no-scrollbar text-xs font-medium">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'contributions', label: `Contributions (${detail.contributions.length})` },
                { id: 'projects', label: `Projects (${detail.projects.length})` },
                { id: 'decisions', label: `Decisions (${detail.decisions.length})` },
                { id: 'memory', label: 'Memory' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 relative whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#342F2A] font-bold'
                      : 'text-[#7E7266] hover:text-[#342F2A]'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#342F2A] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* TAB 1: OVERVIEW matching Screen 5 in reference */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
                  {/* Left Column: About, Team, Email, Skills */}
                  <div className="md:col-span-6 space-y-5">
                    <div>
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#5B5045] font-bold mb-1.5">
                        About
                      </h4>
                      <p className="text-xs text-[#5B5045] leading-relaxed font-light">
                        {detail.overview.about}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-[#B8A48D]/30 text-xs">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#7E7266] shrink-0" />
                        <span className="text-[#7E7266]">Team:</span>
                        <span className="font-semibold text-[#342F2A]">{detail.overview.team}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#7E7266] shrink-0" />
                        <span className="text-[#7E7266]">Email:</span>
                        <span className="font-mono text-[#342F2A] font-medium">{detail.overview.email}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#B8A48D]/30 space-y-2">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#5B5045] font-bold">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.overview.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-[#E8DED2] text-[#342F2A] text-[11px] font-medium border border-[#B8A48D]/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Current Work Card & Recent Contributions Card */}
                  <div className="md:col-span-6 space-y-5">
                    {/* Current Work Card matching Screen 5 */}
                    <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 space-y-2.5 shadow-sm">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#5B5045] font-bold">
                        Current Work
                      </h4>
                      <div>
                        <div className="font-serif text-sm font-bold text-[#342F2A]">
                          {detail.overview.current_work?.name || 'Mobile App Redesign'}
                        </div>
                        <p className="text-xs text-[#5B5045] mt-0.5 leading-relaxed font-light">
                          {detail.overview.current_work?.description || 'Designing user flows and UI for the mobile application.'}
                        </p>
                      </div>

                      {/* Progress bar matching Screen 5 (60%) */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#5B5045]">
                          <span>In Progress</span>
                          <span className="font-bold text-[#342F2A]">
                            {detail.overview.current_work?.progress || 60}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#E8DED2] overflow-hidden">
                          <div
                            className="h-full bg-[#5B5045] rounded-full transition-all"
                            style={{ width: `${detail.overview.current_work?.progress || 60}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Recent Contributions Card matching Screen 5 */}
                    <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 space-y-3 shadow-sm">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#5B5045] font-bold">
                        Recent Contributions
                      </h4>

                      <div className="space-y-2.5">
                        {(detail.overview.recent_contributions && detail.overview.recent_contributions.length > 0
                          ? detail.overview.recent_contributions
                          : [
                              { id: '1', title: 'UI components library', created_at: '2 days ago' },
                              { id: '2', title: 'User research analysis', created_at: '5 days ago' },
                            ]
                        ).map((c: any, i: number) => (
                          <div key={c.id || i} className="flex items-start gap-2.5 text-xs">
                            <div className="w-6 h-6 rounded-full bg-[#E8DED2] flex items-center justify-center text-[#5B5045] shrink-0 mt-0.5">
                              <FileCode className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-[#342F2A] truncate">
                                {c.title}
                              </div>
                              <div className="text-[10px] text-[#7E7266] font-mono">
                                {c.created_at.includes('ago')
                                  ? c.created_at
                                  : new Date(c.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTRIBUTIONS (Attributed Evidence) */}
              {activeTab === 'contributions' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-lg border border-[#B8A48D]/40 bg-[#E8DED2] p-3 text-xs text-[#5B5045] flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#5B5045] shrink-0" />
                    <span>
                      <strong className="text-[#342F2A]">Governing Principle:</strong> Ownership is not the same as contribution. The records below preserve {detail.person.name}’s actual problem-solving and technical output.
                    </span>
                  </div>

                  {detail.contributions.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-5 space-y-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-mono text-[#5B5045] font-semibold">
                            {c.project_name} ({c.project_code}) · {c.contribution_type}
                          </div>
                          <h4 className="font-serif text-base font-bold text-[#342F2A] mt-0.5">
                            {c.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-[#7E7266]">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <div className="rounded-lg bg-[#E8DED2]/60 p-2.5 border border-[#B8A48D]/40">
                          <span className="text-[10px] font-bold text-[#5B5045] block uppercase font-mono">Problem Solved</span>
                          <span className="text-[#342F2A] mt-0.5 block leading-relaxed">{c.problem_solved}</span>
                        </div>
                        <div className="rounded-lg bg-[#E8DED2]/60 p-2.5 border border-[#B8A48D]/40">
                          <span className="text-[10px] font-bold text-[#5B5045] block uppercase font-mono">Technical Decision</span>
                          <span className="text-[#342F2A] mt-0.5 block leading-relaxed">{c.technical_decision}</span>
                        </div>
                        <div className="rounded-lg bg-[#E8DED2]/60 p-2.5 border border-[#B8A48D]/40">
                          <span className="text-[10px] font-bold text-[#342F2A] block uppercase font-mono">Measurable Outcome</span>
                          <span className="text-[#342F2A] mt-0.5 block font-semibold leading-relaxed">{c.outcome}</span>
                        </div>
                      </div>

                      {c.artifact_reference && (
                        <div className="pt-2 border-t border-[#B8A48D]/30 text-xs text-[#5B5045] flex items-center justify-between">
                          <span className="font-mono text-[11px] text-[#342F2A] font-semibold">
                            Artifact: {c.artifact_reference}
                          </span>
                          {c.collaborators && (
                            <span className="text-[10px] text-[#7E7266]">
                              Collaborated with: {c.collaborators}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-3 animate-fade-in">
                  {detail.projects.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 flex items-center justify-between shadow-sm"
                    >
                      <div>
                        <div className="font-serif text-sm font-bold text-[#342F2A]">
                          {p.name} ({p.code})
                        </div>
                        <p className="text-xs text-[#5B5045] max-w-md line-clamp-2 mt-0.5">
                          {p.description}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="px-2 py-0.5 rounded border border-[#B8A48D] bg-[#E8DED2] text-[#342F2A] font-mono text-[10px] font-semibold">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: DECISIONS */}
              {activeTab === 'decisions' && (
                <div className="space-y-3 animate-fade-in">
                  {detail.decisions.map((d) => (
                    <div
                      key={d.id}
                      className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 space-y-1.5 shadow-sm"
                    >
                      <div className="text-[10px] font-mono text-[#5B5045] font-semibold">
                        {d.project_name} · {d.title}
                      </div>
                      <div className="text-xs text-[#342F2A] leading-relaxed">
                        <strong className="text-[#5B5045]">Decision:</strong> {d.decision}
                      </div>
                      <div className="text-xs text-[#342F2A] leading-relaxed">
                        <strong className="text-[#5B5045]">Outcome:</strong> {d.outcome}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: MEMORY (Hindsight Preparation) */}
              {activeTab === 'memory' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-5 space-y-3 text-xs text-[#5B5045]">
                    <div className="flex items-center gap-2 text-[#342F2A] font-bold font-serif text-base">
                      <Sparkles className="h-4 w-4 text-[#5B5045]" />
                      <span>Hindsight Cloud Memory Link</span>
                    </div>
                    <p className="leading-relaxed font-light">
                      This contributor's evidence records are indexed in the organization's Hindsight bank (<code className="text-[#342F2A] font-mono font-bold">colead</code>).
                      Whenever colleagues ask questions in <em>Ask CoLead</em>, this contributor's historical decisions are surfaced as evidence.
                    </p>
                    <div className="pt-2 border-t border-[#B8A48D]/30 flex items-center justify-between font-mono text-[11px]">
                      <span>Indexed Units: {detail.contributions.length}</span>
                      <span className="text-emerald-700 font-semibold">Status: Retained in Core DB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-[#E8DED2]/40 border-t border-[#B8A48D]/30 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold tracking-wide transition-all shadow-sm"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
