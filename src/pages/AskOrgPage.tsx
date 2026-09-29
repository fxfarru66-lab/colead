import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import {
  HindsightAskResult,
  HindsightCloudHealth,
  ProjectArchitectBlueprint,
  PageId,
} from '../types';
import { VoiceController } from '../components/VoiceController';
import { VisualProjectPrototype } from '../components/VisualProjectPrototype';
import { CinematicWalkthroughModal } from '../components/CinematicWalkthroughModal';
import { ProjectVideoPlayer } from '../components/ProjectVideoPlayer';
import { MemoryJourney3D } from '../components/MemoryJourney3D';
import { ProjectMindMap3D } from '../components/ProjectMindMap3D';
import { LearningLoopModal } from '../components/LearningLoopModal';
import {
  Search,
  Database,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Film,
  Zap,
  Info,
  BookOpen,
  User,
  Activity,
  AlertTriangle,
} from 'lucide-react';

interface AskOrgPageProps {
  initialQuery?: string;
  onOpenPersonDetail?: (personId: string) => void;
  onNavigate?: (page: PageId) => void;
}

export const AskOrgPage: React.FC<AskOrgPageProps> = ({
  initialQuery = '',
  onOpenPersonDetail,
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [askResult, setAskResult] = useState<HindsightAskResult | null>(null);
  const [blueprint, setBlueprint] = useState<ProjectArchitectBlueprint | null>(null);
  const [hindsightHealth, setHindsightHealth] = useState<HindsightCloudHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));

  // Modals & Interactive View Modes
  const [showWalkthroughModal, setShowWalkthroughModal] = useState(false);
  const [showLearningLoopModal, setShowLearningLoopModal] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<any | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'all' | 'prototype' | 'video' | 'mindmap'>('all');

  const agentStages = [
    'UNDERSTANDING REQUEST',
    'SEARCHING ORGANIZATIONAL EXPERIENCE',
    'RECALLING RELEVANT MEMORY',
    'SYNTHESIZING LESSONS',
    'MATCHING DOCUMENTED EXPERIENCE',
    'BUILDING PROJECT BLUEPRINT',
    'GENERATING VISUAL PROTOTYPE',
  ];

  const executeAsk = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setSubmittedQuery(searchQuery);
    setHasSearched(true);
    setActiveStageIdx(0);

    // Simulate progressive agent pipeline milestones for hackathon demo
    const interval = setInterval(() => {
      setActiveStageIdx((prev) => (prev < agentStages.length - 1 ? prev + 1 : prev));
    }, 450);

    try {
      // 1. Query Hindsight AI memory
      const res = await apiService.askHindsight(searchQuery.trim());
      setAskResult(res);

      // 2. Query Project Architect Agent if the query is a project intent or general build request
      const isProjectIntent =
        searchQuery.toLowerCase().includes('build') ||
        searchQuery.toLowerCase().includes('platform') ||
        searchQuery.toLowerCase().includes('e-commerce') ||
        searchQuery.toLowerCase().includes('app') ||
        searchQuery.toLowerCase().includes('system') ||
        searchQuery.toLowerCase().includes('project') ||
        searchQuery.toLowerCase().includes('stripe') ||
        searchQuery.toLowerCase().includes('react');

      if (isProjectIntent) {
        try {
          const bp = await apiService.planProjectArchitect(searchQuery.trim());
          setBlueprint(bp);
        } catch (bpErr) {
          console.warn('[AskOrgPage] Project Architect fallback notice:', bpErr);
        }
      }
    } catch (err: any) {
      console.error('[AskOrgPage] Error executing search:', err);
      setErrorMsg(err.message || 'Memory service is temporarily unavailable. Please try again.');
    } finally {
      clearInterval(interval);
      setActiveStageIdx(agentStages.length - 1);
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadHealth() {
      try {
        const h = await apiService.getHindsightHealth();
        setHindsightHealth(h);
      } catch (e) {
        console.warn('Health check notice:', e);
      }
    }
    loadHealth();

    if (initialQuery) {
      executeAsk(initialQuery);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeAsk(query);
  };

  const handleVoiceTranscript = (text: string) => {
    setQuery(text);
  };

  const samplePrompt =
    'I want to build an e-commerce platform with React, Node.js, Stripe payments, real-time order tracking, and an admin dashboard.';

  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto animate-page-enter text-[#342F2A]">
      {/* =========================================================================
          1. 3D COMMAND CENTER & HERO HEADER
         ========================================================================= */}
      <div className="text-center space-y-6 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#B8A48D] bg-[#E8DED2]/90 text-[11px] font-mono tracking-widest text-[#5B5045] uppercase font-semibold shadow-xs">
          <Database className="h-3.5 w-3.5 text-[#5B5045]" />
          <span>COLEAD 3D AI COMMAND CENTER</span>
          {hindsightHealth?.cloud_reachable && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Memory Connected
            </span>
          )}
        </div>

        {/* 3D Page Title with Subtle Depth Extrusion */}
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-[#342F2A] drop-shadow-sm perspective-1000">
          Ask CoLead.
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-base text-[#5B5045] max-w-2xl mx-auto font-light leading-relaxed">
          Describe what you want to build, and CoLead connects your organization's experience, memory, people, and lessons to help design the next project.
        </p>

        {/* Learning Loop Demo Launcher Bar */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowLearningLoopModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-amber-600/70 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 hover:from-amber-200 hover:to-amber-100 text-amber-950 text-xs font-bold transition-all shadow-sm transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-600 animate-pulse" />
            <span>Demonstrate Learning Loop</span>
            <span className="text-[10px] font-mono bg-amber-200/80 px-2 py-0.5 rounded-full text-amber-900 ml-1">
              Live Hindsight
            </span>
          </button>
        </div>

        {/* =========================================================================
            2. 3D CONVERSATIONAL & VOICE INPUT SURFACE
           ========================================================================= */}
        <div className="max-w-3xl mx-auto p-4 sm:p-5 rounded-3xl border border-[#B8A48D] bg-[#FBF9F5] shadow-xl space-y-4">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your next project idea, technical requirement, or question about past work..."
                rows={3}
                className="w-full p-4 pr-12 rounded-2xl border border-[#B8A48D]/70 bg-[#F3F0E9]/50 text-sm sm:text-base text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-all font-medium resize-none shadow-inner"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              {/* Real Voice Input & Output Controls */}
              <VoiceController
                onTranscript={handleVoiceTranscript}
                speakingText={
                  askResult?.answer ||
                  blueprint?.executive_summary ||
                  blueprint?.project_understanding?.purpose ||
                  ''
                }
                isProcessing={loading}
              />

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowLearningLoopModal(true)}
                  className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-500/60 bg-amber-100/70 hover:bg-amber-200 text-xs text-amber-950 font-bold transition-all cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 text-amber-700" />
                  <span>Learning Loop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQuery(samplePrompt)}
                  className="px-3 py-2 rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2]/50 hover:bg-[#E8DED2] text-xs text-[#5B5045] font-semibold transition-all cursor-pointer whitespace-nowrap"
                >
                  Load Demo Prompt
                </button>

                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs sm:text-sm font-semibold text-[#F3F0E9] transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Recalling &amp; Designing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span>Ask CoLead</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Example Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#7E7266] pt-1">
            <span className="font-mono text-[11px] uppercase">Example inquiries:</span>
            {[
              'I want to build an e-commerce platform with Stripe payments...',
              'Who has experience with payment integrations?',
              'What did we learn from our previous payment project?',
              'Who contributed to OAuth and authentication modernization?',
            ].map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(item.startsWith('I want') ? samplePrompt : item);
                  executeAsk(item.startsWith('I want') ? samplePrompt : item);
                }}
                className="px-2.5 py-1 rounded-lg border border-[#B8A48D]/40 bg-[#E8DED2]/40 hover:bg-[#E8DED2] text-[#342F2A] transition-all text-[11px] cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. HIGH-LEVEL AGENT THINKING / PROGRESS STATES
         ========================================================================= */}
      {loading && (
        <div className="p-6 sm:p-8 rounded-3xl border border-[#B8A48D] bg-[#FBF9F5] shadow-lg space-y-4 max-w-4xl mx-auto animate-fade-in text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#5B5045] uppercase tracking-wider">
            <RefreshCw className="h-4 w-4 animate-spin text-[#342F2A]" />
            <span>CoLead AI Reasoning in Progress</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {agentStages.map((st, i) => (
              <div
                key={st}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-semibold transition-all duration-300 ${
                  i <= activeStageIdx
                    ? 'bg-[#342F2A] text-[#F3F0E9] border-[#342F2A] scale-102 shadow-xs'
                    : 'bg-[#E8DED2]/40 text-[#7E7266] border-[#B8A48D]/30'
                }`}
              >
                {st} {i <= activeStageIdx ? '✓' : '...'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-5 rounded-2xl border border-red-800 bg-red-50 text-red-950 text-xs sm:text-sm flex items-center gap-3 max-w-3xl mx-auto">
          <AlertTriangle className="h-5 w-5 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================================================
          4. HINDSIGHT SYNTHESIS & RECALLED MEMORY
         ========================================================================= */}
      {askResult && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Synthesized Response Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[#B8A48D] bg-[#FBF9F5] shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#342F2A] text-[#F3F0E9]">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#342F2A]">
                  Organizational Memory Synthesis
                </h3>
              </div>

              {askResult.gemini_reasoning_used && (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-[10px] font-mono font-bold">
                  Gemini Grounded Reasoning Active
                </span>
              )}
            </div>

            <div className="text-sm sm:text-base text-[#342F2A] leading-relaxed whitespace-pre-wrap font-light">
              {askResult.answer}
            </div>

            {/* Why This / Outcome Breakdown */}
            {(askResult.why || askResult.outcome) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#B8A48D]/30 text-xs">
                {askResult.why && (
                  <div className="p-4 rounded-xl bg-[#E8DED2]/40 border border-[#B8A48D]/40 space-y-1">
                    <span className="font-mono font-bold text-[#5B5045] uppercase text-[10px]">
                      Why This Experience Matters:
                    </span>
                    <p className="text-[#342F2A] leading-relaxed">{askResult.why}</p>
                  </div>
                )}
                {askResult.outcome && (
                  <div className="p-4 rounded-xl bg-[#E8DED2]/40 border border-[#B8A48D]/40 space-y-1">
                    <span className="font-mono font-bold text-[#5B5045] uppercase text-[10px]">
                      Documented Historical Outcome:
                    </span>
                    <p className="text-[#342F2A] leading-relaxed">{askResult.outcome}</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Launchers for 3D Project, Video, and 3D Mind Map */}
            {blueprint && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#B8A48D]/40">
                <span className="text-xs font-mono text-[#5B5045] font-semibold">
                  Grounded Project Assets Ready:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowWalkthroughModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-300" />
                    <span>Show 3D Project</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveViewMode('video');
                      const vidEl = document.getElementById('project-video-section');
                      vidEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#D4C3B3] text-[#342F2A] text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Film className="h-3.5 w-3.5 text-[#5B5045]" />
                    <span>Show Video Experience</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveViewMode('mindmap');
                      const mmEl = document.getElementById('project-mindmap-section');
                      mmEl?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#D4C3B3] text-[#342F2A] text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    <span>3D Memory Map</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              5. HINDSIGHT MEMORY JOURNEY (Horizontal 3D Nodes)
             ========================================================================= */}
          <MemoryJourney3D
            query={submittedQuery}
            onSelectPerson={onOpenPersonDetail}
            recalledFactsCount={askResult.evidence?.length || 4}
          />
        </div>
      )}

      {/* =========================================================================
          6. PROJECT PROTOTYPE, VIDEO STORYBOARD & 3D MIND MAP (When blueprint generated)
         ========================================================================= */}
      {blueprint && !loading && (
        <div className="space-y-10 animate-fade-in pt-4">
          {/* View Switcher Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#B8A48D]/40 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                Project Architect Suite
              </span>
              <h3 className="font-heading text-2xl font-extrabold text-[#342F2A]">
                {blueprint.project_understanding?.project_name || 'Project Blueprint'}
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-[#E8DED2]/60 p-1 rounded-2xl border border-[#B8A48D]/40">
              <button
                onClick={() => setActiveViewMode('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'all'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                Complete Suite
              </button>

              <button
                onClick={() => setActiveViewMode('prototype')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'prototype'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                11-Stage Prototype
              </button>

              <button
                onClick={() => setActiveViewMode('video')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'video'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                Video Player
              </button>

              <button
                onClick={() => setActiveViewMode('mindmap')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeViewMode === 'mindmap'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                3D Mind Map
              </button>
            </div>
          </div>

          {/* Section: 11-Stage Interactive Prototype */}
          {(activeViewMode === 'all' || activeViewMode === 'prototype') && (
            <VisualProjectPrototype
              blueprint={blueprint}
              onOpenPerson={onOpenPersonDetail}
              onLaunchWalkthrough={() => setShowWalkthroughModal(true)}
              onLaunchVideoStoryboard={() => setActiveViewMode('video')}
            />
          )}

          {/* Section: Storyboard & 3D Video Player */}
          {(activeViewMode === 'all' || activeViewMode === 'video') && (
            <div id="project-video-section">
              <ProjectVideoPlayer
                blueprint={blueprint}
                onOpenPerson={onOpenPersonDetail}
              />
            </div>
          )}

          {/* Section: Interactive 3D Project Mind Map */}
          {(activeViewMode === 'all' || activeViewMode === 'mindmap') && blueprint.mindmap && (
            <div id="project-mindmap-section" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                  Interactive 3D Spatial Knowledge Mind Map
                </span>
                <span className="text-xs text-[#7E7266] font-mono">
                  Drag to rotate · Scroll to zoom &amp; modulate depth · Click node to fly in
                </span>
              </div>
              <ProjectMindMap3D
                nodes={blueprint.mindmap.nodes}
                links={blueprint.mindmap.links}
                projectName={blueprint.project_understanding?.project_name}
                onSelectPerson={onOpenPersonDetail}
              />
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          7. CINEMATIC 3D WALKTHROUGH MODAL ("Show me the project")
         ========================================================================= */}
      {showWalkthroughModal && blueprint && (
        <CinematicWalkthroughModal
          blueprint={blueprint}
          onClose={() => setShowWalkthroughModal(false)}
        />
      )}

      {/* =========================================================================
          8. LIVE HINDSIGHT LEARNING LOOP DEMONSTRATION MODAL
         ========================================================================= */}
      <LearningLoopModal
        isOpen={showLearningLoopModal}
        onClose={() => setShowLearningLoopModal(false)}
        onApplyAfterQuery={(q) => {
          setQuery(q);
          executeAsk(q);
        }}
      />
    </div>
  );
};
