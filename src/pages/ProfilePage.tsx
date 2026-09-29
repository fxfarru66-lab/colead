import React, { useState, useEffect, useRef } from 'react';
import { UserSession, Person, Team } from '../types';
import { apiService } from '../services/api';
import {
  Camera,
  Check,
  AlertCircle,
  Briefcase,
  Mail,
  Clock,
  Sparkles,
  Layers,
  X,
  Plus,
  ShieldCheck,
  Building
} from 'lucide-react';

interface ProfilePageProps {
  currentUser: UserSession;
  onProfileUpdated?: (updatedUser: UserSession) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onProfileUpdated,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile Form States
  const [personId, setPersonId] = useState<string>('');
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState(currentUser.role || 'Member');
  const [email, setEmail] = useState(currentUser.email || '');
  const [department, setDepartment] = useState('Engineering');
  const [teamId, setTeamId] = useState<string>('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(5);
  const [areasOfExpertise, setAreasOfExpertise] = useState('');
  const [about, setAbout] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Fetch teams
        const orgTeams = await apiService.getTeams();
        setTeams(orgTeams);

        // Fetch user person details
        const session = await apiService.checkSession();
        if (session.authenticated && session.person) {
          const p = session.person;
          setPersonId(p.id);
          setFullName(p.name || currentUser.name);
          setJobTitle(p.title || p.role || currentUser.role);
          setRole(p.role || currentUser.role);
          setEmail(p.email || currentUser.email);
          setDepartment(p.department || 'Engineering');
          setTeamId(p.team_id || (orgTeams[0]?.id || ''));
          setYearsOfExperience(p.years_of_experience ?? 5);
          setAreasOfExpertise(p.areas_of_expertise || '');
          setAbout(p.about || '');
          setBio(p.bio || '');
          setAvatarUrl(p.avatar_url || currentUser.avatarUrl);

          const parsedSkills = (p.skills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          setSkillsList(parsedSkills.length > 0 ? parsedSkills : ['Collaboration', 'Problem Solving']);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load profile details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Photo exceeds 5MB size limit. Please choose a smaller image.');
      return;
    }

    setUploadingPhoto(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Url = reader.result as string;
        const uploadRes = await apiService.uploadProfilePhoto(base64Url, file.name);
        setAvatarUrl(uploadRes.avatarUrl);
        setSuccessMessage('Profile photo updated successfully.');
        if (onProfileUpdated) {
          onProfileUpdated({
            ...currentUser,
            avatarUrl: uploadRes.avatarUrl,
          });
        }
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to upload profile photo');
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read photo file.');
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload: Partial<Person> = {
        id: personId,
        name: fullName.trim(),
        title: jobTitle.trim(),
        role: role.trim(),
        department: department.trim(),
        team_id: teamId || null,
        years_of_experience: Number(yearsOfExperience),
        areas_of_expertise: areasOfExpertise.trim(),
        about: about.trim(),
        bio: bio.trim(),
        skills: skillsList.join(', '),
        avatar_url: avatarUrl,
      };

      const result = await apiService.updateProfile(payload);
      setSuccessMessage('Your profile changes have been preserved in organizational memory.');

      if (onProfileUpdated) {
        onProfileUpdated({
          ...currentUser,
          name: fullName.trim(),
          role: jobTitle.trim() || role.trim(),
          avatarUrl: avatarUrl,
        });
      }

      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#342F2A] border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-[#7E7266]">Loading Member Profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Editorial Breadcrumb & Header */}
      <div className="border-b border-[#B8A48D]/35 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#7E7266] mb-2">
          <span>Organization Member</span>
          <span>·</span>
          <span className="text-[#342F2A] font-semibold">{currentUser.organization}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#342F2A]">
              Personal Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#5B5045] mt-1 font-light">
              Ownership is not the same as contribution. Keep your background, skills, and areas of expertise up-to-date.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E8DED2] text-[#342F2A] border border-[#B8A48D]/40">
              <ShieldCheck className="h-3.5 w-3.5 text-[#5B5045]" />
              <span>Verified Contributor</span>
            </span>
          </div>
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
          <AlertCircle className="h-4 w-4 text-red-700 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Profile Card & Avatar Section */}
        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Upload Hover Button */}
            <div className="relative group shrink-0">
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                alt={fullName}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-[#B8A48D] shadow-md group-hover:opacity-90 transition-opacity"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute inset-0 rounded-2xl bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium cursor-pointer"
              >
                <Camera className="h-6 w-6 mb-1" />
                <span>{uploadingPhoto ? 'Uploading...' : 'Change Photo'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Profile Summary & Photo Requirements */}
            <div className="space-y-2 flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#342F2A]">{fullName || 'Contributor'}</h2>
                {currentUser.is_creator && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider bg-[#342F2A] text-[#F3F0E9] self-center sm:self-auto">
                    Creator
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5B5045] font-medium">{jobTitle || role}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-[#7E7266]">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{email}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5" />
                  <span>{currentUser.organization}</span>
                </span>
              </div>
              <div className="pt-2 text-[11px] text-[#7E7266] font-mono">
                Formats: JPG, PNG, WEBP (Max 5MB)
              </div>
            </div>
          </div>
        </div>

        {/* Identity & Department Card */}
        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#342F2A] border-b border-[#B8A48D]/30 pb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#5B5045]" />
            <span>Professional Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Job Title / Primary Function
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior UX Designer, Lead Engineer"
                required
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] transition-colors"
              >
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Leadership">Leadership</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Primary Team
              </label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] transition-colors"
              >
                <option value="">Unassigned</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Years of Experience
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(parseInt(e.target.value) || 0)}
                  className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] transition-colors"
                />
                <Clock className="absolute right-3 h-4 w-4 text-[#7E7266] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Work Email (Login Identity)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full h-11 rounded-lg border border-[#B8A48D]/40 bg-[#E8DED2]/50 px-3.5 text-xs text-[#5B5045] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Narrative & Bio Section */}
        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#342F2A] border-b border-[#B8A48D]/30 pb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#5B5045]" />
            <span>Narrative &amp; Context</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                About Me (High-Level Summary)
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Passionate about creating simple, user-centered digital experiences and working closely with product and engineering teams."
                className="w-full rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 p-3 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Detailed Biography
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your technical background, past systems built, and key engineering or product philosophies."
                className="w-full rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 p-3 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#5B5045] mb-1 uppercase tracking-wider font-mono">
                Areas of Expertise
              </label>
              <input
                type="text"
                value={areasOfExpertise}
                onChange={(e) => setAreasOfExpertise(e.target.value)}
                placeholder="e.g. Design Systems, Mobile UX, Accessibility (WCAG 2.1), Distributed Systems"
                className="w-full h-11 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div className="rounded-2xl border border-[#B8A48D]/40 bg-[#FBF9F5] p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#342F2A] border-b border-[#B8A48D]/30 pb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#5B5045]" />
            <span>Skills &amp; Capabilities</span>
          </h3>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#E8DED2] text-[#342F2A] border border-[#B8A48D]/60 shadow-xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#7E7266] hover:text-red-700 transition-colors p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add a skill (e.g. Figma, React, Distributed Systems)"
                className="flex-1 h-10 rounded-lg border border-[#B8A48D]/60 bg-[#F3F0E9]/70 px-3.5 text-xs text-[#342F2A] focus:outline-none focus:border-[#342F2A] transition-colors"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="h-10 px-4 rounded-lg bg-[#342F2A] text-[#F3F0E9] hover:bg-[#5B5045] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center justify-between pt-4 border-t border-[#B8A48D]/30">
          <div className="text-xs text-[#7E7266]">
            All changes are stored directly in your organization's memory repository.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="h-11 px-8 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-[#F3F0E9] text-xs font-semibold tracking-wide transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
          >
            <span>{saving ? 'Preserving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
