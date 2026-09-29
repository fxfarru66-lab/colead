import React, { useEffect, useState } from 'react';
import { PersonDetail } from '../types';
import { apiService } from '../services/api';
import {
  ArrowLeft,
  Mail,
  BookOpen,
} from 'lucide-react';

interface DeepMemberProfileProps {
  personId: string;
  onBack: () => void;
}

export const DeepMemberProfile: React.FC<DeepMemberProfileProps> = ({
  personId,
  onBack,
}) => {
  const [detail, setDetail] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiService.getPersonDetail(personId);
        setDetail(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load member profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [personId]);

  if (loading) {
    return (
      <div className="py-12 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-[#E8DED2] rounded" />
        <div className="h-32 bg-[#E8DED2] rounded-xl border border-[#B8A48D]/40" />
        <div className="h-64 bg-[#E8DED2] rounded-xl border border-[#B8A48D]/40" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <p className="text-sm text-red-600">{error || 'Contributor not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs border border-[#5B5045] rounded-lg text-[#342F2A] hover:bg-[#E8DED2]"
        >
          Return to Team Space
        </button>
      </div>
    );
  }

  const { person, contributions } = detail;
  const current_work = detail.current_work || [];
  const previous_work = detail.previous_work || [];
  const context_metrics = detail.context_metrics || {};

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8 animate-fade-in text-[#342F2A]">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#5B5045]" />
          <span>Return to Team Workspace</span>
        </button>
        <span className="text-[11px] font-mono tracking-wider text-[#5B5045] uppercase font-semibold">
          Stage 04 · Personal Organizational Record
        </span>
      </div>

      {/* Person Header Card: #E8DED2 */}
      <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase font-semibold">
              <span>{person.team_name || 'Engineering'}</span>
              <span aria-hidden="true">·</span>
              <span>{person.team_department || 'Core'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#342F2A]">
              {person.name}
            </h1>
            <p className="text-sm text-[#5B5045] font-medium">
              {person.role} {person.title && `· ${person.title}`}
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-2 text-right">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#5B5045]">
              <Mail className="h-3.5 w-3.5 text-[#7E7266]" />
              <span className="font-mono text-[11px] text-[#342F2A] font-semibold">{person.email}</span>
            </div>
            <div className="text-[11px] font-mono text-[#7E7266]">
              Joined {new Date(person.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Ethical Context / Documented Activity Metrics with #F3F0E9 sub-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#B8A48D]/40">
          <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 text-center sm:text-left">
            <div className="text-[11px] text-[#5B5045] font-semibold">Attributed Works</div>
            <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A] mt-0.5">
              {context_metrics.documented_contributions}
            </div>
          </div>
          <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 text-center sm:text-left">
            <div className="text-[11px] text-[#5B5045] font-semibold">Projects Active</div>
            <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A] mt-0.5">
              {context_metrics.active_initiatives}
            </div>
          </div>
          <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 text-center sm:text-left">
            <div className="text-[11px] text-[#5B5045] font-semibold">Completed Projects</div>
            <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A] mt-0.5">
              {context_metrics.completed_initiatives}
            </div>
          </div>
          <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 text-center sm:text-left">
            <div className="text-[11px] text-[#5B5045] font-semibold">Attribution Model</div>
            <div className="text-xs font-mono text-[#342F2A] mt-1 font-bold">
              Verified Evidence
            </div>
          </div>
        </div>
      </div>

      {/* Stage Flow Indicator */}
      <div className="text-xs text-[#5B5045] flex items-center justify-center gap-2 tracking-wide font-mono font-semibold">
        <span>PERSON</span>
        <span className="text-[#342F2A]">→</span>
        <span className="text-[#342F2A] underline">CURRENT &amp; PREVIOUS WORK</span>
        <span className="text-[#342F2A]">→</span>
        <span>CONTRIBUTIONS</span>
        <span className="text-[#342F2A]">→</span>
        <span>OUTCOMES</span>
        <span className="text-[#342F2A]">→</span>
        <span>MEMORY</span>
      </div>

      {/* Current Work Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#5B5045] animate-pulse" />
            <h2 className="font-serif text-xl font-bold tracking-wide text-[#342F2A]">
              Current Work &amp; Active Responsibilities
            </h2>
          </div>
          <span className="text-xs font-mono text-[#5B5045] font-semibold">
            {current_work.length} active initiatives
          </span>
        </div>

        {current_work.length === 0 ? (
          <div className="rounded-xl border border-[#B8A48D]/50 bg-[#E8DED2] p-6 text-center text-xs text-[#5B5045]">
            No ongoing initiatives currently active. Previous completed contributions are preserved below.
          </div>
        ) : (
          <div className="space-y-3">
            {current_work.map((work: any) => (
              <div
                key={work.id}
                className="rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2] p-5 space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-[#5B5045] font-semibold">
                      {work.project_name} ({work.project_code})
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#342F2A] mt-0.5">
                      {work.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#5B5045] bg-[#F3F0E9] text-[#342F2A] font-semibold">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="rounded border border-[#B8A48D]/50 bg-[#F3F0E9] p-3">
                    <span className="text-[#5B5045] font-semibold text-[11px] block mb-1">
                      Problem Under Solve:
                    </span>
                    <span className="text-[#342F2A] leading-relaxed">{work.problem_solved}</span>
                  </div>
                  <div className="rounded border border-[#B8A48D]/50 bg-[#F3F0E9] p-3">
                    <span className="text-[#5B5045] font-semibold text-[11px] block mb-1">
                      Technical Approach:
                    </span>
                    <span className="text-[#342F2A] leading-relaxed">{work.technical_decision}</span>
                  </div>
                </div>

                {work.artifact_reference && (
                  <div className="pt-2 border-t border-[#B8A48D]/30 flex items-center justify-between text-xs text-[#5B5045]">
                    <span className="font-mono text-[11px] text-[#342F2A]">
                      Artifact: {work.artifact_reference}
                    </span>
                    {work.collaborators && (
                      <span className="text-[11px] text-[#7E7266]">
                        Collaborating with: {work.collaborators}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Previous Work & Historical Contribution Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#5B5045]" />
            <h2 className="font-serif text-xl font-bold tracking-wide text-[#342F2A]">
              Historical Work &amp; Contribution History
            </h2>
          </div>
          <span className="text-xs font-mono text-[#5B5045] font-semibold">
            {previous_work.length + contributions.length} recorded items
          </span>
        </div>

        <div className="space-y-4">
          {contributions.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2] p-5 space-y-3 relative shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#5B5045] font-semibold">
                    <span className="text-[#342F2A]">{c.project_name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{c.contribution_type}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#342F2A] mt-0.5">
                    {c.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-right">
                  {c.is_lead ? (
                    <span className="text-[10px] font-mono text-[#342F2A] bg-[#F3F0E9] px-2 py-0.5 rounded border border-[#B8A48D] font-semibold">
                      Project Lead
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#F3F0E9] bg-[#5B5045] px-2 py-0.5 rounded border border-[#342F2A] font-semibold">
                      Attributed Contributor
                    </span>
                  )}
                  <span className="text-xs font-mono text-[#7E7266]">
                    {new Date(c.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* 3-Column Problem / Decision / Outcome in #F3F0E9 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#5B5045] uppercase tracking-wider">
                    Problem Solved
                  </div>
                  <div className="text-[#342F2A] leading-relaxed">{c.problem_solved}</div>
                </div>

                <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#5B5045] uppercase tracking-wider">
                    Technical Decision
                  </div>
                  <div className="text-[#342F2A] leading-relaxed">{c.technical_decision}</div>
                </div>

                <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-3 space-y-1">
                  <div className="text-[10px] font-bold text-[#5B5045] uppercase tracking-wider">
                    Measurable Outcome
                  </div>
                  <div className="text-[#342F2A] font-semibold leading-relaxed">{c.outcome}</div>
                </div>
              </div>

              {/* Artifact & Collab Footer */}
              <div className="pt-2 border-t border-[#B8A48D]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5B5045]">
                <div className="flex items-center gap-3">
                  {c.artifact_reference && (
                    <span className="font-mono text-[11px] text-[#342F2A] font-semibold">
                      Artifact: {c.artifact_reference}
                    </span>
                  )}
                  {c.collaborators && (
                    <span className="text-[11px]">Collaborated with: {c.collaborators}</span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#342F2A] font-semibold">
                  Hindsight Retained Memory
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
