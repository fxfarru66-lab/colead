import React, { useState, useEffect } from 'react';
import { ProjectArchitectBlueprint } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  CreditCard,
  Truck,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Award,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface CinematicWalkthroughModalProps {
  blueprint: ProjectArchitectBlueprint;
  onClose: () => void;
}

export const CinematicWalkthroughModal: React.FC<CinematicWalkthroughModalProps> = ({
  blueprint,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const {
    project_understanding,
    suggested_contributors = [],
    historical_lessons = [],
  } = blueprint;

  const projectName = project_understanding?.project_name || 'Project Blueprint';

  const scenes = [
    {
      stage: '01',
      title: 'Project Initiation & Purpose',
      subtitle: 'The Vision Grounded in Organizational Intent',
      icon: Sparkles,
      color: 'from-amber-900/30 to-amber-950/40',
      description: project_understanding?.purpose || 'Building next-generation digital experience powered by institutional knowledge.',
      narration: `Initiating architectural blueprint for ${projectName}. Designed to solve core customer workflows while preserving operational context.`,
      visualDetails: [
        `Project Name: ${projectName}`,
        `Target Audience: ${project_understanding?.target_users || 'Enterprise teams & consumers'}`,
        `Outcomes: ${project_understanding?.expected_outcomes || 'Seamless digital operations'}`,
      ],
    },
    {
      stage: '02',
      title: 'Storefront & Customer Discovery',
      subtitle: 'Dynamic & Accessible User Interface',
      icon: Layers,
      color: 'from-blue-900/30 to-blue-950/40',
      description: 'Customer browses high-performance React catalog with faceted search and sub-60fps fluid transitions.',
      narration: 'The storefront applies Alex Chen and Priya Sharma’s WCAG 2.1 AA accessible component tokens, ensuring universal accessibility.',
      visualDetails: [
        'Dynamic search with sub-50ms autocomplete',
        'Hardware-accelerated mobile animations',
        'Design token parity across web and mobile',
      ],
    },
    {
      stage: '03',
      title: 'Stripe Idempotent Checkout',
      subtitle: 'Zero Duplicate Transaction Guarantee',
      icon: CreditCard,
      color: 'from-purple-900/30 to-purple-950/40',
      description: 'Stripe payment flow engineered with distributed Redis mutex locking and SHA-256 cart payload deduplication.',
      narration: 'Applying historical lessons from PR #1428 by Daniel Ortiz, eliminating double charges during seasonal payment surges.',
      visualDetails: [
        'Stripe Elements 3D Secure verification',
        'Distributed Redis mutex transaction lock',
        'Atomic ledger updates in SQLite database',
      ],
    },
    {
      stage: '04',
      title: 'Live Real-Time Courier Telemetry',
      subtitle: 'Sub-80ms Order Tracking Pipeline',
      icon: Truck,
      color: 'from-emerald-900/30 to-emerald-950/40',
      description: 'Real-time WebSocket connection maps delivery progress with live courier geolocation updates.',
      narration: 'Real-time event streaming pipeline engineered by Marcus Chen, streaming change-data events into live customer map views.',
      visualDetails: [
        'Active WebSocket push notifications',
        'Sub-80ms normalized CDC event pipeline',
        'Live courier ETA milestone stepper',
      ],
    },
    {
      stage: '05',
      title: 'Executive Admin Command Hub',
      subtitle: 'Operations, Settlements & Team Attribution',
      icon: LayoutDashboard,
      color: 'from-indigo-900/30 to-indigo-950/40',
      description: 'Comprehensive administration cockpit monitoring GMV, order dispatches, inventory mutex, and team attribution.',
      narration: 'Executive dashboards provide real-time operational visibility while attributing work directly to the contributors who built it.',
      visualDetails: [
        'Aggregated GraphQL query resolvers',
        'Automated inventory threshold alerts',
        'Persistent memory retention into Hindsight Cloud',
      ],
    },
    {
      stage: '06',
      title: 'Documented Contributor Team',
      subtitle: 'Evidence-Backed Role Matching',
      icon: Users,
      color: 'from-amber-900/30 to-amber-950/40',
      description: `CoLead matched ${suggested_contributors.length} key contributors based on verified past project contributions.`,
      narration: `Team members include ${suggested_contributors.slice(0, 3).map((s) => `${s.person_name} as ${s.role_name}`).join(', ')}.`,
      visualDetails: suggested_contributors.slice(0, 4).map((s) => `${s.person_name} — ${s.role_name}`),
    },
    {
      stage: '07',
      title: 'Institutional Memory Applied',
      subtitle: 'Better Decisions from Past Experience',
      icon: ShieldCheck,
      color: 'from-purple-900/30 to-purple-950/40',
      description: `Integrated ${historical_lessons.length} documented lessons from previous projects into preventative roadmap milestones.`,
      narration: 'Every decision is protected by organizational memory, ensuring past mistakes are prevented and successes repeated.',
      visualDetails: historical_lessons.slice(0, 3).map((l) => `${l.category}: ${l.proven_solution}`),
    },
  ];

  // Auto-play stepper with speech narration
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (voiceEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(scenes[currentStep].narration);
        utter.rate = 1.0;
        utter.onend = () => {
          if (isPlaying) {
            timer = setTimeout(() => {
              if (currentStep < scenes.length - 1) {
                setCurrentStep((prev) => prev + 1);
              } else {
                setIsPlaying(false);
              }
            }, 1000);
          }
        };
        window.speechSynthesis.speak(utter);
      } else {
        timer = setTimeout(() => {
          if (currentStep < scenes.length - 1) {
            setCurrentStep((prev) => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, 5000);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentStep, voiceEnabled]);

  const activeScene = scenes[currentStep];
  const Icon = activeScene.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#342F2A]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[#B8A48D] bg-[#FBF9F5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#342F2A]">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#B8A48D]/40 bg-[#E8DED2]/60">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-[#342F2A] text-[#F3F0E9] text-[10px] font-mono font-bold">
              3D CINEMATIC PROTOTYPE
            </span>
            <span className="text-xs font-mono text-[#5B5045]">
              Scene {activeScene.stage} of {scenes.length.toString().padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                voiceEnabled ? 'bg-[#342F2A] text-[#F3F0E9] border-[#342F2A]' : 'bg-[#FBF9F5] text-[#7E7266] border-[#B8A48D]'
              }`}
              title={voiceEnabled ? 'Mute voiceover' : 'Enable voiceover'}
            >
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FBF9F5] hover:bg-rose-100 text-[#342F2A] hover:text-rose-700 border border-[#B8A48D] transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 3D Scene Viewport */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6 perspective-1000">
          <div className="rounded-2xl border border-[#B8A48D]/70 bg-gradient-to-br from-[#F3F0E9] to-[#E8DED2]/50 p-6 sm:p-8 shadow-xl space-y-6 transform transition-all duration-500 hover:rotate-x-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#342F2A] text-[#F3F0E9] shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                    {activeScene.subtitle}
                  </span>
                  <h3 className="font-heading text-xl sm:text-3xl font-extrabold text-[#342F2A] tracking-tight">
                    {activeScene.title}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#342F2A] leading-relaxed font-light">
              {activeScene.description}
            </p>

            {/* Visual Specs / Key Elements Card */}
            <div className="p-5 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/50 space-y-3">
              <span className="text-[11px] font-mono font-bold text-[#5B5045] uppercase tracking-wider">
                Key Architectural Elements
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activeScene.visualDetails.map((det, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#E8DED2]/40 border border-[#B8A48D]/30 text-xs text-[#342F2A]">
                    {det}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Playback Scrubber & Navigation */}
        <div className="px-6 py-4 border-t border-[#B8A48D]/40 bg-[#E8DED2]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-xl border border-[#B8A48D] bg-[#FBF9F5] text-[#342F2A] hover:bg-[#E8DED2] disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#342F2A] text-[#F3F0E9] hover:bg-[#5B5045] text-xs font-semibold cursor-pointer shadow-sm"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Auto Play</span>
                </>
              )}
            </button>

            <button
              onClick={() => setCurrentStep((prev) => Math.min(scenes.length - 1, prev + 1))}
              disabled={currentStep === scenes.length - 1}
              className="p-2 rounded-xl border border-[#B8A48D] bg-[#FBF9F5] text-[#342F2A] hover:bg-[#E8DED2] disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Scene Dots */}
          <div className="flex items-center gap-1.5">
            {scenes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx ? 'w-6 bg-[#342F2A]' : 'w-2 bg-[#B8A48D]/60 hover:bg-[#B8A48D]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
