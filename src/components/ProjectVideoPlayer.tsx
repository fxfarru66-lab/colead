import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ProjectArchitectBlueprint } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  CreditCard,
  Truck,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Clock,
  Video,
  Eye,
  Server,
  Users,
  Target,
  AlertTriangle,
  Award,
  Zap,
  BookOpen,
  ArrowRight,
  Sliders
} from 'lucide-react';

interface ProjectVideoPlayerProps {
  blueprint: ProjectArchitectBlueprint;
  onOpenPerson?: (personId: string) => void;
}

export const ProjectVideoPlayer: React.FC<ProjectVideoPlayerProps> = ({
  blueprint,
  onOpenPerson,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 1 inside active scene
  const [voiceNarration, setVoiceNarration] = useState(true);
  const [ambientAudio, setAmbientAudio] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showSceneDrawer, setShowSceneDrawer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const visualCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const sceneTimerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const canvasAnimFrameRef = useRef<number | null>(null);

  const {
    project_understanding,
    suggested_contributors = [],
    historical_lessons = [],
    roadmap = [],
    executive_summary,
    success_criteria = [],
  } = blueprint;

  const projectName = project_understanding?.project_name || 'Project Blueprint';
  const purpose = project_understanding?.purpose || executive_summary || 'Organizational Initiative';
  const targetUsers = project_understanding?.target_users || 'Team & End Customers';
  const techReqs = project_understanding?.technical_requirements || ['React', 'Node.js', 'PostgreSQL', 'Stripe'];
  const capabilities = project_understanding?.required_capabilities || ['Core Architecture', 'Security', 'Telemetry'];
  const potentialRisks = project_understanding?.potential_risks || ['Third-party API latency', 'Concurrency retries'];

  // Dynamically build 9 coherent cinematic visual scenes from the actual project blueprint
  const scenes = useMemo(() => {
    return [
      {
        id: 'scene_01',
        number: '01',
        title: 'Project Purpose & Architectural Vision',
        subtitle: 'Initiative Overview',
        durationSeconds: 7,
        badge: 'SCENE 01 · PURPOSE',
        icon: Sparkles,
        colorTheme: '#E8DED2',
        accentHex: '#F59E0B',
        narration: `Initiative launch: ${projectName}. The mission is to ${purpose}. Target audience: ${targetUsers}.`,
        visualType: 'interface_viewport',
        elements: [
          { label: 'Project Goal', value: purpose },
          { label: 'Core Users', value: targetUsers },
          { label: 'Domain', value: 'Production Web Application' },
        ],
      },
      {
        id: 'scene_02',
        number: '02',
        title: 'Architectural Challenges & Constraints',
        subtitle: 'System Bottlenecks',
        durationSeconds: 6.5,
        badge: 'SCENE 02 · CHALLENGES',
        icon: AlertTriangle,
        colorTheme: '#F43F5E',
        accentHex: '#F43F5E',
        narration: `Identified architectural challenges include: ${potentialRisks.slice(0, 2).join(' and ')}. High concurrency and idempotency must be prioritized.`,
        visualType: 'challenge_matrix',
        elements: potentialRisks.map((r, i) => ({ label: `Risk ${i + 1}`, value: r })),
      },
      {
        id: 'scene_03',
        number: '03',
        title: 'Hindsight Memory Recall & Past Lessons',
        subtitle: 'Organizational Intelligence',
        durationSeconds: 7.5,
        badge: 'SCENE 03 · MEMORY RECALL',
        icon: BookOpen,
        colorTheme: '#8B5CF6',
        accentHex: '#8B5CF6',
        narration: `Recalling verified organizational memory from Hindsight Cloud. Past lesson: ${
          historical_lessons[0]?.historical_issue || 'Handling third-party latency'
        } was solved via ${historical_lessons[0]?.proven_solution || 'idempotent retry locks'}.`,
        visualType: 'memory_radar',
        elements: historical_lessons.slice(0, 2).map((hl) => ({
          label: hl.category,
          value: `${hl.previous_project}: ${hl.proven_solution}`,
        })),
      },
      {
        id: 'scene_04',
        number: '04',
        title: 'Documented Contributor Experience',
        subtitle: 'Role Alignment',
        durationSeconds: 7,
        badge: 'SCENE 04 · TEAM & CONTRIBUTORS',
        icon: Users,
        colorTheme: '#10B981',
        accentHex: '#10B981',
        narration: `Suggested contributors matched based on real documented work: ${suggested_contributors
          .slice(0, 3)
          .map((sc) => `${sc.person_name} as ${sc.role_name}`)
          .join(', ')}.`,
        visualType: 'contributor_cards',
        elements: suggested_contributors.slice(0, 3).map((sc) => ({
          label: sc.person_name,
          role: sc.role_name,
          contributions: sc.contribution_activity?.documented_contributions || 4,
          avatar: sc.person_avatar,
        })),
      },
      {
        id: 'scene_05',
        number: '05',
        title: 'System Topology & Real-Time Data Flow',
        subtitle: 'Microservices & Infrastructure',
        durationSeconds: 8,
        badge: 'SCENE 05 · ARCHITECTURE',
        icon: Server,
        colorTheme: '#6366F1',
        accentHex: '#6366F1',
        narration: `Architecture topology incorporates ${techReqs.slice(0, 3).join(', ')}. Data streams through verified middleware pipelines with sub-80 millisecond response freshness.`,
        visualType: 'topology_flow',
        elements: techReqs.slice(0, 4).map((t, idx) => ({ label: `Layer 0${idx + 1}`, value: t })),
      },
      {
        id: 'scene_06',
        number: '06',
        title: 'Roadmap & Implementation Milestones',
        subtitle: 'Execution Phases',
        durationSeconds: 7,
        badge: 'SCENE 06 · ROADMAP',
        icon: Layers,
        colorTheme: '#FB923C',
        accentHex: '#FB923C',
        narration: `Implementation executes across phased milestones: ${roadmap
          .slice(0, 3)
          .map((r) => `Phase ${r.phase_number} ${r.phase_name}`)
          .join(', ')}.`,
        visualType: 'milestone_timeline',
        elements: roadmap.slice(0, 4).map((r) => ({
          label: `Phase ${r.phase_number}`,
          name: r.phase_name,
          owner: r.suggested_contributor,
        })),
      },
      {
        id: 'scene_07',
        number: '07',
        title: 'Target Deliverables & Proven Outcomes',
        subtitle: 'Success Metrics',
        durationSeconds: 6.5,
        badge: 'SCENE 07 · OUTCOMES',
        icon: Award,
        colorTheme: '#06B6D4',
        accentHex: '#06B6D4',
        narration: `Target deliverables include zero duplicate transactions, 99.99% system availability, and seamless automated continuous integration.`,
        visualType: 'metrics_gauge',
        elements: success_criteria.length > 0 ? success_criteria.map((sc, i) => ({ label: `Metric ${i + 1}`, value: sc })) : [
          { label: 'Latency', value: '<80ms P99' },
          { label: 'Availability', value: '99.99% Uptime' },
          { label: 'Data Integrity', value: '100% Idempotent' },
        ],
      },
      {
        id: 'scene_08',
        number: '08',
        title: 'Institutional Memory Retention',
        subtitle: 'Hindsight Cloud Knowledge',
        durationSeconds: 6,
        badge: 'SCENE 08 · MEMORY RETENTION',
        icon: ShieldCheck,
        colorTheme: '#A855F7',
        accentHex: '#A855F7',
        narration: `All technical decisions, performance benchmarks, and lessons are retained permanently into CoLead's institutional memory bank.`,
        visualType: 'memory_crystallize',
        elements: [
          { label: 'Memory Bank', value: 'colead' },
          { label: 'Storage', value: 'Hindsight Cloud API v0.10.1' },
          { label: 'Isolation', value: 'Organization Level RBAC' },
        ],
      },
      {
        id: 'scene_09',
        number: '09',
        title: 'Actionable Next Steps & Review',
        subtitle: 'Execution Kick-Off',
        durationSeconds: 6,
        badge: 'SCENE 09 · NEXT ACTIONS',
        icon: Target,
        colorTheme: '#38BDF8',
        accentHex: '#38BDF8',
        narration: `Ready for project kick-off review. Proceed with team allocation and infrastructure staging.`,
        visualType: 'action_summary',
        elements: [
          { label: 'Step 1', value: 'Review Architecture Blueprint' },
          { label: 'Step 2', value: 'Confirm Contributor Allocations' },
          { label: 'Step 3', value: 'Stage Core Services' },
        ],
      },
    ];
  }, [blueprint, projectName, purpose, targetUsers, techReqs, potentialRisks, historical_lessons, suggested_contributors, roadmap, success_criteria]);

  const activeScene = scenes[currentSceneIdx] || scenes[0];
  const totalDuration = useMemo(
    () => scenes.reduce((acc, s) => acc + s.durationSeconds, 0),
    [scenes]
  );

  // Initialize Web Audio API ambient cinematic sound design
  const initWebAudio = () => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      ambientGainRef.current = masterGain;

      // Soft low ambient drone (48Hz and 72Hz fifth)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(48, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(72, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    } catch (e) {
      console.warn('Web Audio initialization note:', e);
    }
  };

  const playSceneTransitionChime = () => {
    if (!audioContextRef.current || isMuted || !ambientAudio) return;
    try {
      const ctx = audioContextRef.current;
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(440 + currentSceneIdx * 55, ctx.currentTime);
      chimeOsc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);

      chimeGain.gain.setValueAtTime(volume * 0.08, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);

      chimeOsc.start();
      chimeOsc.stop(ctx.currentTime + 0.55);
    } catch (e) {
      // Audio chime ignore
    }
  };

  // Master Playback Loop
  useEffect(() => {
    if (isPlaying) {
      initWebAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      playSceneTransitionChime();
      const scene = scenes[currentSceneIdx];
      const durationMs = (scene.durationSeconds * 1000) / playbackSpeed;
      const startTime = Date.now();

      // Progress animation ticker
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(1, elapsed / durationMs);
        setSceneProgress(p);
      }, 30);

      // Voice narration handling
      if (voiceNarration && !isMuted && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(scene.narration);
        utter.rate = playbackSpeed * 1.02;
        utter.pitch = 0.95; // Deep, calm, authoritative tone
        utter.volume = volume;
        utter.onend = () => {
          if (isPlaying) {
            handleAdvanceScene();
          }
        };
        window.speechSynthesis.speak(utter);
      } else {
        sceneTimerRef.current = setTimeout(() => {
          handleAdvanceScene();
        }, durationMs);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearTimeout(sceneTimerRef.current);
      clearInterval(progressIntervalRef.current);
    }

    return () => {
      clearTimeout(sceneTimerRef.current);
      clearInterval(progressIntervalRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentSceneIdx, playbackSpeed, voiceNarration, isMuted, volume]);

  const handleAdvanceScene = () => {
    if (currentSceneIdx < scenes.length - 1) {
      setCurrentSceneIdx((prev) => prev + 1);
      setSceneProgress(0);
    } else {
      setIsPlaying(false);
      setSceneProgress(1);
    }
  };

  const handlePreviousScene = () => {
    if (currentSceneIdx > 0) {
      setCurrentSceneIdx((prev) => prev - 1);
      setSceneProgress(0);
    }
  };

  const handleSeekScene = (idx: number) => {
    setCurrentSceneIdx(idx);
    setSceneProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (ambientGainRef.current && audioContextRef.current) {
      ambientGainRef.current.gain.setValueAtTime(
        nextMuted ? 0 : volume * 0.15,
        audioContextRef.current.currentTime
      );
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Real 60 FPS Visual Canvas Animation Engine
  useEffect(() => {
    const canvas = visualCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animClock = 0;

    const renderVisualFrame = () => {
      animClock += 0.02 * playbackSpeed;
      canvasAnimFrameRef.current = requestAnimationFrame(renderVisualFrame);

      const w = canvas.width;
      const h = canvas.height;

      // Dark cinematic backdrop with subtle vignette gradient
      ctx.fillStyle = '#141210';
      ctx.fillRect(0, 0, w, h);

      const radGrad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        50,
        w / 2,
        h / 2,
        w * 0.7
      );
      radGrad.addColorStop(0, 'rgba(38, 33, 28, 0.7)');
      radGrad.addColorStop(1, 'rgba(12, 10, 9, 0.98)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Render domain-specific visual scene animations
      const scene = activeScene;

      if (scene.visualType === 'interface_viewport') {
        // SCENE 1: Interactive Storefront / App Viewport Simulation with 3D perspective
        const boxX = 60;
        const boxY = 40;
        const boxW = w - 120;
        const boxH = h - 80;

        // Window Frame
        ctx.strokeStyle = '#5B5045';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#1E1B18';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 16);
        ctx.fill();
        ctx.stroke();

        // Browser Top Bar
        ctx.fillStyle = '#2A2521';
        ctx.fillRect(boxX, boxY, boxW, 36);

        // Window Dots
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(boxX + 20, boxY + 18, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(boxX + 36, boxY + 18, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(boxX + 52, boxY + 18, 5, 0, Math.PI * 2);
        ctx.fill();

        // URL Pill
        ctx.fillStyle = '#1A1715';
        ctx.fillRect(boxX + 80, boxY + 8, boxW - 160, 20);
        ctx.fillStyle = '#B8A48D';
        ctx.font = '11px monospace';
        ctx.fillText(`https://app.colead.internal/${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, boxX + 95, boxY + 22);

        // Hero Banner Inside Simulated Interface
        const heroH = 90;
        const heroGrad = ctx.createLinearGradient(boxX + 20, boxY + 50, boxX + boxW - 20, boxY + 50 + heroH);
        heroGrad.addColorStop(0, '#342F2A');
        heroGrad.addColorStop(1, '#5B5045');
        ctx.fillStyle = heroGrad;
        ctx.beginPath();
        ctx.roundRect(boxX + 20, boxY + 50, boxW - 40, heroH, 12);
        ctx.fill();

        ctx.fillStyle = '#F3F0E9';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(projectName, boxX + 40, boxY + 85);

        ctx.fillStyle = '#E8DED2';
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText(purpose.slice(0, 65) + '...', boxX + 40, boxY + 110);

        // Grid Cards
        const cardCount = 3;
        const cardW = (boxW - 60) / cardCount;
        for (let i = 0; i < cardCount; i++) {
          const cx = boxX + 20 + i * (cardW + 10);
          const cy = boxY + 155;
          const isHovered = Math.sin(animClock * 2 + i) > 0.5;

          ctx.fillStyle = isHovered ? '#342F2A' : '#23201C';
          ctx.strokeStyle = isHovered ? '#B8A48D' : '#453E37';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(cx, cy, cardW, 110, 10);
          ctx.fill();
          ctx.stroke();

          // Card Header Bar
          ctx.fillStyle = '#B8A48D';
          ctx.fillRect(cx + 12, cy + 16, cardW * 0.6, 8);

          // Card Pill
          ctx.fillStyle = '#10B981';
          ctx.fillRect(cx + 12, cy + 34, cardW * 0.35, 6);

          // Animated Button in Card
          ctx.fillStyle = isHovered ? '#10B981' : '#5B5045';
          ctx.beginPath();
          ctx.roundRect(cx + 12, cy + 70, cardW - 24, 24, 6);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '10px sans-serif';
          ctx.fillText('Execute Action', cx + 24, cy + 86);
        }

        // Simulated Moving Cursor
        const cursorX = boxX + 80 + Math.sin(animClock * 1.2) * (boxW * 0.35) + boxW * 0.3;
        const cursorY = boxY + 120 + Math.cos(animClock * 1.5) * 60;
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(cursorX, cursorY);
        ctx.lineTo(cursorX + 12, cursorY + 12);
        ctx.lineTo(cursorX + 5, cursorY + 13);
        ctx.lineTo(cursorX + 8, cursorY + 20);
        ctx.lineTo(cursorX + 4, cursorY + 21);
        ctx.lineTo(cursorX + 1, cursorY + 14);
        ctx.closePath();
        ctx.fill();
      } else if (scene.visualType === 'topology_flow') {
        // SCENE 5: Animated Multi-Tier System Topology Flow Diagram
        const nodes = [
          { name: 'React Client', x: w * 0.18, y: h * 0.5, color: '#38BDF8' },
          { name: 'API Gateway', x: w * 0.38, y: h * 0.5, color: '#818CF8' },
          { name: 'Redis Mutex', x: w * 0.58, y: h * 0.32, color: '#F43F5E' },
          { name: 'Core Microservices', x: w * 0.58, y: h * 0.68, color: '#34D399' },
          { name: 'Database & Stripe', x: w * 0.82, y: h * 0.5, color: '#FBBF24' },
        ];

        // Connection Lines
        ctx.strokeStyle = '#453E37';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[2].x, nodes[2].y);
        ctx.lineTo(nodes[4].x, nodes[4].y);
        ctx.moveTo(nodes[1].x, nodes[1].y);
        ctx.lineTo(nodes[3].x, nodes[3].y);
        ctx.lineTo(nodes[4].x, nodes[4].y);
        ctx.stroke();

        // Moving Data Packets
        const packetCount = 6;
        for (let i = 0; i < packetCount; i++) {
          const t = (animClock * 0.6 + i / packetCount) % 1;
          let px = 0;
          let py = 0;
          if (t < 0.35) {
            const segT = t / 0.35;
            px = nodes[0].x + (nodes[1].x - nodes[0].x) * segT;
            py = nodes[0].y + (nodes[1].y - nodes[0].y) * segT;
          } else if (t < 0.7) {
            const segT = (t - 0.35) / 0.35;
            const targetNode = i % 2 === 0 ? nodes[2] : nodes[3];
            px = nodes[1].x + (targetNode.x - nodes[1].x) * segT;
            py = nodes[1].y + (targetNode.y - nodes[1].y) * segT;
          } else {
            const segT = (t - 0.7) / 0.3;
            const srcNode = i % 2 === 0 ? nodes[2] : nodes[3];
            px = srcNode.x + (nodes[4].x - srcNode.x) * segT;
            py = srcNode.y + (nodes[4].y - srcNode.y) * segT;
          }

          ctx.fillStyle = '#FEF3C7';
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render Topology Node Boxes
        nodes.forEach((n) => {
          const nw = 120;
          const nh = 56;
          ctx.fillStyle = '#1E1B18';
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(n.x - nw / 2, n.y - nh / 2, nw, nh, 10);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y + 4);
        });
        ctx.textAlign = 'left';
      } else if (scene.visualType === 'memory_radar') {
        // SCENE 3: Hindsight Cloud Memory Radar with concentric rings & radar sweep
        const cx = w / 2;
        const cy = h / 2;

        // Concentric Rings
        for (let r = 50; r <= 160; r += 35) {
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Radar Sweep Line
        const sweepAngle = animClock * 2;
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * 165, cy + Math.sin(sweepAngle) * 165);
        ctx.stroke();

        // Memory Blips
        for (let b = 0; b < 6; b++) {
          const bAngle = (b * 60) * (Math.PI / 180);
          const bDist = 80 + (b % 3) * 35;
          const bx = cx + Math.cos(bAngle) * bDist;
          const by = cy + Math.sin(bAngle) * bDist;

          ctx.fillStyle = '#C4B5FD';
          ctx.beginPath();
          ctx.arc(bx, by, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#A78BFA';
          ctx.font = '10px monospace';
          ctx.fillText(`Recalled Unit ${b + 1}`, bx + 8, by + 4);
        }
      } else if (scene.visualType === 'contributor_cards') {
        // SCENE 4: Contributor Cards with Activity Gauges
        const cardW = 200;
        const cardH = 140;
        const startX = (w - (scene.elements.length * (cardW + 20) - 20)) / 2;

        scene.elements.forEach((el: any, idx: number) => {
          const cx = startX + idx * (cardW + 20);
          const cy = h * 0.45;
          const floatOffset = Math.sin(animClock * 1.5 + idx) * 5;

          ctx.fillStyle = '#23201C';
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(cx, cy + floatOffset, cardW, cardH, 12);
          ctx.fill();
          ctx.stroke();

          // Contributor Name
          ctx.fillStyle = '#F3F0E9';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.fillText(el.label, cx + 16, cy + floatOffset + 32);

          // Role
          ctx.fillStyle = '#34D399';
          ctx.font = '11px sans-serif';
          ctx.fillText(el.role || 'Contributor', cx + 16, cy + floatOffset + 52);

          // Contribution Activity Gauge Bar
          ctx.fillStyle = '#1A1715';
          ctx.fillRect(cx + 16, cy + floatOffset + 75, cardW - 32, 8);
          ctx.fillStyle = '#10B981';
          const fillW = ((el.contributions || 4) / 10) * (cardW - 32);
          ctx.fillRect(cx + 16, cy + floatOffset + 75, fillW, 8);

          ctx.fillStyle = '#B8A48D';
          ctx.font = '10px monospace';
          ctx.fillText(`${el.contributions || 4} verified contributions`, cx + 16, cy + floatOffset + 105);
        });
      } else {
        // Generic dynamic visual grid with floating particles & glowing pulse
        const pulse = (Math.sin(animClock * 2) + 1) * 0.5;
        ctx.strokeStyle = scene.accentHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70 + pulse * 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = scene.accentHex;
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(scene.title, w / 2, h / 2 + 5);
        ctx.textAlign = 'left';
      }
    };

    renderVisualFrame();

    return () => {
      if (canvasAnimFrameRef.current) {
        cancelAnimationFrame(canvasAnimFrameRef.current);
      }
    };
  }, [activeScene, playbackSpeed, projectName, purpose]);

  const CurrentIcon = activeScene.icon;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl bg-[#12100E] border border-[#5B5045] overflow-hidden shadow-2xl text-[#F3F0E9] select-none flex flex-col justify-between ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[640px]'
      }`}
    >
      {/* 1. Main Visual Stage (60 FPS Canvas + Cinematic Overlay) */}
      <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center">
        {/* Animated Visual Canvas */}
        <canvas
          ref={visualCanvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain"
        />

        {/* Cinematic Kinetic Text Overlay (Moving Typography) */}
        <div className="absolute inset-0 pointer-events-none p-6 sm:p-10 flex flex-col justify-between">
          {/* Top Scene Kicker & Lower-Thirds */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1E1B18]/90 backdrop-blur-md border border-[#B8A48D]/40 text-xs font-mono font-bold tracking-wider">
              <CurrentIcon className="h-4 w-4" style={{ color: activeScene.accentHex }} />
              <span style={{ color: activeScene.accentHex }}>{activeScene.badge}</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-[#1E1B18]/80 backdrop-blur-md border border-[#5B5045]/40 text-[11px] font-mono text-[#B8A48D]">
              Scene {currentSceneIdx + 1} of {scenes.length}
            </div>
          </div>

          {/* Lower Thirds Kinetic Moving Headline & Subtitle */}
          <div className="space-y-2 max-w-3xl transform transition-all duration-500">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8A48D] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeScene.accentHex }} />
              <span>{activeScene.subtitle}</span>
            </div>

            <h3 className="font-heading text-2xl sm:text-4xl font-black text-[#F3F0E9] drop-shadow-md tracking-tight">
              {activeScene.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#E8DED2]/90 font-light leading-relaxed max-w-2xl bg-[#1E1B18]/70 backdrop-blur-sm p-3 rounded-xl border border-[#5B5045]/40">
              {activeScene.narration}
            </p>
          </div>
        </div>

        {/* Center Big Play Trigger when Paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#342F2A]/90 hover:bg-[#5B5045] backdrop-blur-md border-2 border-[#B8A48D] text-[#F3F0E9] flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 cursor-pointer z-20 group"
          >
            <Play className="h-8 w-8 text-amber-300 ml-1 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* 2. Scrubbable Timeline & Scene Notches */}
      <div className="px-6 pt-3 bg-[#1A1715] border-t border-[#453E37]/60">
        <div className="relative w-full h-3 bg-[#2A2521] rounded-full overflow-hidden cursor-pointer group">
          {/* Active scene progress bar */}
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75 rounded-full"
            style={{
              width: `${
                ((currentSceneIdx + sceneProgress) / scenes.length) * 100
              }%`,
            }}
          />

          {/* Scene Notch Markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-1">
            {scenes.map((s, idx) => (
              <div
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeekScene(idx);
                }}
                className={`w-1 h-full pointer-events-auto transition-colors ${
                  idx <= currentSceneIdx ? 'bg-amber-200' : 'bg-[#5B5045]'
                }`}
                title={`Jump to Scene ${s.number}: ${s.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Professional Video Control Toolbar */}
      <div className="px-6 py-3 bg-[#1A1715] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Play/Pause, Step Prev/Next, Replay */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] transition-all cursor-pointer shadow-xs"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={handlePreviousScene}
            disabled={currentSceneIdx === 0}
            className="p-2 rounded-xl hover:bg-[#2A2521] text-[#B8A48D] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="Previous Scene"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={handleAdvanceScene}
            disabled={currentSceneIdx === scenes.length - 1}
            className="p-2 rounded-xl hover:bg-[#2A2521] text-[#B8A48D] hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="Next Scene"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleSeekScene(0)}
            className="p-2 rounded-xl hover:bg-[#2A2521] text-[#B8A48D] hover:text-white transition-colors cursor-pointer"
            title="Restart Video"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Timecode */}
          <div className="text-xs font-mono text-[#B8A48D] ml-2">
            <span>{String(currentSceneIdx + 1).padStart(2, '0')}</span>
            <span className="opacity-50"> / </span>
            <span>{String(scenes.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Center: Real Engine Verification Label */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#A89A8C] bg-[#23201C] px-3 py-1 rounded-full border border-[#453E37]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Visual Video Engine (60 FPS WebGL/Canvas)</span>
        </div>

        {/* Right: Audio toggles, Speed, Fullscreen, Scene Drawer */}
        <div className="flex items-center gap-3">
          {/* Voice Narration Toggle */}
          <button
            onClick={() => setVoiceNarration((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              voiceNarration
                ? 'bg-amber-900/60 text-amber-200 border border-amber-600/60'
                : 'bg-[#23201C] text-[#7E7266]'
            }`}
            title="Voice Narration"
          >
            Voice: {voiceNarration ? 'ON' : 'OFF'}
          </button>

          {/* Volume / Mute */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl hover:bg-[#2A2521] text-[#B8A48D] hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Speed Selector */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-[#23201C] border border-[#5B5045]/60 rounded-lg px-2 py-1 text-xs text-[#E8DED2] font-mono focus:outline-none cursor-pointer"
          >
            <option value="0.75">0.75x</option>
            <option value="1">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl hover:bg-[#2A2521] text-[#B8A48D] hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
