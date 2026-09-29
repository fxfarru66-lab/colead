import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Person } from '../types';
import { Mail, GitCommit, Shield, ArrowRight } from 'lucide-react';

interface PeoplePageProps {
  onOpenPersonDetail: (personId: string) => void;
}

export const PeoplePage: React.FC<PeoplePageProps> = ({ onOpenPersonDetail }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiService.getPeople();
        setPeople(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load contributors');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 py-6 animate-fade-in text-[#342F2A]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#B8A48D]/40 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#5B5045] uppercase mb-1 font-semibold">
            <span>Organizational Directory</span>
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-wide text-[#342F2A]">
            People &amp; Contributors
          </h1>
          <p className="mt-1 text-xs text-[#5B5045]">
            Engineers, architects, and designers whose verified contributions compose the organization's institutional memory.
          </p>
        </div>
      </div>

      {/* Ethical Callout in #E8DED2 */}
      <div className="rounded-xl border border-[#B8A48D]/50 bg-[#E8DED2] p-4 text-xs text-[#5B5045] flex items-center gap-3">
        <Shield className="h-4 w-4 text-[#5B5045] shrink-0" />
        <span>
          <strong className="text-[#342F2A]">Non-Evaluative Context:</strong> CoLead is an institutional memory index, not a ranking or surveillance tool. All contributions are preserved for factual attribution and engineering context.
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-[#B8A48D]/40 bg-[#E8DED2] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-800 bg-red-100 p-6 text-center text-sm text-red-900">
          {error}
        </div>
      ) : people.length === 0 ? (
        <div className="rounded-xl border border-[#B8A48D]/40 bg-[#E8DED2] p-12 text-center text-sm text-[#7E7266]">
          No people records found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {people.map((person) => (
            <div
              key={person.id}
              onClick={() => onOpenPersonDetail(person.id)}
              className="rounded-2xl border border-[#B8A48D]/60 bg-[#E8DED2] p-6 space-y-4 hover:border-[#342F2A] hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-sm group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#342F2A] group-hover:text-[#5B5045] transition-colors">
                      {person.name}
                    </h3>
                    <div className="text-xs font-mono text-[#5B5045] font-semibold">{person.role}</div>
                  </div>
                  {person.title && (
                    <span className="text-[10px] font-mono text-[#7E7266] text-right font-medium">
                      {person.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#5B5045]">
                  <Mail className="h-3.5 w-3.5 text-[#7E7266]" />
                  <span className="font-mono text-[11px] text-[#342F2A] font-medium">{person.email}</span>
                </div>

                <div className="text-xs text-[#5B5045]">
                  <span className="text-[#7E7266]">Team Space:</span>{' '}
                  <span className="text-[#342F2A] font-semibold">{person.team_name || 'Engineering'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#B8A48D]/30 flex items-center justify-between text-xs text-[#5B5045]">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="h-3.5 w-3.5 text-[#5B5045]" />
                  <span className="font-mono tabular-nums text-[#342F2A] font-bold">
                    {person.contribution_count}
                  </span>
                  <span>attributed works</span>
                </div>

                <div className="flex items-center gap-1 text-[#342F2A] font-bold group-hover:translate-x-1 transition-transform">
                  <span>Deep Record</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#5B5045]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
