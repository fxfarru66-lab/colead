import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building, Key, Check, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { UserSession } from '../types';

interface SignInPageProps {
  onSignInSuccess: (user: UserSession, requires2FA?: boolean, email?: string, orgName?: string) => void;
  onBypassToApp: () => void;
}

type AuthMode = 'signin' | 'join' | 'create';

export const SignInPage: React.FC<SignInPageProps> = ({
  onSignInSuccess,
  onBypassToApp,
}) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  // Common Form States
  const [email, setEmail] = useState('sarah.kim@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [accessPassword, setAccessPassword] = useState('');
  const [showAccessPassword, setShowAccessPassword] = useState(false);
  const [fullName, setFullName] = useState('');

  // Organization Specific States
  const [organizationName, setOrganizationName] = useState('Acme Technologies');
  const [businessPurpose, setBusinessPurpose] = useState('Software & Engineering');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [verifiedOrg, setVerifiedOrg] = useState<{ id: string; name: string; business_purpose?: string; join_code: string } | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // 1. Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiService.signIn({
        email: email.trim(),
        password,
      });

      onSignInSuccess(res.user, false);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Verify Join Code
  const handleVerifyJoinCode = async () => {
    if (!joinCodeInput.trim()) {
      setError('Please enter your organization join code.');
      return;
    }

    setVerifyingCode(true);
    setError(null);
    setVerifiedOrg(null);

    try {
      const res = await apiService.verifyJoinCode(joinCodeInput.trim().toUpperCase());
      if (res.valid && res.organization) {
        setVerifiedOrg(res.organization);
        setSuccessNotice(`Organization found: ${res.organization.name}`);
      } else {
        setError('Organization code not found.');
      }
    } catch (err: any) {
      setError(err.message || 'Organization code not found.');
    } finally {
      setVerifyingCode(false);
    }
  };

  // 3. Handle Complete Join Organization
  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedOrg) {
      setError('Please verify your organization join code first.');
      return;
    }
    if (!fullName || !email || !accessPassword) {
      setError('Please provide your name, email, and the application access password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiService.joinOrganization({
        joinCode: verifiedOrg.join_code,
        name: fullName.trim(),
        email: email.trim(),
        password,
        accessPassword: accessPassword.trim(),
      });

      onSignInSuccess(res.user, false);
    } catch (err: any) {
      setError(err.message || 'Failed to join organization.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Create New Organization
  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationName || !fullName || !email || !accessPassword) {
      setError('Organization name, your name, email, and the application access password are required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiService.createOrganization({
        organizationName: organizationName.trim(),
        businessPurpose: businessPurpose.trim(),
        creatorName: fullName.trim(),
        email: email.trim(),
        password,
        accessPassword: accessPassword.trim(),
      });

      onSignInSuccess(res.user, false);
    } catch (err: any) {
      setError(err.message || 'Failed to create organization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F3F0E9] flex flex-col justify-between text-[#342F2A] relative overflow-hidden animate-page-enter">
      {/* Background Architectural Ambient Texture */}
      <div className="absolute right-0 top-0 w-2/3 h-full opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_70%_20%,#B8A48D_0%,transparent_65%)]" />

      {/* Main Split-Screen Container (Section 3) */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        
        {/* LEFT SIDE: Premium Visual Story & Branding */}
        <div className="lg:col-span-6 space-y-8 max-w-xl">
          <div className="space-y-3">
            <span className="font-heading text-3xl font-extrabold tracking-tight text-[#342F2A] block">
              CoLead
            </span>
            <span className="text-[11px] font-mono tracking-widest text-[#7E7266] uppercase font-semibold block">
              Organizational Experience Intelligence
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#342F2A] leading-[1.12] tracking-tight">
            Organizational<br />
            Memory, Built for<br />
            the People Who<br />
            Create It.
          </h1>

          <p className="text-base sm:text-lg text-[#5B5045] leading-relaxed max-w-md font-light">
            Capture, connect and preserve your organization's knowledge. Turn everyday work into lasting intelligence.
          </p>

          <div className="pt-6 border-t border-[#B8A48D]/30 space-y-1.5 text-xs text-[#5B5045]">
            <p className="font-medium text-[#342F2A]">
              Better decisions · Smarter teams · Lasting impact
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Clean Enterprise Authentication Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-3xl border border-[#B8A48D]/60 bg-[#FBF9F5] p-6 sm:p-9 shadow-xl space-y-6 card-3d">
            
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-[#E8DED2]/70 p-1 border border-[#B8A48D]/40 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('join');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  authMode === 'join'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                Join Org
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('create');
                  setError(null);
                  setSuccessNotice(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all text-center cursor-pointer ${
                  authMode === 'create'
                    ? 'bg-[#342F2A] text-[#F3F0E9] shadow-xs'
                    : 'text-[#5B5045] hover:text-[#342F2A]'
                }`}
              >
                Create Org
              </button>
            </div>

            {/* Header copy */}
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-[#342F2A]">
                {authMode === 'signin' && 'Welcome to CoLead'}
                {authMode === 'join' && 'Join an Existing Organization'}
                {authMode === 'create' && 'Create Your Organization'}
              </h2>
              <p className="text-xs text-[#5B5045]">
                {authMode === 'signin' && 'Organizational memory for better work.'}
                {authMode === 'join' && 'Enter your organization join code to connect.'}
                {authMode === 'create' && 'Register your organization and start capturing memory.'}
              </p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 animate-fade-in">
                {error}
              </div>
            )}
            {successNotice && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 animate-fade-in flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-[#7E7266]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#7E7266]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 pl-10 pr-10 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#7E7266] hover:text-[#342F2A]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Authenticating...' : 'Sign In to CoLead'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Quick Reviewer Demo Bypass */}
                <div className="pt-3 border-t border-[#B8A48D]/30 text-center">
                  <button
                    type="button"
                    onClick={onBypassToApp}
                    className="text-[11px] font-semibold text-[#5B5045] hover:text-[#342F2A] underline cursor-pointer"
                  >
                    Quick Enter Preview Mode (Sarah Kim) →
                  </button>
                </div>
              </form>
            )}

            {/* 2. JOIN ORGANIZATION FORM */}
            {authMode === 'join' && (
              <form onSubmit={handleJoinSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Organization Join Code</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Building className="absolute left-3.5 top-3 h-4 w-4 text-[#7E7266]" />
                      <input
                        type="text"
                        value={joinCodeInput}
                        onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                        placeholder="e.g. COLEAD-2026"
                        className="w-full h-10 pl-10 pr-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] font-mono placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyJoinCode}
                      disabled={verifyingCode}
                      className="px-4 h-10 rounded-xl bg-[#E8DED2] hover:bg-[#342F2A] hover:text-[#F3F0E9] font-semibold text-xs text-[#342F2A] transition-colors cursor-pointer shrink-0"
                    >
                      {verifyingCode ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Work Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Application Access Password</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-3 h-4 w-4 text-[#7E7266]" />
                    <input
                      type={showAccessPassword ? 'text' : 'password'}
                      required
                      value={accessPassword}
                      onChange={(e) => setAccessPassword(e.target.value)}
                      placeholder="Access security key"
                      className="w-full h-10 pl-10 pr-10 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccessPassword(!showAccessPassword)}
                      className="absolute right-3 top-3 text-[#7E7266] hover:text-[#342F2A]"
                    >
                      {showAccessPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !verifiedOrg}
                  className="w-full h-11 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Connecting...' : 'Join Organization'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* 3. CREATE ORGANIZATION FORM */}
            {authMode === 'create' && (
              <form onSubmit={handleCreateOrgSubmit} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Organization Name</label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="Acme Technologies"
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Primary Business Focus</label>
                  <input
                    type="text"
                    required
                    value={businessPurpose}
                    onChange={(e) => setBusinessPurpose(e.target.value)}
                    placeholder="Software, Robotics, Fintech..."
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Your Full Name (Org Creator)</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Kim"
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Creator Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#5B5045]">Set Access Password</label>
                  <input
                    type="password"
                    required
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    placeholder="Create security password"
                    className="w-full h-10 px-3 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] text-xs text-[#342F2A] placeholder-[#7E7266] focus:outline-none focus:border-[#342F2A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs font-semibold text-[#F3F0E9] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Creating Organization...' : 'Create CoLead Workspace'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#B8A48D]/30 py-4 text-center text-xs text-[#7E7266]">
        CoLead — Organizational Memory &amp; Experience Intelligence
      </footer>
    </div>
  );
};
