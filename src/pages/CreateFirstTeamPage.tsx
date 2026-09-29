import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Search, X, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';
import { Person, Team } from '../types';

interface CreateFirstTeamPageProps {
  onBack: () => void;
  onTeamCreated: (newTeam: Team) => void;
}

export const CreateFirstTeamPage: React.FC<CreateFirstTeamPageProps> = ({
  onBack,
  onTeamCreated,
}) => {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPeople() {
      try {
        const list = await apiService.getPeople();
        setPeople(list);
        // Pre-select a couple demo members
        if (list.length >= 2) {
          setSelectedMemberIds([list[0].id, list[1].id]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadPeople();
  }, []);

  const handleToggleMember = (pid: string) => {
    if (selectedMemberIds.includes(pid)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== pid));
    } else {
      setSelectedMemberIds([...selectedMemberIds, pid]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      setError('Please provide a team name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await apiService.createTeam({
        name: teamName.trim(),
        subtitle: 'Product & Innovation',
        department: 'Product Development',
        mission: teamDescription.trim() || 'Drive customer value through validated releases and continuous learning.',
        member_ids: selectedMemberIds,
      });
      onTeamCreated(created);
    } catch (err: any) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const filteredPeople = people.filter((p) =>
    p.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    p.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-8 animate-fade-in text-[#342F2A]">
      {/* Center 3D-styled token pedestal & Headings matching Screen 2 */}
      <div className="text-center space-y-4 pt-4">
        {/* Subtle pedestal with + icon */}
        <div className="relative inline-flex items-center justify-center">
          {/* Pedestal shadow/base */}
          <div className="w-24 h-5 bg-[#CBBDAF]/40 rounded-full blur-[4px] absolute -bottom-1" />
          {/* Pedestal tiered discs */}
          <div className="w-20 h-7 rounded-full bg-gradient-to-b from-[#E8DED2] to-[#D5C8B8] border border-[#B8A48D]/70 shadow-sm flex items-center justify-center">
            {/* Top token */}
            <div className="w-12 h-12 -mt-5 rounded-full bg-gradient-to-b from-[#FAF7F2] to-[#E8DED2] border border-[#B8A48D] shadow-md flex items-center justify-center text-[#5B5045]">
              <Plus className="h-6 w-6 stroke-[2]" />
            </div>
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
            Create Your First Team
          </h1>
          <p className="text-xs sm:text-sm text-[#5B5045] font-light max-w-md mx-auto">
            Start building your team and capture the knowledge behind your work.
          </p>
        </div>
      </div>

      {/* Elegant Centered Form Card matching Screen 2 */}
      <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#FBF9F5] p-8 sm:p-10 shadow-lg space-y-6">
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-50 p-3 text-xs text-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase tracking-wider">
              Team Name
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Product Development"
              className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase tracking-wider">
              Team Members
            </label>
            <div className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search and add members..."
                  className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 pl-3.5 pr-10 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-colors"
                />
                <Search className="absolute right-3.5 h-4 w-4 text-[#7E7266] pointer-events-none" />
              </div>

              {/* Selected Member Chips */}
              {selectedMemberIds.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedMemberIds.map((id) => {
                    const member = people.find((p) => p.id === id);
                    if (!member) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8DED2] border border-[#B8A48D] text-xs font-medium text-[#342F2A]"
                      >
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{member.name}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleMember(id)}
                          className="text-[#7E7266] hover:text-[#342F2A]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Dropdown Suggestions if searching */}
              {memberSearch && (
                <div className="rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9] p-2 max-h-40 overflow-y-auto space-y-1">
                  {filteredPeople.map((p) => {
                    const isSelected = selectedMemberIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleToggleMember(p.id)}
                        className={`px-3 py-1.5 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#E8DED2] font-semibold text-[#342F2A]'
                            : 'hover:bg-[#E8DED2]/60 text-[#5B5045]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={p.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                          <span>{p.name} ({p.role})</span>
                        </div>
                        {isSelected && <span className="text-[10px] text-[#342F2A]">Selected</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B5045] mb-1.5 font-mono uppercase tracking-wider">
              Team Description (optional)
            </label>
            <textarea
              rows={3}
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              placeholder="Brief description about the team..."
              className="w-full rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 p-3.5 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#B8A48D]/30">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B5045] hover:text-[#342F2A] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-10 px-6 rounded-lg bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold tracking-wide transition-all shadow-md disabled:opacity-50"
            >
              <span>{loading ? 'Creating...' : 'Create Team'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
