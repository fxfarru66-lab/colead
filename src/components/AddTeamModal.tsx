import React, { useState } from 'react';
import { X, Layers, AlertCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import { Team } from '../types';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: (newTeam: Team) => void;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  onClose,
  onTeamCreated,
}) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [mission, setMission] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a team name');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await apiService.createTeam({
        name: name.trim(),
        department: department.trim() || 'Engineering',
        mission: mission.trim() || undefined,
      });
      onTeamCreated({
        ...created,
        member_count: 0,
        contribution_count: 0,
        members: [],
        projects: [],
        active_projects_count: 0,
        memory_units: 0,
      });
      setName('');
      setMission('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create team space');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#342F2A]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-[#B8A48D] bg-[#F3F0E9] p-6 shadow-2xl text-[#342F2A] space-y-6">
        <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded border border-[#342F2A] bg-[#5B5045] flex items-center justify-center text-[#F3F0E9]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-wide text-[#342F2A]">
                Create Spatial Team Space
              </h2>
              <p className="text-[11px] text-[#5B5045]">
                Adds an interactive workstation environment to your organization.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7E7266] hover:text-[#342F2A] transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-100 p-3 text-xs text-red-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
              Team Space Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Distributed Consensus, Identity, Security"
              className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#E8DED2] px-3 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#5B5045] transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
              Department / Primary Domain
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#E8DED2] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045] transition-colors"
            >
              <option value="Engineering">Engineering</option>
              <option value="Product Engineering">Product Engineering</option>
              <option value="Infrastructure & SRE">Infrastructure &amp; SRE</option>
              <option value="Data & Intelligence">Data &amp; Intelligence</option>
              <option value="User Experience & Design">User Experience &amp; Design</option>
              <option value="Security Architecture">Security Architecture</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
              Charter &amp; Mission Statement
            </label>
            <textarea
              rows={3}
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="What core problems is this team space responsible for solving?"
              className="w-full rounded-lg border border-[#B8A48D] bg-[#E8DED2] p-3 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#5B5045] transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8A48D]/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5B5045] hover:text-[#342F2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#342F2A] bg-[#5B5045] hover:bg-[#342F2A] text-xs font-semibold text-[#F3F0E9] transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Creating...' : 'Initialize Team Space'}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#E8DED2]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
