import React, { useState, useEffect } from 'react';
import { UserSession, Organization, OrganizationMember } from '../types';
import { apiService } from '../services/api';
import {
  Building2,
  Copy,
  Check,
  RefreshCw,
  Users,
  Shield,
  Calendar,
  Globe,
  MapPin,
  Briefcase,
  Sparkles,
  Info,
  Edit2
} from 'lucide-react';

interface OrganizationPageProps {
  currentUser: UserSession;
  onOpenPersonProfile?: (personId: string) => void;
}

export const OrganizationPage: React.FC<OrganizationPageProps> = ({
  currentUser,
  onOpenPersonProfile,
}) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Edit fields
  const [name, setName] = useState('');
  const [businessPurpose, setBusinessPurpose] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');

  const isCreatorOrAdmin = currentUser.is_creator || currentUser.role.includes('Admin') || currentUser.role.includes('Lead');

  useEffect(() => {
    loadOrgData();
  }, []);

  async function loadOrgData() {
    setLoading(true);
    try {
      const org = await apiService.getOrganization();
      setOrganization(org);
      setName(org.name || '');
      setBusinessPurpose(org.business_purpose || '');
      setTagline(org.tagline || '');
      setDescription(org.description || '');
      setMission(org.mission || '');
      setLocation(org.location || 'San Francisco, CA');
      setWebsite(org.website || '');

      const memberList = await apiService.getOrganizationMembers();
      setMembers(memberList);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load organization records');
    } finally {
      setLoading(false);
    }
  }

  const handleCopyJoinCode = () => {
    if (!organization?.join_code) return;
    navigator.clipboard.writeText(organization.join_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRegenerateCode = async () => {
    if (!confirm('Are you sure you want to regenerate the join code? The previous code will no longer work for new members.')) {
      return;
    }
    setRegenerating(true);
    setErrorMessage(null);
    try {
      const res = await apiService.regenerateJoinCode();
      if (organization) {
        setOrganization({
          ...organization,
          join_code: res.join_code,
        });
      }
      setSuccessMessage(`New Organization Join Code generated: ${res.join_code}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to regenerate join code');
    } finally {
      setRegenerating(false);
    }
  };

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOrg(true);
    setErrorMessage(null);
    try {
      await apiService.updateOrganization({
        name,
        business_purpose: businessPurpose,
        tagline,
        description,
        mission,
        location,
        website,
      });
      setIsEditing(false);
      setSuccessMessage('Organization details updated successfully.');
      loadOrgData();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update organization');
    } finally {
      setSavingOrg(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266]">Loading Organization Memory...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Top Editorial Header */}
      <div className="border-b border-[#B8A48D]/35 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#7E7266] mb-2">
          <span>Enterprise Memory Workspace</span>
          <span>·</span>
          <span className="text-[#342F2A] font-semibold">{organization?.name || 'Organization'}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
              Organization &amp; Access Control
            </h1>
            <p className="text-xs sm:text-sm text-[#5B5045] mt-1 font-light">
              Manage organization attributes, generate employee invitation join codes, and view registered members.
            </p>
          </div>
          {isCreatorOrAdmin && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2] text-[#342F2A] hover:bg-[#d8ccbe] text-xs font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Organization'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="rounded-xl border border-green-700/30 bg-green-50 p-4 text-xs text-green-900 flex items-center gap-2.5 shadow-sm">
          <Check className="h-4 w-4 text-green-700 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-700/30 bg-red-50 p-4 text-xs text-red-900 flex items-center gap-2.5 shadow-sm">
          <Info className="h-4 w-4 text-red-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Core Join Code Card (Prominent Enterprise Feature) */}
      <div className="rounded-2xl border-2 border-[#B8A48D] bg-[#FBF9F5] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-[#342F2A] text-[#F3F0E9]">
                Employee Access Code
              </span>
              <span className="text-xs text-[#7E7266] font-mono">Backend Generated</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#342F2A]">
              Organization Join Code
            </h2>
            <p className="text-xs text-[#5B5045] leading-relaxed">
              Share this code with employees to allow them to join <span className="font-semibold text-[#342F2A]">{organization?.name}</span>.
              New team members select <span className="italic font-medium">"Join an existing organization"</span> at sign in.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="h-14 px-6 rounded-xl border-2 border-[#342F2A] bg-[#F3F0E9] flex items-center justify-center font-mono text-xl sm:text-2xl font-bold tracking-widest text-[#342F2A] shadow-inner select-all">
              {organization?.join_code || 'COLEAD-9X2P4'}
            </div>

            <button
              onClick={handleCopyJoinCode}
              className="h-14 px-5 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              {copiedCode ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Code Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Join Code</span>
                </>
              )}
            </button>

            {isCreatorOrAdmin && (
              <button
                onClick={handleRegenerateCode}
                disabled={regenerating}
                title="Regenerate Join Code"
                className="h-14 px-4 rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2] hover:bg-[#d8ccbe] text-[#342F2A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Regenerate</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#B8A48D]/30 flex flex-wrap items-center justify-between text-xs text-[#7E7266] gap-2">
          <span>Security Note: Unpredictable enterprise join code. Does not expose internal database IDs.</span>
          <span>Requires Application Password verification</span>
        </div>
      </div>

      {/* Edit Organization Form */}
      {isEditing && (
        <form onSubmit={handleSaveOrganization} className="rounded-2xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#342F2A] border-b border-[#B8A48D]/30 pb-3">
            Edit Organization Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Organization Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Business Purpose
              </label>
              <input
                type="text"
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Tagline / Core Proposition
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 p-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Location / Headquarters
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#B8A48D]/30">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border border-[#B8A48D]/60 text-xs font-semibold text-[#5B5045] hover:bg-[#E8DED2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingOrg}
              className="px-6 py-2 rounded-lg bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {savingOrg ? 'Saving...' : 'Save Organization Details'}
            </button>
          </div>
        </form>
      )}

      {/* Organization Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#7E7266]">
            <Building2 className="h-4 w-4" />
            <span className="text-[11px] font-mono uppercase font-bold">Business Purpose</span>
          </div>
          <div className="text-base font-serif font-bold text-[#342F2A]">
            {organization?.business_purpose || 'Technology & Engineering'}
          </div>
          <p className="text-xs text-[#5B5045] leading-relaxed">
            {organization?.industry || 'Enterprise Software & Distributed Systems'}
          </p>
        </div>

        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#7E7266]">
            <Users className="h-4 w-4" />
            <span className="text-[11px] font-mono uppercase font-bold">Organization Scale</span>
          </div>
          <div className="text-base font-serif font-bold text-[#342F2A]">
            {members.length} Active Members
          </div>
          <p className="text-xs text-[#5B5045] leading-relaxed">
            Preserving collective attribution across product, design, and engineering teams.
          </p>
        </div>

        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 space-y-3">
          <div className="flex items-center gap-2 text-[#7E7266]">
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] font-mono uppercase font-bold">Core Principle</span>
          </div>
          <div className="text-base font-serif font-bold text-[#342F2A]">
            Attribution vs Ownership
          </div>
          <p className="text-xs text-[#5B5045] leading-relaxed">
            "Ownership is not the same as contribution." Remembering what people actually solved.
          </p>
        </div>
      </div>

      {/* Members Who Joined This Organization Section */}
      <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#B8A48D]/30 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#342F2A] flex items-center gap-2.5">
              <Users className="h-5 w-5 text-[#5B5045]" />
              <span>Members Who Joined {organization?.name}</span>
            </h2>
            <p className="text-xs text-[#5B5045] mt-1 font-light">
              All registered employees and contributors in this organization repository.
            </p>
          </div>
          <span className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-[#E8DED2] text-[#342F2A] self-start sm:self-auto border border-[#B8A48D]/40">
            {members.length} Total Members
          </span>
        </div>

        {/* Member Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.person_id}
              className="rounded-xl border border-[#B8A48D]/40 bg-[#F3F0E9]/60 p-4 space-y-3 hover:border-[#342F2A] transition-all group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                  alt={member.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#B8A48D] shadow-xs group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-[#342F2A] truncate">{member.name}</h3>
                    {member.is_creator && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold bg-[#342F2A] text-[#F3F0E9]">
                        Creator
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5B5045] truncate">{member.title || member.role}</p>
                  <p className="text-[11px] text-[#7E7266] truncate">{member.email}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#B8A48D]/25 flex items-center justify-between text-[11px] text-[#7E7266]">
                <span className="font-medium text-[#5B5045]">{member.team_name || member.department || 'General'}</span>
                {onOpenPersonProfile && (
                  <button
                    onClick={() => onOpenPersonProfile(member.person_id)}
                    className="text-[#342F2A] font-semibold hover:underline"
                  >
                    View Record →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
