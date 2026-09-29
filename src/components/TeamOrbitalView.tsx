import React, { useState } from 'react';
import { Team, TeamMember } from '../types';
import { BronzeMedallion } from './BronzeMedallion';
import {
  ArrowLeft,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Database,
  Clock,
} from 'lucide-react';

interface TeamOrbitalViewProps {
  team: Team;
  onBackToTeams: () => void;
  onSelectMember: (memberId: string) => void;
}

export const TeamOrbitalView: React.FC<TeamOrbitalViewProps> = ({
  team,
  onBackToTeams,
  onSelectMember,
}) => {
  const members = team.members || [];
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  // Position member nodes in an elliptical orbital layout matching Screen 4 in the reference image
  // 5 Members:
  // 1. Top right (Sarah Kim - Product Manager)
  // 2. Middle left (Alex Chen - Frontend Dev)
  // 3. Middle right (Priya Sharma - UX Designer)
  // 4. Bottom left (Daniel Ortiz - Backend Dev)
  // 5. Bottom right (Maria Garcia - Full Stack Dev)
  const defaultPositions = [
    { x: 68, y: 18 },  // Sarah Kim (top-right orbit)
    { x: 18, y: 52 },  // Alex Chen (middle-left orbit)
    { x: 82, y: 52 },  // Priya Sharma (middle-right orbit)
    { x: 32, y: 84 },  // Daniel Ortiz (bottom-left orbit)
    { x: 66, y: 84 },  // Maria Garcia (bottom-right orbit)
  ];

  const getPosition = (index: number) => {
    if (index < defaultPositions.length) {
      return defaultPositions[index];
    }
    // Dynamic fallback for >5 members
    const angle = (index / members.length) * 2 * Math.PI - Math.PI / 2;
    const rx = 36;
    const ry = 34;
    return {
      x: 50 + rx * Math.cos(angle),
      y: 50 + ry * Math.sin(angle),
    };
  };

  return (
    <div className="space-y-6 py-2 animate-fade-in text-[#342F2A]">
      {/* Top Header matching Screen 4 */}
      <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-4">
        <div>
          <button
            onClick={onBackToTeams}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] transition-colors mb-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Teams</span>
          </button>
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
              {team.name}
            </h1>
            <span className="text-sm font-medium text-[#7E7266]">
              {team.subtitle || team.department}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Orbital Canvas (Left) + Statistics Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Orbital Canvas matching Screen 4 */}
        <div className="lg:col-span-8 bg-[#F3F0E9] rounded-2xl border border-[#B8A48D]/50 relative min-h-[520px] sm:min-h-[580px] p-6 overflow-hidden shadow-sm flex items-center justify-center">
          
          {/* Radial Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,222,210,0.6)_0%,transparent_70%)] pointer-events-none" />

          {/* Concentric Elliptical Orbital Rings */}
          <div className="absolute w-[82%] h-[82%] rounded-[50%] border border-[#B8A48D]/40 pointer-events-none" />
          <div className="absolute w-[60%] h-[60%] rounded-[50%] border border-[#B8A48D]/30 pointer-events-none" />
          <div className="absolute w-[36%] h-[36%] rounded-[50%] border border-[#B8A48D]/25 pointer-events-none" />

          {/* Center Node representing the team (Large Bronze Sphere) */}
          <div className="relative flex flex-col items-center justify-center z-10 pointer-events-none">
            {/* Small emblem above central node */}
            <div className="w-6 h-6 rounded-full bg-[#E8DED2] border border-[#B8A48D] flex items-center justify-center text-[#5B5045] mb-2 shadow-sm">
              <Sparkles className="h-3 w-3" />
            </div>

            {/* Central bronze metallic node */}
            <BronzeMedallion size="lg" type={team.icon_type || 'bronze_sphere'} />

            {/* Team label badge under sphere */}
            <div className="mt-2.5 px-3 py-0.5 rounded-full bg-[#E8DED2]/90 border border-[#B8A48D] text-[11px] font-bold text-[#342F2A] tracking-wider uppercase">
              {team.name}
            </div>
          </div>

          {/* Member Orbital Nodes */}
          {members.map((member, index) => {
            const pos = getPosition(index);
            const isHovered = hoveredMemberId === member.id;

            return (
              <div
                key={member.id}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredMemberId(member.id)}
                onMouseLeave={() => setHoveredMemberId(null)}
                onClick={() => onSelectMember(member.id)}
                className="absolute z-20 cursor-pointer group transition-all duration-300"
              >
                {/* Connecting subtle radial dash line to center */}
                <svg
                  className="absolute pointer-events-none overflow-visible"
                  style={{
                    left: 0,
                    top: 0,
                    width: 1,
                    height: 1,
                  }}
                >
                  <line
                    x1="0"
                    y1="0"
                    x2={`${(50 - pos.x) * 4}px`}
                    y2={`${(50 - pos.y) * 4}px`}
                    stroke="#B8A48D"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.35"
                  />
                </svg>

                {/* Member Node Card with Photo Avatar */}
                <div
                  className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 text-center ${
                    isHovered
                      ? 'scale-110 -translate-y-1'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={member.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80'}
                      alt={member.name}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 shadow-md transition-all ${
                        isHovered
                          ? 'border-[#342F2A] ring-4 ring-[#B8A48D]/40'
                          : 'border-[#E8DED2]'
                      }`}
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-[#F3F0E9]" />
                  </div>

                  <div className="mt-2 bg-[#FBF9F5]/90 px-3 py-1 rounded-lg border border-[#B8A48D]/40 shadow-sm backdrop-blur-sm whitespace-nowrap">
                    <div className="font-serif text-xs font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors">
                      {member.name}
                    </div>
                    <div className="text-[10px] text-[#7E7266] font-medium">
                      {member.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Statistics & Recent Activity Panel matching Screen 4 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Team Statistics Card */}
          <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#FBF9F5] p-6 shadow-sm space-y-5">
            <h2 className="font-serif text-xl font-bold text-[#342F2A] tracking-wide">
              Team Statistics
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8DED2] flex items-center justify-center text-[#5B5045] shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A]">
                    {team.member_count}
                  </div>
                  <div className="text-[10px] font-semibold text-[#7E7266] uppercase tracking-wider">
                    Members
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8DED2] flex items-center justify-center text-[#5B5045] shrink-0">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A]">
                    {team.project_count || team.projects?.length || 3}
                  </div>
                  <div className="text-[10px] font-semibold text-[#7E7266] uppercase tracking-wider">
                    Active Projects
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8DED2] flex items-center justify-center text-[#5B5045] shrink-0">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A]">
                    {team.contribution_count}
                  </div>
                  <div className="text-[10px] font-semibold text-[#7E7266] uppercase tracking-wider">
                    Total Contributions
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9] p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8DED2] flex items-center justify-center text-[#5B5045] shrink-0">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-mono tabular-nums font-bold text-[#342F2A]">
                    {team.memory_units ?? 8}
                  </div>
                  <div className="text-[10px] font-semibold text-[#7E7266] uppercase tracking-wider">
                    Memory Units
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card matching Screen 4 */}
          <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#FBF9F5] p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#342F2A]">
              Recent Activity
            </h3>

            <div className="space-y-3.5">
              {(team.recent_activity && team.recent_activity.length > 0
                ? team.recent_activity
                : [
                    { id: '1', person_name: 'Sarah Kim', action: 'Updated project roadmap', time_ago: '2 hours ago' },
                    { id: '2', person_name: 'Alex Chen', action: 'Merged pull request', time_ago: '4 hours ago' },
                    { id: '3', person_name: 'Priya Sharma', action: 'Added design document', time_ago: '1 day ago' },
                  ]
              ).map((act, i) => {
                const member = members.find((m) => m.name === act.person_name);
                return (
                  <div
                    key={act.id || i}
                    onClick={() => member && onSelectMember(member.id)}
                    className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#E8DED2]/50 transition-colors cursor-pointer group"
                  >
                    <img
                      src={member?.avatar_url || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80'}
                      alt={act.person_name}
                      className="w-8 h-8 rounded-full object-cover border border-[#B8A48D] shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors truncate">
                        {act.person_name}
                      </div>
                      <div className="text-xs text-[#5B5045] leading-snug">
                        {act.action}
                      </div>
                      <div className="text-[10px] text-[#7E7266] font-mono mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{act.time_ago}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
