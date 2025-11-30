'use client';

import { GraduationCap } from 'lucide-react';
import { usePublicEducation } from '@/hooks/homepage/useEducation';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';
import EmptyState from '../shared/EmptyState';

export default function EducationContent() {
  // ✅ Using your SWR hook
  const { education, isLoading, isError, mutate } = usePublicEducation();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={isError} onRetry={mutate} />;
  if (!education || education.length === 0) {
    return <EmptyState message="No education added yet" icon="🎓" />;
  }

  // Helper to check if education is current (no end_year)
  const isCurrent = (edu) => !edu.end_year;

  // Helper to format year from date string
  const formatYear = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.getFullYear();
  };

  return (
    <div className="h-full flex flex-col justify-center overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="bg-white/20 p-6 rounded-3xl">
          <GraduationCap className="text-white" size={48} />
        </div>
        <h2 className="text-6xl font-bold text-white">Education</h2>
      </div>

      {/* Education List */}
      <div className="space-y-6">
        {education.map((edu, idx) => (
          <div
            key={edu.id}
            className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 transform transition-all duration-500 hover:bg-white/15 hover:scale-[1.02]"
            style={{
              transitionDelay: `${idx * 100}ms`
            }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                <p className="text-xl text-white/80">{edu.institution}</p>
                <p className="text-lg text-white/60 mt-1">{edu.field_of_study}</p>
              </div>
              {isCurrent(edu) && (
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-semibold">
                  Current
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-white/60 text-sm mb-4">
              <span>
                📅 {formatYear(edu.start_year)} - {isCurrent(edu) ? 'Present' : formatYear(edu.end_year)}
              </span>
            </div>

            {edu.description && (
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}