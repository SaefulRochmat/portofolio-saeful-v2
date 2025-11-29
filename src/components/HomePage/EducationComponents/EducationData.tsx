"use client"

import { usePublicEducation } from "@/hooks/homepage/useEducation"

export function EducationDisplay({ profileId }: { profileId?: string }) {
  const { education, isLoading, isError } = usePublicEducation(profileId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError || education.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No education to display
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-12 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Education</h2>
      {education.map((edu) => (
        <div key={edu.id} className="bg-white rounded-lg p-6 shadow-md border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Icon/Logo placeholder */}
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🎓</span>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{edu.institution}</h3>
              <p className="text-lg text-gray-700">{edu.degree}</p>
              {edu.field_of_study && (
                <p className="text-gray-600">{edu.field_of_study}</p>
              )}
              
              <div className="text-sm text-gray-500 mt-2">
                {edu.start_year} - {edu.end_year || 'Present'}
              </div>

              {edu.description && (
                <p className="text-gray-700 mt-3 whitespace-pre-wrap">{edu.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}