import React, { useState } from 'react';
import { Organization } from '../types';
import { apiService } from '../services/api';
import {
  Building2,
  Compass,
  Users,
  Layers,
  Database,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Save,
} from 'lucide-react';

interface OrganizationSetupProps {
  organization: Organization;
  onUpdate: (updated: Organization) => void;
  onContinueToTeams: () => void;
}

export const OrganizationSetup: React.FC<OrganizationSetupProps> = ({
  organization,
  onUpdate,
  onContinueToTeams,
}) => {
  const [formData, setFormData] = useState<Organization>(organization);
  const [activeSection, setActiveSection] = useState<'01' | '02' | '03' | '04' | '05'>('01');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof Organization, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiService.updateOrganization(formData);
      onUpdate(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update organization profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10 animate-fade-in text-[#342F2A]">
      {/* Editorial Landing Hero: CO-LEAD Introduction */}
      <div className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2] p-8 sm:p-12 text-center space-y-5 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#B8A48D] bg-[#F3F0E9] text-[11px] font-mono tracking-widest text-[#5B5045] uppercase font-semibold">
          <Sparkles className="h-3 w-3 text-[#5B5045]" />
          <span>Stage 01 · Organization Profile</span>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#342F2A]">
            {formData.name || 'CO-LEAD'}
          </h1>
          <p className="font-serif italic text-lg sm:text-2xl text-[#5B5045] tracking-wide">
            {formData.tagline || 'Organizational Memory, Built for the People Who Create It.'}
          </p>
        </div>

        <p className="text-sm text-[#5B5045] max-w-2xl mx-auto leading-relaxed font-light">
          {formData.description ||
            'Co-Lead bridges teams, software projects, and individual engineering breakthroughs into persistent institutional context so technical knowledge is never lost.'}
        </p>

        {/* Action Button to Transition Directly to Stage 2 Teams */}
        <div className="pt-3">
          <button
            onClick={onContinueToTeams}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#342F2A] bg-[#5B5045] hover:bg-[#342F2A] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm"
          >
            <span>Proceed to Spatial Team Spaces</span>
            <ArrowRight className="h-4 w-4 text-[#E8DED2]" />
          </button>
        </div>
      </div>

      {/* 5-Section Organization Setup / Configuration */}
      <div className="space-y-6">
        {/* Section Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#B8A48D]/40 pb-2 overflow-x-auto no-scrollbar gap-4 text-xs font-mono">
          {[
            { id: '01', label: '01 — ORGANIZATION' },
            { id: '02', label: '02 — BUSINESS' },
            { id: '03', label: '03 — PEOPLE' },
            { id: '04', label: '04 — TEAMS' },
            { id: '05', label: '05 — MEMORY' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`py-1.5 whitespace-nowrap transition-colors relative font-semibold ${
                activeSection === tab.id
                  ? 'text-[#342F2A]'
                  : 'text-[#7E7266] hover:text-[#342F2A]'
              }`}
            >
              {tab.label}
              {activeSection === tab.id && (
                <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-[#5B5045] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Form Container: #E8DED2 */}
        <form onSubmit={handleSave} className="rounded-xl border border-[#B8A48D]/60 bg-[#E8DED2] p-6 space-y-6 shadow-sm">
          {savedSuccess && (
            <div className="rounded-lg border border-[#B8A48D] bg-[#F3F0E9] p-3.5 text-xs text-[#342F2A] flex items-center gap-2 animate-fade-in font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#5B5045] shrink-0" />
              <span>Organization profile updated successfully. Context has been preserved.</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-800 bg-red-100 p-3 text-xs text-red-900">
              {error}
            </div>
          )}

          {/* Section 01: Organization */}
          {activeSection === '01' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                01 — Primary Identity &amp; Organization
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Organization / Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Editorial Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => handleChange('industry', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Business Type
                  </label>
                  <input
                    type="text"
                    value={formData.business_type}
                    onChange={(e) => handleChange('business_type', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 02: Business & Mission */}
          {activeSection === '02' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                02 — Business Domain &amp; Mission
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Primary Technical Domain
                  </label>
                  <input
                    type="text"
                    value={formData.primary_domain}
                    onChange={(e) => handleChange('primary_domain', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={formData.mission}
                    onChange={(e) => handleChange('mission', e.target.value)}
                    className="w-full rounded-lg border border-[#B8A48D] bg-[#F3F0E9] p-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Organization Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full rounded-lg border border-[#B8A48D] bg-[#F3F0E9] p-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 03: People & Location */}
          {activeSection === '03' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                03 — People, Location &amp; Scale
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Team Size
                  </label>
                  <input
                    type="text"
                    value={formData.team_size}
                    onChange={(e) => handleChange('team_size', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Primary Location / HQ
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5B5045] mb-1.5">
                    Internal Portal / Website
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] px-3 text-xs text-[#342F2A] focus:outline-none focus:border-[#5B5045]"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 text-xs text-[#5B5045] leading-relaxed">
                <span className="text-[#342F2A] font-semibold">Contributor Attribution Contract:</span> Every engineer and designer in this organization has their contributions indexed as discrete, verifiable units. Ownership is decoupled from contribution.
              </div>
            </div>
          )}

          {/* Section 04: Teams Overview */}
          {activeSection === '04' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                04 — Teams &amp; Workstations Architecture
              </h3>
              <p className="text-xs text-[#5B5045]">
                Your organization is configured with dedicated spatial team environments. Each team workspace dynamically allocates physical workstations/chairs matching team size.
              </p>
              <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 text-xs text-[#342F2A] flex items-center justify-between">
                <span>Manage and explore teams in the spatial collection</span>
                <button
                  type="button"
                  onClick={onContinueToTeams}
                  className="text-xs font-semibold text-[#5B5045] hover:underline"
                >
                  Open Team Collection →
                </button>
              </div>
            </div>
          )}

          {/* Section 05: Memory & Hindsight */}
          {activeSection === '05' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#342F2A]">
                05 — Organizational Memory Engine
              </h3>
              <div className="rounded-lg border border-[#B8A48D]/50 bg-[#F3F0E9] p-4 space-y-2 text-xs text-[#5B5045]">
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7266]">Memory Service:</span>
                  <span className="font-mono text-[#342F2A] font-semibold">Hindsight Cloud API</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7266]">Official Base URL:</span>
                  <span className="font-mono text-[#342F2A]">https://api.hindsight.vectorize.io</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7266]">Active Bank ID:</span>
                  <span className="font-mono text-[#342F2A] font-bold">colead</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#B8A48D]/30">
                  <span className="text-[#7E7266]">Engine Status:</span>
                  <span className="font-mono text-[#5B5045] font-bold">Configured &amp; Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#B8A48D]/40">
            <div className="flex items-center gap-2">
              {activeSection !== '01' && (
                <button
                  type="button"
                  onClick={() => {
                    const sections: Array<'01' | '02' | '03' | '04' | '05'> = ['01', '02', '03', '04', '05'];
                    const idx = sections.indexOf(activeSection);
                    if (idx > 0) setActiveSection(sections[idx - 1]);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] text-xs text-[#5B5045] hover:text-[#342F2A]"
                >
                  Previous
                </button>
              )}
              {activeSection !== '05' && (
                <button
                  type="button"
                  onClick={() => {
                    const sections: Array<'01' | '02' | '03' | '04' | '05'> = ['01', '02', '03', '04', '05'];
                    const idx = sections.indexOf(activeSection);
                    if (idx < sections.length - 1) setActiveSection(sections[idx + 1]);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#B8A48D] bg-[#F3F0E9] text-xs text-[#342F2A] font-semibold hover:border-[#5B5045]"
                >
                  Next Section
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#342F2A] bg-[#5B5045] hover:bg-[#342F2A] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm"
              >
                <Save className="h-3.5 w-3.5 text-[#E8DED2]" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
