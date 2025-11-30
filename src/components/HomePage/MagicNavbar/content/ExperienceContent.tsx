'use client';

import { Briefcase } from 'lucide-react';
import { usePublicExperience } from '@/hooks/homepage/useExperience';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';
import EmptyState from '../shared/EmptyState';

export default function ExperienceContent() {
  // ✅ Using your SWR hook
  const { experiences, isLoading, isError, mutate } = usePublicExperience();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={isError} onRetry={mutate} />;
  if (!experiences || experiences.length === 0) {
    return <EmptyState message="No experience added yet" icon="💼" />;
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Helper to check if experience is current (no end_date)
  const isCurrent = (exp) => !exp.end_date;

  return (
    <div className="h-full flex flex-col justify-center overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-white/20 p-6 rounded-3xl">
          <Briefcase className="text-white" size={48} />
        </div>
        <h2 className="text-6xl font-bold text-white">Experience</h2>
      </div>

      {/* Experience List */}
      <div className="space-y-6">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 transform transition-all duration-500 hover:bg-white/15 hover:scale-[1.02]"
            style={{
              transitionDelay: `${idx * 100}ms`
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold text-white">{exp.position}</h3>
                <p className="text-xl text-white/80">{exp.company}</p>
              </div>
              {isCurrent(exp) && (
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                  Current
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-white/60 text-sm mb-4">
              <span>
                📅 {formatDate(exp.start_date)} - {isCurrent(exp) ? 'Present' : formatDate(exp.end_date)}
              </span>
              {exp.location && <span>📍 {exp.location}</span>}
            </div>

            {exp.description && (
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}