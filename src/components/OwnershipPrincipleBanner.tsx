import React from 'react';
import { ShieldCheck, GitFork } from 'lucide-react';

export const OwnershipPrincipleBanner: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase font-semibold">
            <ShieldCheck className="h-4 w-4 text-[#5B5045]" />
            <span>CORE GOVERNING PRINCIPLE</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#342F2A]">
            “Ownership is not the same as contribution.”
          </h2>
          <p className="text-sm text-[#5B5045] leading-relaxed font-light">
            Project leads provide coordination and governance, but the actual technical solutions,
            debugging breakthroughs, and design decisions are created by individual team members.
            CoLead permanently isolates each contribution with verifiable evidence—so junior and less-visible
            engineers are never overshadowed by seniority.
          </p>
        </div>

        {/* Concrete Architectural Evidence Illustration */}
        <div className="flex-1 lg:max-w-md rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-5 text-xs space-y-3 shadow-inner">
          <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-2 text-xs">
            <div>
              <span className="text-[#7E7266]">Project:</span>{' '}
              <span className="font-serif font-bold text-[#342F2A]">Payment Platform</span>
            </div>
            <div className="text-[#7E7266] font-mono text-[11px]">
              Lead: <span className="text-[#5B5045] font-semibold">Elena Vance (Staff Architect)</span>
            </div>
          </div>

          <div className="space-y-2.5 text-[#5B5045]">
            <div className="flex items-start gap-2.5">
              <GitFork className="h-3.5 w-3.5 text-[#5B5045] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#342F2A]">Junior Engineer (Marcus Chen)</span>
                <span className="text-[#7E7266]"> — implemented payment webhook idempotency service</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <GitFork className="h-3.5 w-3.5 text-[#5B5045] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#342F2A]">Engineer (Aisha Patel)</span>
                <span className="text-[#7E7266]"> — solved multi-tab OAuth token refresh race conditions</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <GitFork className="h-3.5 w-3.5 text-[#5B5045] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#342F2A]">Senior Engineer (Elena Vance)</span>
                <span className="text-[#7E7266]"> — multi-region ledger replication &amp; warm failover architecture</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <GitFork className="h-3.5 w-3.5 text-[#5B5045] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#342F2A]">Designer (Sofia Morales)</span>
                <span className="text-[#7E7266]"> — 2-step checkout UX &amp; progressive bank error guidance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
