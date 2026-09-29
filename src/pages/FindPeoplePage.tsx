import React, { useState, useEffect } from 'react';
import { Person } from '../types';
import { apiService } from '../services/api';
import { Search, ArrowRight, Plus, Check, Briefcase } from 'lucide-react';

interface FindPeoplePageProps {
  onOpenPersonProfile: (personId: string) => void;
}

export const FindPeoplePage: React.FC<FindPeoplePageProps> = ({
  onOpenPersonProfile,
}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [assignedMap, setAssignedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const list = await apiService.getPeople();
        setPeople(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAssign = (e: React.MouseEvent, personId: string) => {
    e.stopPropagation();
    setAssignedMap((prev) => ({ ...prev, [personId]: !prev[personId] }));
  };

  const filteredPeople = people.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q) ||
      (p.skills && p.skills.toLowerCase().includes(q)) ||
      (p.team_name && p.team_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="py-6 space-y-10 max-w-5xl mx-auto animate-fade-in text-[#342F2A]">
      {/* Header matching Screen 6 */}
      <div className="text-center sm:text-left space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
          Find the Right People
        </h1>
        <p className="text-xs sm:text-sm text-[#5B5045] font-light max-w-xl">
          Search by project, skill, or requirement. Get the right people who have worked on similar things.
        </p>
      </div>

      {/* Large Search Bar matching Screen 6 */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-[#7E7266] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="e.g. 'React developer', 'API integration', 'mobile app'..."
          className="w-full h-14 pl-12 pr-16 rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2] text-sm text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-all shadow-sm"
        />
        <button
          type="button"
          onClick={() => {}}
          className="absolute right-2.5 w-9 h-9 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] flex items-center justify-center transition-all shadow-sm"
        >
          <ArrowRight className="h-4 w-4 text-[#E8DED2]" />
        </button>
      </div>

      {/* Suggested People Section matching Screen 6 */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#B8A48D]/30 pb-3">
          <h2 className="font-serif text-xl font-bold text-[#342F2A]">
            Suggested People
          </h2>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-56 rounded-2xl bg-[#E8DED2] border border-[#B8A48D]/40 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#E8DED2] p-12 text-center text-xs text-[#7E7266]">
            No contributors found matching "{searchQuery}". Try searching for "React", "UX", "Backend", or "Mobile".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPeople.map((person) => {
              const isAssigned = Boolean(assignedMap[person.id]);

              return (
                <div
                  key={person.id}
                  onClick={() => onOpenPersonProfile(person.id)}
                  className="rounded-2xl border border-[#B8A48D]/50 bg-[#E8DED2] hover:bg-[#E2D6C8] hover:border-[#342F2A] transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer group shadow-sm hover:shadow-md hover:-translate-y-1 relative"
                >
                  {/* Photo Avatar matching Screen 6 */}
                  <div className="relative mb-4">
                    <img
                      src={person.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80'}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#B8A48D] group-hover:border-[#342F2A] transition-all shadow-sm"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-600 border-2 border-[#E8DED2]" />
                  </div>

                  {/* Name and Role */}
                  <div className="space-y-0.5 mb-3">
                    <h3 className="font-serif text-base font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-xs text-[#5B5045] font-light">
                      {person.role}
                    </p>
                  </div>

                  {/* Relevant Project Count */}
                  <div className="text-[11px] font-mono text-[#7E7266] mb-5">
                    {person.relevant_projects_count || person.contribution_count || 3} relevant projects
                  </div>

                  {/* Small '+' Button matching Screen 6 */}
                  <button
                    type="button"
                    onClick={(e) => handleAssign(e, person.id)}
                    title={isAssigned ? 'Assigned' : 'Add person to team/work assignment'}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      isAssigned
                        ? 'bg-emerald-700 text-[#F3F0E9]'
                        : 'bg-[#5B5045] hover:bg-[#342F2A] text-[#F3F0E9] group-hover:scale-110'
                    }`}
                  >
                    {isAssigned ? (
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    ) : (
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
