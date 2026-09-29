import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  Search,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  User,
  ExternalLink,
  Layers,
  ArrowDown,
} from 'lucide-react';

interface MemoryNode {
  id: string;
  category: string;
  title: string;
  project: string;
  contributor: string;
  lesson: string;
  outcome: string;
  date: string;
  evidenceText: string;
  badgeColor: string;
}

interface MemoryJourney3DProps {
  query?: string;
  onSelectPerson?: (personId: string) => void;
  recalledFactsCount?: number;
}

export const MemoryJourney3D: React.FC<MemoryJourney3DProps> = ({
  query = 'I want to build an e-commerce platform with Stripe payments, real-time tracking, and an admin dashboard',
  onSelectPerson,
  recalledFactsCount = 5,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryNode | null>(null);

  const memoryNodes: MemoryNode[] = [
    {
      id: 'mem_1',
      category: 'Payment Reliability',
      title: 'Stripe Webhook Deduplication & Mutex',
      project: 'Payment Gateway Integration',
      contributor: 'Daniel Ortiz (Senior Backend Engineer)',
      lesson: 'High burst payment retries trigger double charges without Redis mutex locking.',
      outcome: 'Reduced payment failure rate to 0.002% across 1.4M transactions.',
      date: '60 days ago',
      evidenceText: 'PR #1428: Implemented pkg/payments/retry.go with SHA-256 payload deduplication and atomic SQLite state transitions.',
      badgeColor: 'border-purple-600 bg-purple-100 text-purple-900',
    },
    {
      id: 'mem_2',
      category: 'Storefront UI & Tokens',
      title: 'Accessible Design System & Micro-Interactions',
      project: 'Mobile App Redesign',
      contributor: 'Alex Chen & Priya Sharma',
      lesson: 'Inconsistent inputs across mobile/web broke WCAG compliance and increased checkout abandonment.',
      outcome: '100% WCAG 2.1 AA audit compliance and 42% higher completion rate.',
      date: '30 days ago',
      evidenceText: 'Figma Components/Mobile/Forms/v3: Standardized 24 high-contrast accessible inputs with dynamic elevation tokens.',
      badgeColor: 'border-blue-600 bg-blue-100 text-blue-900',
    },
    {
      id: 'mem_3',
      category: 'Real-Time Telemetry',
      title: 'CDC Event Pipeline & Courier Streams',
      project: 'Real-Time Search & Event Indexing',
      contributor: 'Marcus Chen & Daniel Ortiz',
      lesson: 'Mixed timezones in event payloads jammed real-time stream worker buffers.',
      outcome: 'Sub-80ms full-text index freshness with zero dropped Kafka streaming records.',
      date: '15 days ago',
      evidenceText: 'PR #1580 (services/indexer/normalizer.go): Enforced UTC ISO-8601 normalization filter in Debezium connector.',
      badgeColor: 'border-emerald-600 bg-emerald-100 text-emerald-900',
    },
    {
      id: 'mem_4',
      category: 'Federated Gateway',
      title: 'Aggregated GraphQL Resolver Suite',
      project: 'Mobile Profile & Entitlements Gateway',
      contributor: 'Maria Garcia (Full Stack Engineer)',
      lesson: 'Client required 4 separate HTTP round-trips to assemble cart, customer profile, and permissions.',
      outcome: 'Cut initial load payload by 65% and reduced round-trip latency by 320ms.',
      date: '15 days ago',
      evidenceText: 'PR #305 (services/gateway/profile.ts): Consolidated profile, team, and entitlements into one federated resolver.',
      badgeColor: 'border-amber-600 bg-amber-100 text-amber-900',
    },
  ];

  const steps = [
    { number: '01', title: 'User Request', label: 'Intent Extraction', icon: Search },
    { number: '02', title: 'Hindsight Recall', label: 'Institutional Search', icon: Database },
    { number: '03', title: 'Relevant Experience', label: 'SQLite Memory Match', icon: BookOpen },
    { number: '04', title: 'Reflect & Synthesize', label: 'Gemini Reasoning', icon: Sparkles },
    { number: '05', title: 'Project Blueprint', label: 'Architecture Ready', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 rounded-3xl border border-[#B8A48D]/70 bg-[#FBF9F5] p-6 sm:p-8 shadow-xl text-[#342F2A]">
      {/* Concept Explanation Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B8A48D]/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#342F2A] text-[#F3F0E9] text-[10px] font-mono font-bold uppercase tracking-wider">
              HINDSIGHT MEMORY JOURNEY
            </span>
            <span className="text-xs font-mono text-[#5B5045]">
              {recalledFactsCount} Proven Memory Nodes Connected
            </span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#342F2A]">
            CoLead doesn’t just answer. It remembers.
          </h3>
        </div>

        <div className="text-xs text-[#5B5045] font-serif italic max-w-xs text-right hidden sm:block">
          "Work → Memory → Recall → Reflection → New Project → Better Decisions"
        </div>
      </div>

      {/* Horizontal 3D Visual Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((st, idx) => {
          const StIcon = st.icon;
          return (
            <div
              key={st.number}
              className="p-4 rounded-2xl border border-[#B8A48D]/50 bg-[#F3F0E9] space-y-2 relative group hover:border-[#342F2A] transition-all transform hover:-translate-y-1 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#5B5045]">{st.number}</span>
                <StIcon className="h-4 w-4 text-[#5B5045] group-hover:text-[#342F2A] transition-colors" />
              </div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-[#342F2A]">{st.title}</h4>
              <p className="text-[10px] font-mono text-[#7E7266] uppercase tracking-wider">{st.label}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Memory Nodes Grid */}
      <div className="space-y-4">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
          Recalled Institutional Memory Nodes (Click to Inspect Evidence)
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memoryNodes.map((node) => {
            const isSelected = selectedMemory?.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedMemory(isSelected ? null : node)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-[#342F2A] text-[#F3F0E9] border-[#342F2A] shadow-xl scale-102'
                    : 'bg-[#F3F0E9] hover:bg-[#E8DED2] text-[#342F2A] border-[#B8A48D]/60 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      isSelected ? 'border-amber-400 bg-amber-400/20 text-amber-300' : node.badgeColor
                    }`}
                  >
                    {node.category}
                  </span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-stone-400' : 'text-[#7E7266]'}`}>
                    {node.date}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm sm:text-base leading-snug">{node.title}</h4>
                  <span className={`text-xs ${isSelected ? 'text-stone-300' : 'text-[#5B5045]'}`}>
                    Project: <strong>{node.project}</strong>
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${isSelected ? 'text-stone-300' : 'text-[#5B5045]'}`}>
                  <strong className={isSelected ? 'text-white' : 'text-[#342F2A]'}>Proven Solution:</strong> {node.lesson}
                </p>

                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    isSelected ? 'bg-black/30 border-white/20 text-stone-200' : 'bg-[#FBF9F5] border-[#B8A48D]/40 text-[#342F2A]'
                  }`}
                >
                  <span className="font-semibold truncate">Contributor: {node.contributor}</span>
                  <span className="font-mono text-[10px] underline ml-2 shrink-0">
                    {isSelected ? 'Hide Evidence' : 'Inspect Evidence'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Evidence Card Drawer */}
      {selectedMemory && (
        <div className="p-6 rounded-2xl border border-purple-300 bg-purple-50/90 text-purple-950 space-y-4 animate-fade-in shadow-lg">
          <div className="flex items-center justify-between border-b border-purple-200 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-700" />
              <h4 className="font-heading font-bold text-base text-purple-950">
                Verified Documented Evidence: {selectedMemory.title}
              </h4>
            </div>
            <button
              onClick={() => setSelectedMemory(null)}
              className="text-xs font-mono font-bold text-purple-700 hover:text-purple-950"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-purple-900">Historical Context &amp; Problem:</span>
              <p className="leading-relaxed">{selectedMemory.lesson}</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-purple-900">Proven Solution &amp; Impact:</span>
              <p className="leading-relaxed">{selectedMemory.outcome}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-100/80 border border-purple-200 text-xs font-mono space-y-1 text-purple-900">
            <span className="font-bold uppercase tracking-wider text-[10px]">Verified Artifact Reference:</span>
            <p>{selectedMemory.evidenceText}</p>
          </div>
        </div>
      )}
    </div>
  );
};
