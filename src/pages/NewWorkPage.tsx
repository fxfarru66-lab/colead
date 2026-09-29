import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import {
  ProjectArchitectBlueprint,
  ProjectArchitectState,
  Project,
  Team,
  PageId,
  SuggestedContributor,
  RoadmapPhase,
  HistoricalLesson,
} from '../types';
import { ProjectMindMap3D } from '../components/ProjectMindMap3D';
import {
  Sparkles,
  Compass,
  Layers,
  Users,
  ShieldCheck,
  Milestone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Printer,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Brain,
  Activity,
  History,
  Send,
  Plus,
  Zap,
  Info,
  BookOpen
} from 'lucide-react';

interface NewWorkPageProps {
  onNavigate: (page: PageId) => void;
  onOpenPersonDetail?: (personId: string) => void;
}

export const NewWorkPage: React.FC<NewWorkPageProps> = ({
  onNavigate,
  onOpenPersonDetail,
}) => {
  // Main Mode: 'architect' | 'manual'
  const [activeMode, setActiveMode] = useState<'architect' | 'manual'>('architect');

  // Architect Input & States
  const [projectPrompt, setProjectPrompt] = useState('');
  const [planning, setPlanning] = useState(false);
  const [planStage, setPlanStage] = useState<number>(0);
  const [blueprint, setBlueprint] = useState<ProjectArchitectBlueprint | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retaining, setRetaining] = useState(false);
  const [retainedSuccess, setRetainedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'roadmap' | 'team' | 'mindmap' | 'lessons' | 'state'>('blueprint');
  const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);

  // Manual Form States
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [workTitle, setWorkTitle] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [techStack, setTechStack] = useState('React, TypeScript, Node.js');
  const [skillsReq, setSkillsReq] = useState('UI Components, API Integration');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);

  // Learning Demo State
  const [learningDemoStep, setLearningDemoStep] = useState<number>(1);
  const [demoQueryResponse, setDemoQueryResponse] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [projList, teamList] = await Promise.all([
          apiService.getProjects(),
          apiService.getTeams(),
        ]);
        setProjects(projList);
        setTeams(teamList);
        if (projList.length > 0) setSelectedProjectId(projList[0].id);
      } catch (err) {
        console.warn('Metadata loading notice:', err);
      }
    }
    loadMetadata();
  }, []);

  const examplePrompts = [
    'I want to build an e-commerce platform with React, Node.js, Stripe payments, real-time order tracking, and an admin dashboard.',
    'Build an AI customer-support platform with React, Python, RAG vector memory, PostgreSQL, and WhatsApp integration.',
    'Architect a multi-region cloud failover and telemetry system with sub-30s recovery and zero data loss.',
    'Create a distributed microservice authentication system with silent token rotation and CSRF protection.',
  ];

  const handleBuildBlueprint = async (customPrompt?: string) => {
    const queryToUse = customPrompt || projectPrompt;
    if (!queryToUse.trim()) {
      setErrorMsg('Please describe what you want to build.');
      return;
    }

    setPlanning(true);
    setErrorMsg(null);
    setRetainedSuccess(false);
    setPlanStage(1);

    // Subtle stepped progress tracking matching real stages
    const stageTimer1 = setTimeout(() => setPlanStage(2), 500);
    const stageTimer2 = setTimeout(() => setPlanStage(3), 1100);
    const stageTimer3 = setTimeout(() => setPlanStage(4), 1800);

    try {
      const res = await apiService.planProjectArchitect(queryToUse.trim());
      setPlanStage(5);
      setBlueprint(res);
      setActiveTab('blueprint');
    } catch (err: any) {
      console.error('[Project Architect Error]', err);
      setErrorMsg(err.message || 'Failed to generate project blueprint. Please try again.');
    } finally {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setPlanning(false);
    }
  };

  const handleRetainToHindsight = async () => {
    if (!blueprint) return;
    setRetaining(true);
    try {
      await apiService.retainProjectBlueprint(blueprint);
      setRetainedSuccess(true);
    } catch (err: any) {
      console.error('[Retain Blueprint Error]', err);
      setErrorMsg(err.message || 'Failed to retain blueprint in Hindsight memory.');
    } finally {
      setRetaining(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim() || !workDesc.trim() || !selectedProjectId) {
      setErrorMsg('Please provide a title, description, and project.');
      return;
    }
    setManualSubmitting(true);
    setErrorMsg(null);
    try {
      await apiService.createWorkRecord({
        project_id: selectedProjectId,
        title: workTitle.trim(),
        summary: workDesc.trim(),
        problem_statement: `Scope: ${workDesc.trim()}. Required skills: ${skillsReq}.`,
        technical_decision: `Architectural mandate: Built with ${techStack}.`,
        outcome: `Cataloged for active project delivery.`,
        technology: techStack.trim(),
      });
      setManualSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register work record');
    } finally {
      setManualSubmitting(false);
    }
  };

  const handlePrintBlueprint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-10 animate-fade-in text-[#342F2A]">
      {/* =========================================================================
          TOP HEADER & MODE SWITCHER
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B8A48D]/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#B8A48D] bg-[#E8DED2] text-[11px] font-mono tracking-widest text-[#5B5045] uppercase font-bold mb-2">
            <Brain className="h-3.5 w-3.5 text-[#5B5045]" />
            <span>CoLead Project Architect Agent</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
            Project Architect & Experience Planner
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5045] max-w-2xl mt-1 leading-relaxed">
            Describe what you want to build. CoLead recalls organizational memory, surfaces historical lessons, recommends proven contributors, and generates an actionable project blueprint.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#E8DED2] border border-[#B8A48D]/50 self-start md:self-auto">
          <button
            onClick={() => setActiveMode('architect')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'architect'
                ? 'bg-[#342F2A] text-[#F3F0E9] shadow-sm'
                : 'text-[#5B5045] hover:text-[#342F2A]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Project Architect</span>
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'manual'
                ? 'bg-[#342F2A] text-[#F3F0E9] shadow-sm'
                : 'text-[#5B5045] hover:text-[#342F2A]'
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record Work Item</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-800 bg-red-100 p-4 text-xs text-red-900 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-red-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* =========================================================================
          MODE 1: AI PROJECT ARCHITECT AGENT
         ========================================================================= */}
      {activeMode === 'architect' && (
        <div className="space-y-10">
          {/* Natural Language Prompt Card */}
          <div className="rounded-3xl border border-[#B8A48D]/60 bg-[#E8DED2]/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <label className="block font-serif text-2xl font-bold text-[#342F2A]">
                What do you want to build?
              </label>
              <p className="text-xs text-[#5B5045]">
                Describe the product, problem, users, technology, goals, or anything you already know.
              </p>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                value={projectPrompt}
                onChange={(e) => setProjectPrompt(e.target.value)}
                placeholder="e.g. We want to build an AI customer-support platform with React, Python, RAG, PostgreSQL, and WhatsApp integration."
                className="w-full rounded-2xl border border-[#B8A48D] bg-[#F3F0E9] p-4 text-sm text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] focus:ring-1 focus:ring-[#342F2A] shadow-inner font-sans leading-relaxed"
                disabled={planning}
              />
            </div>

            {/* Example Prompt Chips */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#7E7266] font-semibold">
                Or choose an architectural prompt:
              </div>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProjectPrompt(promptText);
                      handleBuildBlueprint(promptText);
                    }}
                    className="text-left text-xs px-3 py-1.5 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] hover:bg-[#E8DED2] text-[#5B5045] hover:text-[#342F2A] transition-all cursor-pointer truncate max-w-md"
                  >
                    "{promptText.slice(0, 55)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Action Button & Subtle Real Progress */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#B8A48D]/30">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleBuildBlueprint()}
                  disabled={planning || !projectPrompt.trim()}
                  className="px-6 py-3 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] disabled:opacity-50 text-sm font-semibold text-[#F3F0E9] transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {planning ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-amber-300" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-amber-300" />
                  )}
                  <span>{planning ? 'Synthesizing Architecture...' : 'Build Project Blueprint'}</span>
                </button>
              </div>

              {/* Real Agent Reasoning Stages */}
              {planning && (
                <div className="flex items-center gap-3 text-xs font-mono text-[#5B5045] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {planStage === 1 && <span>UNDERSTANDING PROJECT INTENT & REQUIREMENTS...</span>}
                  {planStage === 2 && <span>IDENTIFYING REQUIRED ROLES & SKILLS...</span>}
                  {planStage === 3 && <span>RECALLING HINDSIGHT ORGANIZATIONAL MEMORY...</span>}
                  {planStage === 4 && <span>SYNTHESIZING HISTORICAL LESSONS & RISKS...</span>}
                  {planStage === 5 && <span>BUILDING 3D PROJECT MIND MAP & ROADMAP...</span>}
                </div>
              )}
            </div>
          </div>

          {/* =========================================================================
              GENERATED PROJECT BLUEPRINT & MIND MAP
             ========================================================================= */}
          {blueprint && (
            <div className="space-y-8 animate-fade-in">
              {/* Executive Header Banner */}
              <div className="rounded-3xl border border-[#B8A48D] bg-[#F3F0E9] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#B8A48D]/40 pb-5">
                  <div>
                    <div className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full mb-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Blueprint Synthesized with Hindsight Memory & Gemini</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#342F2A]">
                      {blueprint.project_understanding.project_name}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5B5045] mt-1 font-light leading-relaxed max-w-3xl">
                      {blueprint.project_understanding.purpose}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-start md:self-auto">
                    <button
                      onClick={handlePrintBlueprint}
                      className="px-3.5 py-2 rounded-xl border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#F3F0E9] text-xs font-semibold text-[#342F2A] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      title="Print or Export PDF"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Export / Print</span>
                    </button>
                    <button
                      onClick={handleRetainToHindsight}
                      disabled={retaining || retainedSuccess}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                        retainedSuccess
                          ? 'bg-emerald-800 text-white cursor-default'
                          : 'bg-[#342F2A] hover:bg-[#5B5045] text-white cursor-pointer'
                      }`}
                    >
                      {retaining ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : retainedSuccess ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <Database className="h-3.5 w-3.5 text-amber-300" />
                      )}
                      <span>{retainedSuccess ? 'Retained to Hindsight' : 'Retain Blueprint'}</span>
                    </button>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-medium">
                  {[
                    { id: 'blueprint', label: 'Overview & Requirements', icon: Compass },
                    { id: 'team', label: `Relevant People (${blueprint.suggested_contributors.length})`, icon: Users },
                    { id: 'roadmap', label: `Roadmap (${blueprint.roadmap.length} Phases)`, icon: Milestone },
                    { id: 'mindmap', label: '3D Experience Map', icon: Sparkles },
                    { id: 'lessons', label: `Historical Lessons (${blueprint.historical_lessons.length})`, icon: History },
                    { id: 'state', label: 'Project Progress State', icon: Activity },
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                          isActive
                            ? 'bg-[#342F2A] text-[#F3F0E9] font-bold shadow-sm'
                            : 'bg-[#E8DED2]/80 hover:bg-[#E8DED2] text-[#5B5045] hover:text-[#342F2A]'
                        }`}
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =========================================================================
                  TAB 1: OVERVIEW & STRUCTURED REQUIREMENTS
                 ========================================================================= */}
              {activeTab === 'blueprint' && (
                <div className="space-y-8 animate-fade-in">
                  {blueprint.executive_summary && (
                    <div className="rounded-2xl border border-amber-900/30 bg-amber-50/70 p-6 space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-amber-900 font-bold flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                        <span>Executive Synthesis</span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-950 font-sans leading-relaxed">
                        {blueprint.executive_summary}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Purpose & Target Users */}
                    <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/60 p-6 space-y-4">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold">
                          Project Purpose
                        </h3>
                        <p className="text-xs text-[#342F2A] mt-1 leading-relaxed">
                          {blueprint.project_understanding.purpose}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold">
                          Target Users & Stakeholders
                        </h3>
                        <p className="text-xs text-[#342F2A] mt-1 leading-relaxed">
                          {blueprint.project_understanding.target_users}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold">
                          Expected Outcomes
                        </h3>
                        <p className="text-xs text-[#342F2A] mt-1 leading-relaxed">
                          {blueprint.project_understanding.expected_outcomes}
                        </p>
                      </div>
                    </div>

                    {/* Capabilities & Tech Stack */}
                    <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/60 p-6 space-y-4">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold mb-2">
                          Required Capabilities
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {blueprint.project_understanding.required_capabilities.map((cap, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#F3F0E9] border border-[#B8A48D] text-[#342F2A] font-medium">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold mb-2">
                          Technical Requirements
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {blueprint.project_understanding.technical_requirements.map((req, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#F3F0E9] border border-[#B8A48D] text-[#342F2A] font-medium">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold mb-2">
                          Integrations & APIs
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {blueprint.project_understanding.integrations.map((integ, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#342F2A] text-[#F3F0E9] font-medium">
                              {integ}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Potential Risks & Unknowns */}
                  <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/60 p-6 space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#7E7266] font-bold">
                      Identified Risk Vectors & Clarifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-[#F3F0E9] border border-[#B8A48D]/60 space-y-2">
                        <div className="font-semibold text-rose-900 flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-700" />
                          <span>Potential Architectural Risks</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-[#5B5045]">
                          {blueprint.project_understanding.potential_risks.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-[#F3F0E9] border border-[#B8A48D]/60 space-y-2">
                        <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5 text-amber-700" />
                          <span>Scope Clarifications to Address in Phase 01</span>
                        </div>
                        <p className="text-[#5B5045] leading-relaxed">
                          {blueprint.project_understanding.unknown_information}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 2: RELEVANT PEOPLE & EXPLAINABLE SUGGESTIONS
                 ========================================================================= */}
              {activeTab === 'team' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-[#E8DED2]/60 border border-[#B8A48D]/40 text-xs text-[#5B5045] leading-relaxed">
                    <span className="font-bold text-[#342F2A]">Evidence-Based Recommendations:</span> CoLead suggests team members strictly based on documented project history, verified contribution counts, and problem-solving records in the institutional database.
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {blueprint.suggested_contributors.map((contrib, idx) => {
                      const isExpanded = expandedPersonId === contrib.person_id;
                      const act = contrib.contribution_activity;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/70 p-6 space-y-5 shadow-sm hover:border-[#342F2A] transition-all"
                        >
                          {/* Role Header */}
                          <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-3">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-[#7E7266] font-bold">
                              {contrib.role_name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F0E9] border border-[#B8A48D] text-[#5B5045] font-semibold">
                              {contrib.role_category}
                            </span>
                          </div>

                          {/* Person Identity */}
                          <div className="flex items-center gap-3">
                            <img
                              src={contrib.person_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={contrib.person_name}
                              className="w-12 h-12 rounded-full object-cover border border-[#B8A48D] shadow-sm"
                            />
                            <div>
                              <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                                {contrib.person_name}
                              </h3>
                              <p className="text-xs text-[#5B5045]">{contrib.person_role} • {contrib.team_name}</p>
                            </div>
                          </div>

                          {/* Factual Contribution Activity Metrics */}
                          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-[#F3F0E9] border border-[#B8A48D]/40 text-xs">
                            <div>
                              <div className="font-serif text-base font-bold text-[#342F2A]">
                                {act.projects_contributed_to}
                              </div>
                              <div className="text-[10px] text-[#7E7266] uppercase font-mono">Projects</div>
                            </div>
                            <div>
                              <div className="font-serif text-base font-bold text-[#342F2A]">
                                {act.documented_contributions}
                              </div>
                              <div className="text-[10px] text-[#7E7266] uppercase font-mono">Contributions</div>
                            </div>
                            <div>
                              <div className="font-serif text-base font-bold text-[#342F2A]">
                                {act.problems_solved}
                              </div>
                              <div className="text-[10px] text-[#7E7266] uppercase font-mono">Problems Solved</div>
                            </div>
                          </div>

                          {/* Neutral Why Suggested Rationale */}
                          <div className="space-y-1.5 text-xs">
                            <div className="font-semibold text-[#342F2A] flex items-center gap-1.5">
                              <Brain className="h-3.5 w-3.5 text-amber-700" />
                              <span>Why CoLead Suggested {contrib.person_name}:</span>
                            </div>
                            <p className="text-[#5B5045] leading-relaxed bg-[#F3F0E9]/60 p-3 rounded-xl border border-[#B8A48D]/30">
                              {contrib.why_suggested}
                            </p>
                          </div>

                          {/* Expandable Evidence */}
                          <div>
                            <button
                              type="button"
                              onClick={() => setExpandedPersonId(isExpanded ? null : contrib.person_id)}
                              className="w-full flex items-center justify-between text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] py-1 cursor-pointer"
                            >
                              <span>View Documented Evidence ({contrib.evidence.length} Records)</span>
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 space-y-3 pt-3 border-t border-[#B8A48D]/30 animate-fade-in">
                                {contrib.evidence.map((ev, ei) => (
                                  <div key={ei} className="p-3 rounded-xl bg-[#F3F0E9] border border-[#B8A48D]/40 text-xs space-y-1">
                                    <div className="flex items-center justify-between font-semibold text-[#342F2A]">
                                      <span>{ev.project_name}</span>
                                      <span className="text-[10px] font-mono text-[#7E7266]">{ev.date}</span>
                                    </div>
                                    <div className="text-[11px] text-[#5B5045] font-medium">{ev.contribution_title}</div>
                                    {ev.problem_solved && (
                                      <div className="text-[11px] text-[#7E7266]"><span className="font-semibold">Problem:</span> {ev.problem_solved}</div>
                                    )}
                                    {ev.outcome && (
                                      <div className="text-[11px] text-emerald-800 font-semibold"><span className="font-semibold">Outcome:</span> {ev.outcome}</div>
                                    )}
                                  </div>
                                ))}

                                {onOpenPersonDetail && (
                                  <button
                                    onClick={() => onOpenPersonDetail(contrib.person_id)}
                                    className="w-full text-center text-xs text-[#342F2A] hover:underline font-semibold pt-1 cursor-pointer"
                                  >
                                    Open Full Contributor Profile →
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 3: MEMORY-AWARE ROADMAP
                 ========================================================================= */}
              {activeTab === 'roadmap' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-[#E8DED2]/60 border border-[#B8A48D]/40 text-xs text-[#5B5045] leading-relaxed">
                    <span className="font-bold text-[#342F2A]">Memory-Aware Project Roadmap:</span> Each phase is dynamically connected to proven roles, suggested team members, and historical lessons recorded from past initiatives.
                  </div>

                  <div className="space-y-4">
                    {blueprint.roadmap.map((phase, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/70 p-6 space-y-4 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B8A48D]/30 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#342F2A] text-[#F3F0E9]">
                              {phase.phase_number}
                            </span>
                            <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                              {phase.phase_name}
                            </h3>
                          </div>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#F3F0E9] border border-[#B8A48D] text-[#5B5045] font-semibold self-start sm:self-auto">
                            {phase.status}
                          </span>
                        </div>

                        <p className="text-xs text-[#5B5045] leading-relaxed">
                          <span className="font-semibold text-[#342F2A]">Objective:</span> {phase.objective}
                        </p>

                        {/* Tasks */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-[#7E7266] font-bold">
                            Key Deliverables & Tasks
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {phase.tasks.map((task, ti) => (
                              <div key={ti} className="p-2.5 rounded-xl bg-[#F3F0E9] border border-[#B8A48D]/40 text-xs text-[#342F2A] flex items-start gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Role & Contributor & Historical Lesson Callout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-3 rounded-xl bg-[#F3F0E9]/80 border border-[#B8A48D]/40">
                            <span className="text-[#7E7266] block text-[10px] font-mono uppercase">Assigned Role & Contributor</span>
                            <span className="font-semibold text-[#342F2A]">{phase.relevant_role}: {phase.suggested_contributor}</span>
                          </div>

                          {phase.historical_lesson && (
                            <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950">
                              <span className="text-amber-800 block text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                                <History className="h-3 w-3" />
                                <span>Applied Historical Lesson</span>
                              </span>
                              <span className="text-[11px] leading-tight block mt-0.5">{phase.historical_lesson}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 4: 3D EXPERIENCE MIND MAP
                 ========================================================================= */}
              {activeTab === 'mindmap' && (
                <div className="space-y-4 animate-fade-in">
                  <ProjectMindMap3D
                    nodes={blueprint.mindmap.nodes}
                    links={blueprint.mindmap.links}
                    projectName={blueprint.project_understanding.project_name}
                    onSelectPerson={onOpenPersonDetail}
                  />
                </div>
              )}

              {/* =========================================================================
                  TAB 5: HISTORICAL LESSONS & RISK MITIGATION
                 ========================================================================= */}
              {activeTab === 'lessons' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-[#E8DED2]/60 border border-[#B8A48D]/40 text-xs text-[#5B5045] leading-relaxed">
                    <span className="font-bold text-[#342F2A]">Organizational Learning Engine:</span> Previous projects encountered technical hurdles. CoLead recalls those problems and applies proven solutions to this new project.
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {blueprint.historical_lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/70 p-6 space-y-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-3">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-purple-700" />
                            <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                              {lesson.category}
                            </h3>
                          </div>
                          <span className="text-xs font-mono text-[#7E7266]">
                            From: {lesson.previous_project}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="p-3.5 rounded-xl bg-[#F3F0E9] border border-rose-200 space-y-1">
                            <span className="font-semibold text-rose-900 block text-[11px]">Historical Issue Encountered:</span>
                            <p className="text-[#5B5045] leading-relaxed">{lesson.historical_issue}</p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-[#F3F0E9] border border-emerald-200 space-y-1">
                            <span className="font-semibold text-emerald-900 block text-[11px]">Proven Solution Implemented:</span>
                            <p className="text-[#5B5045] leading-relaxed">{lesson.proven_solution}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-purple-50/90 border border-purple-300 text-xs space-y-1 text-purple-950">
                          <span className="font-bold text-purple-900 block text-[11px] uppercase tracking-wider font-mono">
                            Potential Application to This Project:
                          </span>
                          <p className="leading-relaxed">{lesson.potential_application}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 6: "WHERE ARE WE NOW?" PROJECT STATE & NEXT ACTIONS
                 ========================================================================= */}
              {activeTab === 'state' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Status Overview */}
                  <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/70 p-6 space-y-4 shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-[#342F2A]">
                      Where Are We Now?
                    </h3>
                    <p className="text-xs text-[#5B5045]">
                      {blueprint.current_state.status_summary}
                    </p>

                    {/* Progress Bars */}
                    <div className="space-y-3 pt-2">
                      {blueprint.current_state.progress_breakdown.map((track, ti) => (
                        <div key={ti} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#342F2A]">{track.track}</span>
                            <span className="font-mono text-[#5B5045]">{track.percentage}% ({track.status})</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#F3F0E9] border border-[#B8A48D]/40 overflow-hidden">
                            <div
                              className="h-full bg-[#342F2A] rounded-full transition-all duration-500"
                              style={{ width: `${track.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prioritized Next Actions */}
                  <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/70 p-6 space-y-4 shadow-sm">
                    <h3 className="font-serif text-xl font-bold text-[#342F2A] flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-600" />
                      <span>CoLead Next Recommended Actions</span>
                    </h3>

                    <div className="space-y-3">
                      {blueprint.current_state.next_actions.map((act, ai) => (
                        <div
                          key={ai}
                          className="p-4 rounded-xl bg-[#F3F0E9] border border-[#B8A48D]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-[#342F2A] flex items-center gap-2">
                              <span>{ai + 1}. {act.action}</span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                act.priority === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {act.priority} Priority
                              </span>
                            </div>
                            <p className="text-[#5B5045]">{act.reason}</p>
                          </div>
                          {act.owner && (
                            <span className="text-[11px] font-mono text-[#7E7266] shrink-0 bg-[#E8DED2] px-2.5 py-1 rounded-lg border border-[#B8A48D]/50 self-start sm:self-auto">
                              Owner: {act.owner}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: RECORD SINGLE WORK ITEM
         ========================================================================= */}
      {activeMode === 'manual' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          {manualSuccess ? (
            <div className="rounded-3xl border border-[#B8A48D] bg-[#E8DED2] p-8 text-center space-y-4 shadow-sm animate-fade-in">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F0E9] border border-[#5B5045] text-[#342F2A]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#342F2A]">
                Work Record Successfully Cataloged
              </h3>
              <p className="text-xs text-[#5B5045] max-w-md mx-auto">
                This item has been retained into institutional memory and indexed for future project architecture matching.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('work-memory')}
                  className="px-5 py-2.5 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm cursor-pointer"
                >
                  View in Past Work
                </button>
                <button
                  onClick={() => {
                    setWorkTitle('');
                    setWorkDesc('');
                    setManualSuccess(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#B8A48D] bg-[#F3F0E9] hover:bg-[#E8DED2] text-xs font-semibold text-[#342F2A] transition-all"
                >
                  Create Another Record
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="rounded-3xl border border-[#B8A48D]/60 bg-[#E8DED2] p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#342F2A]">
                Catalog New Work Record
              </h2>
              <p className="text-xs text-[#5B5045]">
                Record specific initiatives or milestones into the organizational archive.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase">
                  Work Title *
                </label>
                <input
                  type="text"
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  placeholder="e.g. Distributed Idempotency Queue Broker"
                  className="w-full h-11 rounded-xl border border-[#B8A48D] bg-[#F3F0E9] px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase">
                  Associated Project *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full h-11 rounded-xl border border-[#B8A48D] bg-[#F3F0E9] px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase">
                  Summary & Technical Description *
                </label>
                <textarea
                  rows={4}
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                  placeholder="Describe the architectural objective, problem statement, and outcome..."
                  className="w-full rounded-xl border border-[#B8A48D] bg-[#F3F0E9] p-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase">
                    Technology Stack
                  </label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#B8A48D] bg-[#F3F0E9] px-3.5 text-xs text-[#342F2A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase">
                    Skills Required
                  </label>
                  <input
                    type="text"
                    value={skillsReq}
                    onChange={(e) => setSkillsReq(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#B8A48D] bg-[#F3F0E9] px-3.5 text-xs text-[#342F2A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={manualSubmitting}
                className="w-full py-3 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {manualSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>{manualSubmitting ? 'Registering...' : 'Catalog Work Record'}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
