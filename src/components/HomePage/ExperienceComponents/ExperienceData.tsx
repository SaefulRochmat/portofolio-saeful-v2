// src/components/ExperienceDisplay.tsx
'use client';

import { usePublicExperience } from '@/hooks/homepage/useExperience';

interface ExperienceDisplayProps {
  profileId?: string;
}

export function ExperienceDisplay({ profileId }: ExperienceDisplayProps) {
  const { experiences, isLoading, isError } = usePublicExperience(profileId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Failed to load experiences</p>
        <p className="text-sm mt-2">{isError.message}</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No work experience to display
      </div>
    );
  }

  // Helper functions
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (start: string, end: string | null | undefined) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    if (remainingMonths === 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>
      {experiences.map((exp) => (
        <div 
          key={exp.id} 
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Company Logo Placeholder */}
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              {exp.company.charAt(0).toUpperCase()}
            </div>

            {/* Position & Company */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {exp.position}
              </h3>
              <p className="text-lg text-gray-700 font-medium">
                {exp.company}
              </p>
              {exp.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <span>📍</span>
                  <span>{exp.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Date & Duration */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="font-medium">
              {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">
              {calculateDuration(exp.start_date, exp.end_date)}
            </span>
            {!exp.end_date && (
              <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                Current
              </span>
            )}
          </div>

          {/* Description */}
          {exp.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {exp.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ===== ALTERNATIVE: Timeline Style =====
/*
export function ExperienceTimeline({ profileId }: ExperienceDisplayProps) {
  const { experiences, isLoading, isError } = usePublicExperience(profileId);

  if (isLoading || isError || experiences.length === 0) {
    // Same loading/error states as above
  }

  return (
    <div className="relative">
      {/* Timeline Line *\/}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="relative pl-20">
            {/* Timeline Dot *\/}
            <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
              index === 0 ? 'bg-blue-600' : 'bg-gray-400'
            }`}></div>

            {/* Content *\/}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold">{exp.position}</h3>
              <p className="text-lg text-gray-700">{exp.company}</p>
              <p className="text-sm text-gray-500 mt-2">
                {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
              </p>
              {exp.description && (
                <p className="text-gray-700 mt-3">{exp.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
*/