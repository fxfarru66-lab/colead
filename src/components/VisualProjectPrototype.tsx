import React, { useState } from 'react';
import {
  ProjectArchitectBlueprint,
  SuggestedContributor,
  HistoricalLesson,
  RoadmapPhase,
} from '../types';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  CreditCard,
  MapPin,
  LayoutDashboard,
  Users,
  Calendar,
  AlertTriangle,
  Award,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Laptop,
  Smartphone,
  Server,
  Activity,
  Box,
  Truck,
  Eye,
  Zap,
} from 'lucide-react';

interface VisualProjectPrototypeProps {
  blueprint: ProjectArchitectBlueprint;
  onOpenPerson?: (personId: string) => void;
  onLaunchWalkthrough?: () => void;
  onLaunchVideoStoryboard?: () => void;
}

export const VisualProjectPrototype: React.FC<VisualProjectPrototypeProps> = ({
  blueprint,
  onOpenPerson,
  onLaunchWalkthrough,
  onLaunchVideoStoryboard,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeScreenIndex, setActiveScreenIndex] = useState<number>(0);
  const [paymentSimulationStep, setPaymentSimulationStep] = useState<number>(1);
  const [orderTrackingProgress, setOrderTrackingProgress] = useState<number>(65);

  const {
    project_understanding,
    suggested_contributors = [],
    historical_lessons = [],
    roadmap = [],
    executive_summary,
    success_criteria = [],
  } = blueprint;

  const projectName = project_understanding?.project_name || 'Enterprise E-Commerce Platform';

  const sections = [
    { id: 'overview', number: '01', title: 'Product Overview', icon: Sparkles },
    { id: 'journey', number: '02', title: 'User Journey', icon: ArrowRight },
    { id: 'architecture', number: '03', title: 'System Architecture', icon: Server },
    { id: 'screens', number: '04', title: 'Main Screens', icon: Laptop },
    { id: 'payments', number: '05', title: 'Payment Flow', icon: CreditCard },
    { id: 'tracking', number: '06', title: 'Order Tracking', icon: Truck },
    { id: 'dashboard', number: '07', title: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'team', number: '08', title: 'Team & Roles', icon: Users },
    { id: 'timeline', number: '09', title: 'Timeline & Roadmap', icon: Calendar },
    { id: 'risks', number: '10', title: 'Risks & Lessons', icon: AlertTriangle },
    { id: 'outcomes', number: '11', title: 'Expected Outcomes', icon: Award },
  ];

  const prototypeScreens = [
    {
      title: 'Storefront & Discovery',
      device: 'Desktop / Mobile Responsive',
      tag: 'Customer Surface',
      description: 'Dynamic product catalog with high-contrast accessibility tokens, category filtering, and instant search.',
      elements: ['Hero Banner with Promotion', 'Grid with Product Badges', 'Faceted Filters', 'Instant Search Autocomplete'],
    },
    {
      title: 'Product Detail & Customizer',
      device: 'Desktop Viewport',
      tag: 'Interactive Surface',
      description: 'Rich gallery with 60fps micro-animations, stock availability counter, and instant cart drawer.',
      elements: ['Multi-Angle Image Carousel', 'Variant Selector', 'Customer Review Highlights', 'One-Click Add to Cart'],
    },
    {
      title: 'Checkout & Stripe Payment',
      device: 'Secure Web / Mobile Enclave',
      tag: 'Financial Transaction Surface',
      description: 'Streamlined 2-step checkout with biometric payment verification and idempotent transaction broker.',
      elements: ['Address Auto-Completion', 'Stripe Element Card Vault', 'Order Summary & Tax Breakup', 'Place Order with Retry Guarantee'],
    },
    {
      title: 'Live Order Tracking',
      device: 'Mobile Telemetry Screen',
      tag: 'Real-Time Courier Surface',
      description: 'Map visualization with GPS route updates, step-by-step courier milestone tracker, and push notifications.',
      elements: ['Interactive Map Route', 'Live ETA Counter', 'Courier Contact Modal', 'Real-Time Progress Stepper'],
    },
    {
      title: 'Executive Admin Command Hub',
      device: 'Desktop Full Suite',
      tag: 'Operations & Management Surface',
      description: 'Operations cockpit with revenue charts, inventory low-stock alerts, payment refund triggers, and team attribution.',
      elements: ['Daily GMV Chart', 'Active Order Pipeline', 'Inventory Mutex Status', 'Webhook Deduplication Health'],
    },
  ];

  return (
    <div className="space-y-8 rounded-3xl border border-[#B8A48D]/70 bg-[#FBF9F5] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-[#342F2A]">
      {/* Decorative Spatial Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#B8A48D]/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-radial from-[#342F2A]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header & Quick Action Launcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#B8A48D]/40 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B8A48D] bg-[#E8DED2] text-[11px] font-mono tracking-widest text-[#5B5045] uppercase font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span>AI-Generated Project Prototype</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#342F2A] tracking-tight">
            {projectName}
          </h2>

          <p className="text-xs sm:text-sm text-[#5B5045] max-w-2xl font-light leading-relaxed">
            {project_understanding?.purpose || executive_summary || 'Comprehensive blueprint grounded in organizational knowledge.'}
          </p>
        </div>

        {/* Cinematic Walkthrough & Video Storyboard Triggers */}
        <div className="flex flex-wrap items-center gap-3">
          {onLaunchWalkthrough && (
            <button
              onClick={onLaunchWalkthrough}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Eye className="h-4 w-4" />
              <span>Show Me The Project (3D)</span>
            </button>
          )}

          {onLaunchVideoStoryboard && (
            <button
              onClick={onLaunchVideoStoryboard}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#D4C3B3] text-[#342F2A] text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4 text-[#5B5045]" />
              <span>Project Storyboard &amp; Video</span>
            </button>
          )}
        </div>
      </div>

      {/* Section Navigator Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#342F2A] text-[#F3F0E9] border-[#342F2A] shadow-md transform -translate-y-0.5'
                  : 'bg-[#E8DED2]/60 hover:bg-[#E8DED2] text-[#5B5045] border-[#B8A48D]/40'
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">{sec.number}</span>
              <Icon className="h-3.5 w-3.5" />
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 0: PRODUCT OVERVIEW (01)
         ========================================================================= */}
      {activeTab === 0 && (
        <div className="space-y-6 animate-fade-in">
          {executive_summary && (
            <div className="p-5 rounded-2xl bg-[#E8DED2]/50 border border-[#B8A48D]/50 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B5045] font-bold">
                Executive Leadership Summary
              </span>
              <p className="text-sm text-[#342F2A] leading-relaxed font-serif italic">
                "{executive_summary}"
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-[#B8A48D]/40 bg-[#F3F0E9]/60 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                Target Audience
              </span>
              <p className="text-xs text-[#342F2A] leading-relaxed">
                {project_understanding?.target_users || 'E-commerce consumers, fulfillment merchants, and platform administrators.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#B8A48D]/40 bg-[#F3F0E9]/60 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                Core Features
              </span>
              <ul className="space-y-1.5 text-xs text-[#342F2A]">
                {(project_understanding?.main_features || [
                  'Dynamic product catalog',
                  'Stripe checkout integration',
                  'Live real-time courier order tracking',
                  'Admin analytics & telemetry dashboard',
                ]).map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl border border-[#B8A48D]/40 bg-[#F3F0E9]/60 space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                Success Criteria
              </span>
              <ul className="space-y-1.5 text-xs text-[#342F2A]">
                {(success_criteria.length > 0 ? success_criteria : [
                  'Sub-2 second checkout latency with zero transaction anomalies',
                  'Sub-100ms real-time order status dispatch',
                  '100% WCAG 2.1 AA accessibility compliance across mobile storefront',
                ]).map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: USER JOURNEY (02)
         ========================================================================= */}
      {activeTab === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Discovery', desc: 'Customer browses responsive storefront with faceted category search.' },
              { step: '02', title: 'Cart & Bag', desc: 'Customer customizes variant and reviews subtotal with automated taxes.' },
              { step: '03', title: 'Stripe Payment', desc: 'Payment securely processed with zero double-charge guarantee.' },
              { step: '04', title: 'Live Tracking', desc: 'Real-time WebSocket connection maps delivery progress.' },
              { step: '05', title: 'Fulfillment', desc: 'Admin monitors settlement, inventory decrement, and courier confirmation.' },
            ].map((j, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-[#B8A48D]/50 bg-[#F3F0E9] space-y-2 relative group hover:border-[#342F2A] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#5B5045]">{j.step}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#B8A48D] group-hover:text-[#342F2A] transition-colors" />
                </div>
                <h4 className="font-heading font-bold text-sm text-[#342F2A]">{j.title}</h4>
                <p className="text-[11px] text-[#5B5045] leading-relaxed">{j.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SYSTEM ARCHITECTURE (03)
         ========================================================================= */}
      {activeTab === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/30 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
              Interactive Architecture Topology
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-900">FRONTEND CLIENT</span>
                  <Smartphone className="h-4 w-4 text-blue-700" />
                </div>
                <p className="text-xs text-blue-950">React 18 + Tailwind CSS + Reanimated 60fps micro-interactions.</p>
                <div className="text-[10px] font-mono text-blue-800">Assigned: Alex Chen & Priya Sharma</div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-900">API GATEWAY</span>
                  <Server className="h-4 w-4 text-emerald-700" />
                </div>
                <p className="text-xs text-emerald-950">Express + GraphQL federation aggregating profile, orders & cart.</p>
                <div className="text-[10px] font-mono text-emerald-800">Assigned: Maria Garcia</div>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-900">PAYMENT BROKER</span>
                  <CreditCard className="h-4 w-4 text-purple-700" />
                </div>
                <p className="text-xs text-purple-950">Stripe Webhooks + Redis Mutex Lock + SHA-256 deduplication.</p>
                <div className="text-[10px] font-mono text-purple-800">Assigned: Daniel Ortiz</div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-900">ORDER TELEMETRY</span>
                  <Activity className="h-4 w-4 text-amber-700" />
                </div>
                <p className="text-xs text-amber-950">WebSocket live streaming + Courier Geolocation stream.</p>
                <div className="text-[10px] font-mono text-amber-800">Assigned: Marcus Chen</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MAIN SCREENS (04)
         ========================================================================= */}
      {activeTab === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {prototypeScreens.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setActiveScreenIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeScreenIndex === idx
                    ? 'bg-[#342F2A] text-[#F3F0E9]'
                    : 'bg-[#E8DED2] text-[#5B5045] hover:bg-[#D4C3B3]'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl border border-[#B8A48D] bg-[#F3F0E9] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B8A48D]/30 pb-3">
              <div>
                <h3 className="font-heading font-bold text-lg text-[#342F2A]">
                  {prototypeScreens[activeScreenIndex].title}
                </h3>
                <span className="text-[11px] font-mono text-[#5B5045]">
                  {prototypeScreens[activeScreenIndex].device} · {prototypeScreens[activeScreenIndex].tag}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#342F2A] leading-relaxed">
              {prototypeScreens[activeScreenIndex].description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {prototypeScreens[activeScreenIndex].elements.map((el, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FBF9F5] border border-[#B8A48D]/40 text-xs text-[#342F2A]">
                  <Box className="h-3.5 w-3.5 text-[#5B5045] shrink-0" />
                  <span>{el}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PAYMENT FLOW (05)
         ========================================================================= */}
      {activeTab === 4 && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/40 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
                Stripe Idempotent Payment Flow Simulation
              </span>
              <button
                onClick={() => setPaymentSimulationStep((prev) => (prev % 4) + 1)}
                className="px-3 py-1 rounded-lg bg-[#342F2A] text-[#F3F0E9] text-xs font-semibold cursor-pointer"
              >
                Next Step ({paymentSimulationStep}/4)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: 1, name: '1. Initiate Intent', desc: 'Client creates PaymentIntent with SHA-256 cart hash.' },
                { step: 2, name: '2. Customer Auth', desc: '3D Secure biometric confirmation via Stripe Elements.' },
                { step: 3, name: '3. Webhook Mutex', desc: 'Daniel’s Redis lock prevents burst retry duplicates.' },
                { step: 4, name: '4. Atomic Settlement', desc: 'SQLite atomic transaction commits order & decrements stock.' },
              ].map((st) => (
                <div
                  key={st.step}
                  className={`p-4 rounded-xl border transition-all ${
                    paymentSimulationStep === st.step
                      ? 'bg-purple-900 text-white border-purple-700 shadow-md scale-102'
                      : 'bg-[#FBF9F5] text-[#342F2A] border-[#B8A48D]/40'
                  }`}
                >
                  <h5 className="font-bold text-xs">{st.name}</h5>
                  <p className="text-[11px] opacity-90 leading-relaxed mt-1">{st.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/50 text-xs text-[#5B5045]">
              <strong className="text-[#342F2A]">Historical Lesson Applied:</strong> PR #1428 payment retry architecture by Daniel Ortiz is reused to guarantee 0 duplicate charges.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ORDER TRACKING (06)
         ========================================================================= */}
      {activeTab === 5 && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl border border-[#B8A48D]/60 bg-[#F3F0E9] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-base text-[#342F2A]">Live Real-Time Telemetry Simulation</h4>
                <span className="text-[11px] font-mono text-[#5B5045]">Order #COL-9824 · Express Courier Dispatch</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                ETA: 18 mins
              </span>
            </div>

            {/* Simulated Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-[#E8DED2] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${orderTrackingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#5B5045]">
                <span>Order Placed (12:04)</span>
                <span>Packed (12:15)</span>
                <span>In Transit (12:28)</span>
                <span>Delivered</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setOrderTrackingProgress((prev) => (prev >= 100 ? 25 : prev + 25))}
                className="px-3 py-1.5 rounded-lg border border-[#B8A48D] bg-[#E8DED2] text-xs font-semibold text-[#342F2A] cursor-pointer"
              >
                Simulate Courier Movement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: ADMIN DASHBOARD (07)
         ========================================================================= */}
      {activeTab === 6 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#5B5045]">Platform Gross GMV</span>
              <div className="text-xl font-heading font-extrabold text-[#342F2A]">$148,920.00</div>
              <span className="text-[10px] text-emerald-700 font-semibold">+24.5% vs baseline</span>
            </div>

            <div className="p-4 rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#5B5045]">Active Courier Routes</span>
              <div className="text-xl font-heading font-extrabold text-[#342F2A]">42 Dispatches</div>
              <span className="text-[10px] text-emerald-700 font-semibold">99.8% On-Time SLA</span>
            </div>

            <div className="p-4 rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#5B5045]">Idempotency Ledger Health</span>
              <div className="text-xl font-heading font-extrabold text-[#342F2A]">100.0%</div>
              <span className="text-[10px] text-emerald-700 font-semibold">0 Duplicate Events</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: TEAM & ROLES (08)
         ========================================================================= */}
      {activeTab === 7 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggested_contributors.map((sc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[#B8A48D]/60 bg-[#F3F0E9] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={sc.person_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                      alt={sc.person_name}
                      className="w-10 h-10 rounded-full object-cover border border-[#B8A48D]"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[#342F2A]">{sc.person_name}</h4>
                      <span className="text-[11px] font-mono text-[#5B5045]">{sc.role_name}</span>
                    </div>
                  </div>

                  {onOpenPerson && sc.person_id && (
                    <button
                      onClick={() => onOpenPerson(sc.person_id)}
                      className="p-1.5 rounded-lg border border-[#B8A48D] bg-[#E8DED2] text-[#342F2A] hover:bg-[#D4C3B3] text-xs cursor-pointer"
                      title="Inspect Contributor Evidence"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#5B5045] leading-relaxed">
                  <strong className="text-[#342F2A]">Why suggested:</strong> {sc.why_suggested}
                </p>

                {sc.evidence && sc.evidence.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/30 text-[11px] text-[#5B5045] space-y-1">
                    <span className="font-mono font-bold text-[#342F2A]">Documented Contribution:</span>
                    <p>{sc.evidence[0].contribution_title} on <em>{sc.evidence[0].project_name}</em></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: TIMELINE & ROADMAP (09)
         ========================================================================= */}
      {activeTab === 8 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            {roadmap.map((phase, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-[#B8A48D]/60 bg-[#F3F0E9] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#342F2A] text-[#F3F0E9] text-[10px] font-mono font-bold">
                      Phase {phase.phase_number}
                    </span>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-[#342F2A]">
                      {phase.phase_name}
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-[#5B5045]">
                    Lead: {phase.suggested_contributor || phase.relevant_role}
                  </span>
                </div>

                <p className="text-xs text-[#5B5045]">{phase.objective}</p>

                {phase.tasks && phase.tasks.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {phase.tasks.map((t, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-[#342F2A]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#5B5045] shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: RISKS & HISTORICAL LESSONS (10)
         ========================================================================= */}
      {activeTab === 9 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historical_lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-purple-900 uppercase">
                    {lesson.category} · from {lesson.previous_project}
                  </span>
                  <ShieldCheck className="h-4 w-4 text-purple-700" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-purple-950">Issue Encountered Previously:</span>
                  <p className="text-xs text-purple-900">{lesson.historical_issue}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-950">Proven Solution Applied:</span>
                  <p className="text-xs text-emerald-900">{lesson.proven_solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: EXPECTED OUTCOMES (11)
         ========================================================================= */}
      {activeTab === 10 && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2]/40 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5B5045]">
              Projected Organizational Outcomes
            </span>

            <p className="text-sm text-[#342F2A] leading-relaxed">
              {project_understanding?.expected_outcomes || 'High-resilience e-commerce system delivering seamless consumer ordering, guaranteed idempotent payment handling, real-time courier visibility, and automated merchant analytics.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/40 text-center space-y-1">
                <div className="text-2xl font-extrabold text-[#342F2A]">0%</div>
                <div className="text-[11px] text-[#5B5045]">Duplicate Payments</div>
              </div>
              <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/40 text-center space-y-1">
                <div className="text-2xl font-extrabold text-[#342F2A]">&lt; 80ms</div>
                <div className="text-[11px] text-[#5B5045]">Real-Time Event Stream</div>
              </div>
              <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#B8A48D]/40 text-center space-y-1">
                <div className="text-2xl font-extrabold text-[#342F2A]">100%</div>
                <div className="text-[11px] text-[#5B5045]">Attribution Tracked</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
