import React, { useState } from 'react';
import { Team } from '../types';
import {
  ArrowLeft,
  Users,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface TeamWorkspaceRoomProps {
  team: Team;
  onBackToCollection: () => void;
  onOpenPersonDetail: (personId: string) => void;
}

export const TeamWorkspaceRoom: React.FC<TeamWorkspaceRoomProps> = ({
  team,
  onBackToCollection,
  onOpenPersonDetail,
}) => {
  const members = team.members || [];
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(
    members.length > 0 ? members[0].id : null
  );
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  // Layout coordinates for 2.5D chairs around the architectural boardroom table
  const getChairPosition = (index: number, total: number) => {
    if (total === 1) return { x: 50, y: 70, angle: 0 };
    const startAngle = Math.PI * 0.15;
    const endAngle = Math.PI * 0.85;
    const step = (endAngle - startAngle) / Math.max(total - 1, 1);
    const angle = startAngle + index * step;
    
    const rx = 38;
    const ry = 28;
    const cx = 50;
    const cy = 48;

    const x = cx + rx * Math.cos(angle - Math.PI / 2);
    const y = cy + ry * Math.sin(angle);
    return { x, y, angle: (angle - Math.PI / 2) * 20 };
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in text-[#342F2A]">
      {/* Top Bar with Navigation & Stage Indicator */}
      <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-4">
        <button
          onClick={onBackToCollection}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-[#5B5045]" />
          <span>Back to Team Spaces</span>
        </button>
        <span className="text-[11px] font-mono tracking-wider text-[#5B5045] uppercase font-semibold">
          Stage 03 · Spatial Workspace &amp; Workstations
        </span>
      </div>

      {/* Team Overview & Statistics (#E8DED2 Card) */}
      <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase font-semibold">
              <Layers className="h-3.5 w-3.5" />
              <span>{team.department}</span>
              <span aria-hidden="true">·</span>
              <span>Team Lead: {team.team_lead || 'Unassigned'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide text-[#342F2A]">
              {team.name}
            </h1>
            {team.mission && (
              <p className="text-sm text-[#5B5045] leading-relaxed font-light">
                {team.mission}
              </p>
            )}
          </div>

          {/* Real Statistics Grid with #F3F0E9 inner boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 self-stretch lg:self-auto">
            <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-3.5 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#5B5045] block font-semibold">
                Members
              </span>
              <span className="text-2xl font-mono tabular-nums font-bold text-[#342F2A] mt-1 block">
                {team.member_count}
              </span>
              <span className="text-[10px] text-[#7E7266]">Active seats</span>
            </div>

            <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-3.5 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#5B5045] block font-semibold">
                Projects
              </span>
              <span className="text-2xl font-mono tabular-nums font-bold text-[#342F2A] mt-1 block">
                {team.active_projects_count ?? team.projects?.length ?? 1}
              </span>
              <span className="text-[10px] text-[#7E7266]">Initiatives</span>
            </div>

            <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-3.5 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#5B5045] block font-semibold">
                Contributions
              </span>
              <span className="text-2xl font-mono tabular-nums font-bold text-[#342F2A] mt-1 block">
                {team.contribution_count}
              </span>
              <span className="text-[10px] text-[#7E7266]">Documented</span>
            </div>

            <div className="rounded-xl border border-[#B8A48D]/50 bg-[#F3F0E9] p-3.5 text-center">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#5B5045] block font-semibold">
                Memory Units
              </span>
              <span className="text-2xl font-mono tabular-nums font-bold text-[#342F2A] mt-1 block">
                {team.memory_units ?? 2}
              </span>
              <span className="text-[10px] text-[#7E7266]">Hindsight</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spatial 2.5D Meeting Room (Level 4 #5B5045 Dark Warm Section with #342F2A) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#5B5045]">
          <span className="font-serif tracking-wider uppercase text-[12px] text-[#342F2A] font-bold">
            Spatial Meeting Room · {members.length} Member Workstations
          </span>
          <span className="font-mono text-[11px] text-[#7E7266]">
            Hover to view · Click seat to open contributor profile
          </span>
        </div>

        {/* 2.5D Room Viewport: Exact #5B5045 warm dark spatial surface */}
        <div
          className={`relative min-h-[460px] sm:min-h-[500px] w-full rounded-2xl border border-[#342F2A] bg-gradient-to-b from-[#5B5045] via-[#4A4137] to-[#342F2A] overflow-hidden p-6 perspective-1200 preserve-3d transition-all duration-500 shadow-xl ${
            selectedMemberId ? 'ring-2 ring-[#B8A48D]/60' : ''
          }`}
        >
          {/* Subtle Warm Studio Ambient Light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(243,240,233,0.12)_0%,transparent_70%)] pointer-events-none" />

          {/* Architectural Conference Table */}
          <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[72%] max-w-[580px] h-[160px] rounded-[70px] table-surface border border-[#7A6D5E]/60 flex items-center justify-center pointer-events-none shadow-2xl">
            <div className="text-center px-4">
              <span className="font-serif text-xs font-bold tracking-widest text-[#E8DED2] uppercase block">
                {team.name}
              </span>
              <span className="text-[10px] font-mono text-[#B8A48D] tracking-widest block mt-0.5 font-semibold">
                SHARED ORGANIZATIONAL CONTEXT
              </span>
            </div>
          </div>

          {/* Empty State */}
          {members.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-xs text-[#E8DED2] space-y-2">
              <Users className="h-8 w-8 text-[#B8A48D]" />
              <p>No team members assigned to this workstation yet.</p>
            </div>
          ) : (
            members.map((member, index) => {
              const pos = getChairPosition(index, members.length);
              const isSelected = selectedMemberId === member.id;
              const isHovered = hoveredMemberId === member.id;

              return (
                <div
                  key={member.id}
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.angle}deg) ${
                      isSelected ? 'translateZ(30px) scale(1.12)' : isHovered ? 'translateZ(18px) scale(1.06)' : 'translateZ(0px)'
                    }`,
                  }}
                  onMouseEnter={() => setHoveredMemberId(member.id)}
                  onMouseLeave={() => setHoveredMemberId(null)}
                  onClick={() => setSelectedMemberId(member.id)}
                  className={`absolute cursor-pointer transition-all duration-300 preserve-3d group ${
                    selectedMemberId && !isSelected ? 'opacity-40 hover:opacity-85' : 'opacity-100'
                  }`}
                >
                  {/* Tooltip on Hover */}
                  <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#F3F0E9] border border-[#B8A48D] text-[11px] font-semibold text-[#342F2A] whitespace-nowrap pointer-events-none shadow-md transition-opacity duration-200 z-30 ${
                      isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <span>{member.name}</span>
                    <span className="text-[#5B5045] ml-1.5 text-[10px]">· {member.role}</span>
                  </div>

                  {/* 2.5D Chair Graphic (Taupe & Charcoal Palette) */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-14 sm:w-16 h-7 rounded-t-xl border transition-all duration-300 ${
                        isSelected
                          ? 'border-[#F3F0E9] bg-[#B8A48D] shadow-lg'
                          : 'border-[#342F2A] bg-[#5B5045] group-hover:border-[#B8A48D]'
                      }`}
                    />

                    <div
                      className={`w-12 sm:w-14 h-11 rounded-lg border mt-[-2px] transition-all duration-300 flex flex-col items-center justify-center text-center p-1 ${
                        isSelected
                          ? 'chair-seat-active border-[#F3F0E9]'
                          : 'chair-seat border-[#342F2A] group-hover:border-[#B8A48D]'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-[#F3F0E9] truncate max-w-[44px]">
                        {member.name.split(' ')[0]}
                      </span>
                      <span className="text-[8px] font-mono text-[#E8DED2]">
                        {member.contribution_count} works
                      </span>
                    </div>

                    <div className="w-10 h-2 bg-[#342F2A]/60 rounded-full blur-[2px] mt-1" />
                  </div>
                </div>
              );
            })
          )}

          {/* Selected Member Profile Card: Clean #F3F0E9 surface */}
          {selectedMember && (
            <div className="absolute bottom-5 left-5 right-5 sm:left-auto sm:right-6 sm:w-96 rounded-xl border border-[#B8A48D] bg-[#F3F0E9]/95 backdrop-blur-md p-5 shadow-2xl space-y-3 z-30 animate-fade-in text-[#342F2A]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono text-[#5B5045] uppercase tracking-wider font-semibold">
                    Selected Workstation · Chair #{members.findIndex((m) => m.id === selectedMember.id) + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#342F2A] mt-0.5">
                    {selectedMember.name}
                  </h3>
                  <p className="text-xs text-[#5B5045] font-medium">{selectedMember.role}</p>
                </div>

                <button
                  onClick={() => onOpenPersonDetail(selectedMember.id)}
                  className="px-3 py-1.5 rounded-lg border border-[#342F2A] bg-[#5B5045] hover:bg-[#342F2A] text-xs font-semibold text-[#F3F0E9] flex items-center gap-1 transition-all shadow-sm shrink-0"
                >
                  <span>Deep Record</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#E8DED2]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-[#B8A48D]/40 pt-2.5">
                <div>
                  <span className="text-[10px] text-[#7E7266] block font-medium">Attributed Works</span>
                  <span className="font-mono text-sm font-bold text-[#342F2A]">
                    {selectedMember.contribution_count} logged
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#7E7266] block font-medium">Project Leadership</span>
                  <span className="font-mono text-sm font-semibold text-[#5B5045]">
                    {selectedMember.is_lead ? 'Project Lead' : 'Specialist Contributor'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#5B5045] pt-1">
                Click <strong className="text-[#342F2A]">“Deep Record”</strong> to inspect verified contribution history, problems solved, technical decisions, and verifiable engineering outcomes.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
