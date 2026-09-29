import React, { useRef, useState, useEffect } from 'react';
import { Team } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
} from 'lucide-react';

interface TeamHorizontalScrollProps {
  teams: Team[];
  onSelectTeam: (team: Team) => void;
  onOpenAddTeam: () => void;
}

export const TeamHorizontalScroll: React.FC<TeamHorizontalScrollProps> = ({
  teams,
  onSelectTeam,
  onOpenAddTeam,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [teams]);

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Stage Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#B8A48D]/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase mb-1 font-semibold">
            <span>Stage 02 · Team Collection Track</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#342F2A]">
            Organizational Team Spaces
          </h2>
          <p className="text-xs text-[#5B5045] mt-0.5">
            Scroll through spatial workspaces. Select any team to enter its physical workstation layout.
          </p>
        </div>

        {/* Scroll Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollByAmount('left')}
            disabled={!canScrollLeft}
            className="h-9 w-9 rounded-lg border border-[#B8A48D] bg-[#E8DED2] flex items-center justify-center text-[#342F2A] hover:bg-[#D5C8B8] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollByAmount('right')}
            disabled={!canScrollRight}
            className="h-9 w-9 rounded-lg border border-[#B8A48D] bg-[#E8DED2] flex items-center justify-center text-[#342F2A] hover:bg-[#D5C8B8] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Spatial Track: Team Surfaces #E8DED2 */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex items-stretch gap-6 overflow-x-auto py-6 px-1 no-scrollbar perspective-1200 preserve-3d scroll-smooth"
      >
        {teams.map((team, index) => {
          const isHovered = hoveredTeamId === team.id;
          return (
            <div
              key={team.id}
              onClick={() => onSelectTeam(team)}
              onMouseEnter={() => setHoveredTeamId(team.id)}
              onMouseLeave={() => setHoveredTeamId(null)}
              className={`min-w-[310px] sm:min-w-[340px] max-w-[360px] rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between cursor-pointer group shadow-sm ${
                isHovered
                  ? 'border-[#342F2A] bg-[#B8A48D] text-[#342F2A] -translate-y-2 shadow-md'
                  : 'border-[#B8A48D]/60 bg-[#E8DED2] text-[#342F2A] hover:border-[#5B5045]'
              }`}
            >
              {/* Card Top: Numbering + Department */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#5B5045] tracking-widest uppercase font-semibold">
                    TEAM 0{index + 1}
                  </span>
                  <span className="font-mono text-[11px] text-[#342F2A] font-semibold">
                    {team.department}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold tracking-wide text-[#342F2A]">
                    {team.name}
                  </h3>
                  <div className="text-xs text-[#5B5045] mt-1 font-mono">
                    Lead: <span className="text-[#342F2A] font-semibold">{team.team_lead || 'Elena Vance'}</span>
                  </div>
                </div>

                {team.mission && (
                  <p className="text-xs text-[#5B5045] line-clamp-2 leading-relaxed">
                    {team.mission}
                  </p>
                )}
              </div>

              {/* Card Metrics Grid with #F3F0E9 sub-cards */}
              <div className="pt-6 border-t border-[#B8A48D]/40 mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-2">
                    <span className="text-[10px] uppercase font-mono text-[#5B5045] block font-semibold">Seats</span>
                    <span className="text-base font-mono tabular-nums font-bold text-[#342F2A]">
                      {team.member_count}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-2">
                    <span className="text-[10px] uppercase font-mono text-[#5B5045] block font-semibold">Projects</span>
                    <span className="text-base font-mono tabular-nums font-bold text-[#342F2A]">
                      {team.active_projects_count ?? 1}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-2">
                    <span className="text-[10px] uppercase font-mono text-[#5B5045] block font-semibold">Works</span>
                    <span className="text-base font-mono tabular-nums font-bold text-[#342F2A]">
                      {team.contribution_count}
                    </span>
                  </div>
                </div>

                {/* Enter Workspace Action */}
                <div className="flex items-center justify-between text-xs text-[#342F2A] font-bold pt-1">
                  <span>Enter Spatial Workspace</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-[#5B5045]" />
                </div>
              </div>
            </div>
          );
        })}

        {/* The "+" Add Team Card (Warm #E8DED2 with dashed #B8A48D border) */}
        <div
          onClick={onOpenAddTeam}
          className="min-w-[240px] sm:min-w-[260px] rounded-2xl border border-dashed border-[#B8A48D] bg-[#E8DED2]/60 hover:bg-[#E8DED2] hover:border-[#5B5045] transition-all duration-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer group shadow-sm"
        >
          <div className="h-14 w-14 rounded-full border border-[#B8A48D] bg-[#F3F0E9] flex items-center justify-center text-[#5B5045] group-hover:border-[#342F2A] group-hover:text-[#342F2A] group-hover:scale-110 transition-all shadow-inner">
            <Plus className="h-6 w-6" />
          </div>
          <h4 className="font-serif text-lg font-bold text-[#342F2A] mt-4">
            Add Team Space
          </h4>
          <p className="text-xs text-[#5B5045] mt-1 max-w-[180px] leading-relaxed">
            Provision a new workstation environment for an engineering team.
          </p>
        </div>
      </div>
    </div>
  );
};
