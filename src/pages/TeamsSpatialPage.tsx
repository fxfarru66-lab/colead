import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { apiService } from '../services/api';
import { TeamHorizontalScroll } from '../components/TeamHorizontalScroll';
import { TeamWorkspaceRoom } from '../components/TeamWorkspaceRoom';
import { DeepMemberProfile } from '../components/DeepMemberProfile';
import { AddTeamModal } from '../components/AddTeamModal';

interface TeamsSpatialPageProps {
  initialSelectedTeamId?: string | null;
  initialSelectedPersonId?: string | null;
}

export const TeamsSpatialPage: React.FC<TeamsSpatialPageProps> = ({
  initialSelectedTeamId = null,
  initialSelectedPersonId = null,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Flow State
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [deepPersonId, setDeepPersonId] = useState<string | null>(initialSelectedPersonId);
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await apiService.getTeams();
        setTeams(data);
        if (initialSelectedTeamId) {
          const match = data.find((t) => t.id === initialSelectedTeamId);
          if (match) setSelectedTeam(match);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load team spaces');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialSelectedTeamId]);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setDeepPersonId(null);
  };

  const handleBackToCollection = () => {
    setSelectedTeam(null);
    setDeepPersonId(null);
  };

  const handleOpenPersonDetail = (personId: string) => {
    setDeepPersonId(personId);
  };

  const handleBackToWorkspace = () => {
    setDeepPersonId(null);
  };

  const handleTeamCreated = (newTeam: Team) => {
    setTeams((prev) => [...prev, newTeam]);
    setSelectedTeam(newTeam);
  };

  if (loading) {
    return (
      <div className="py-16 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-[#E8DED2] rounded" />
        <div className="h-80 bg-[#E8DED2] rounded-2xl border border-[#B8A48D]/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-sm text-red-400 space-y-2">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-[#d4a373] underline"
        >
          Reload
        </button>
      </div>
    );
  }

  // STAGE 4: Deep Personal Organizational Record
  if (deepPersonId) {
    return (
      <DeepMemberProfile
        personId={deepPersonId}
        onBack={handleBackToWorkspace}
      />
    );
  }

  // STAGE 3: Selected Team Spatial Workspace (2.5D Room with Dynamic Chairs)
  if (selectedTeam) {
    return (
      <TeamWorkspaceRoom
        team={selectedTeam}
        onBackToCollection={handleBackToCollection}
        onOpenPersonDetail={handleOpenPersonDetail}
      />
    );
  }

  // STAGE 2: Team Collection Track with Horizontal Scrolling and "+" Button
  return (
    <>
      <TeamHorizontalScroll
        teams={teams}
        onSelectTeam={handleSelectTeam}
        onOpenAddTeam={() => setIsAddTeamOpen(true)}
      />

      <AddTeamModal
        isOpen={isAddTeamOpen}
        onClose={() => setIsAddTeamOpen(false)}
        onTeamCreated={handleTeamCreated}
      />
    </>
  );
};
