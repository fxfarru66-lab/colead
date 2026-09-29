import React, { useState, useRef, useEffect } from 'react';
import { PageId, UserSession } from '../types';
import { LogOut, ChevronDown, Check, User, Sparkles } from 'lucide-react';

interface NavigationProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser: UserSession | null;
  onSignOut: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onSignOut,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: PageId; label: string }[] = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'work-memory', label: 'Past Work' },
    { id: 'contributions', label: 'Who Did What' },
    { id: 'ask', label: 'Ask CoLead' },
    { id: 'teams', label: 'Teams' },
    { id: 'people', label: 'People' },
    { id: 'new-work', label: 'New Work' },
  ];

  // If on team orbital view, "Teams" is the active tab
  const activeNavId = currentPage === 'team-orbit' ? 'teams' : currentPage;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#B8A48D]/35 bg-[#F3F0E9]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: CoLead Logo */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 shadow-sm border border-emerald-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 text-emerald-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" className="opacity-20" />
              <path d="M12 3a9 9 0 0 1 9 9" className="text-emerald-300" />
              <path d="M12 21a9 9 0 0 1-9-9" />
              <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" fill="currentColor" className="text-emerald-300" />
            </svg>
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tight text-[#342F2A] group-hover:text-emerald-800 transition-colors">
            Co<span className="text-emerald-700">Lead</span>
          </span>
        </button>

        {/* Center: Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-wide">
          {navItems.map((item) => {
            const isActive = activeNavId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`py-1 relative transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#342F2A] font-semibold'
                    : 'text-[#7E7266] hover:text-[#342F2A]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#342F2A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: User Avatar & Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {currentUser ? (
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 focus:outline-none group p-1 rounded-full hover:ring-2 hover:ring-[#B8A48D]/50 transition-all"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#B8A48D] shadow-sm"
              />
              <span className="hidden lg:inline text-xs font-medium text-[#342F2A]">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-[#7E7266] hidden lg:inline" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('signin')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#342F2A] bg-[#5B5045] text-[#F3F0E9] hover:bg-[#342F2A]"
            >
              Sign In
            </button>
          )}

          {/* Profile Dropdown */}
          {dropdownOpen && currentUser && (
            <div className="absolute right-0 mt-2 w-60 rounded-xl border border-[#B8A48D]/60 bg-[#F3F0E9] p-3 shadow-xl z-50 text-[#342F2A] space-y-2 animate-fade-in">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#B8A48D]/30 px-1">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#B8A48D]"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-[#5B5045] truncate">{currentUser.role}</div>
                  <div className="text-[10px] text-[#7E7266] font-mono">{currentUser.organization}</div>
                </div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-[#5B5045] hover:text-[#342F2A] hover:bg-[#E8DED2] rounded-lg transition-colors flex items-center gap-2.5 font-medium"
                >
                  <User className="h-4 w-4 text-[#5B5045]" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigate('organization');
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-[#5B5045] hover:text-[#342F2A] hover:bg-[#E8DED2] rounded-lg transition-colors flex items-center gap-2.5 font-medium"
                >
                  <Sparkles className="h-4 w-4 text-[#5B5045]" />
                  <span>Organization</span>
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigate('organization');
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-[#5B5045] hover:text-[#342F2A] hover:bg-[#E8DED2] rounded-lg transition-colors flex items-center gap-2.5 font-medium"
                >
                  <svg className="h-4 w-4 text-[#5B5045]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span>Settings</span>
                </button>
              </div>

              <div className="pt-2 border-t border-[#B8A48D]/30">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onSignOut();
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-red-800 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2.5 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="flex md:hidden overflow-x-auto border-t border-[#B8A48D]/30 px-4 py-2 gap-4 text-xs font-medium no-scrollbar bg-[#E8DED2]/30">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`whitespace-nowrap px-2 py-1 transition-colors ${
              activeNavId === item.id
                ? 'text-[#342F2A] font-bold border-b border-[#342F2A]'
                : 'text-[#7E7266]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
