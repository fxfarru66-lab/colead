import React, { useRef, useState, useEffect } from 'react';
import { Team } from '../types';
import { apiService } from '../services/api';
import { BronzeMedallion } from '../components/BronzeMedallion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Briefcase,
  Layers,
} from 'lucide-react';

interface TeamsPageProps {
  onSelectTeam: (team: Team) => void;
  onOpenCreateTeam: () => void;
}

export const TeamsPage: React.FC<TeamsPageProps> = ({
  onSelectTeam,
  onOpenCreateTeam,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiService.getTeams();
        setTeams(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load teams');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [teams]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <div className="py-6 space-y-8 animate-fade-in text-[#342F2A]">
      {/* Top Header matching Screen 3 in reference */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#B8A48D]/30 pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
            Your Teams
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5045] font-light mt-1">
            Explore and manage your teams
          </p>
        </div>

        <button
          onClick={onOpenCreateTeam}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold tracking-wide transition-all shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 text-[#E8DED2]" />
          <span>+ Add Team</span>
        </button>
      </div>

      {loading ? (
        <div className="flex gap-6 overflow-hidden py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[260px] h-[340px] rounded-2xl bg-[#E8DED2] animate-pulse border border-[#B8A48D]/40"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center text-sm text-red-700 bg-red-50 rounded-2xl border border-red-200">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Horizontal Scroll Track matching Screen 3 */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollState}
            className="flex items-stretch gap-6 overflow-x-auto py-4 px-1 no-scrollbar scroll-smooth"
          >
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => onSelectTeam(team)}
                className="min-w-[250px] sm:min-w-[270px] max-w-[290px] rounded-2xl border border-[#B8A48D]/50 bg-[#E8DED2] hover:bg-[#E2D6C8] hover:border-[#342F2A] transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                {/* Bronze Medallion Icon */}
                <div className="mb-5 transform group-hover:scale-105 transition-transform">
                  <BronzeMedallion
                    size="md"
                    type={team.icon_type || 'bronze_sphere'}
                  />
                </div>

                {/* Team Name & Subtitle matching Screen 3 */}
                <div className="space-y-1 mb-6 flex-1">
                  <h3 className="font-serif text-lg font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-xs text-[#5B5045] font-light">
                    {team.subtitle || team.department}
                  </p>
                </div>

                {/* Team Metrics list matching Screen 3 */}
                <div className="w-full pt-4 border-t border-[#B8A48D]/40 space-y-2 text-xs text-[#5B5045] text-left">
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-[#7E7266] shrink-0" />
                    <span>{team.member_count} Members</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-[#7E7266] shrink-0" />
                    <span>{team.project_count || team.projects?.length || 3} Projects</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-[#7E7266] shrink-0" />
                    <span>{team.contribution_count} Contributions</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Circular "+ Add Team" Card matching Screen 3 */}
            <div
              onClick={onOpenCreateTeam}
              className="min-w-[140px] sm:min-w-[160px] rounded-2xl border border-dashed border-[#B8A48D] bg-[#E8DED2]/40 hover:bg-[#E8DED2] hover:border-[#342F2A] transition-all duration-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full border border-[#B8A48D] bg-[#F3F0E9] flex items-center justify-center text-[#5B5045] group-hover:scale-110 group-hover:text-[#342F2A] group-hover:border-[#342F2A] transition-all shadow-sm">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-[#5B5045] group-hover:text-[#342F2A] mt-3 transition-colors">
                Add Team
              </span>
            </div>
          </div>

          {/* Bottom Scroll Controls matching Screen 3: (←) ───[━━]─── (→) */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#D5C8B8] flex items-center justify-center text-[#342F2A] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Horizontal Track Indicator Line */}
            <div className="w-48 sm:w-64 h-1 bg-[#D5C8B8] rounded-full overflow-hidden relative">
              <div
                className="h-full bg-[#5B5045] rounded-full transition-all duration-200"
                style={{
                  width: '32%',
                  transform: `translateX(${scrollProgress * 2.1}%)`,
                }}
              />
            </div>

            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#D5C8B8] flex items-center justify-center text-[#342F2A] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
