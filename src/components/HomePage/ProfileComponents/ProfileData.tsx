// src/components/ProfileDisplay.tsx
'use client';

import { usePublicProfile } from '@/hooks/homepage/useProfile';
import Image from 'next/image';

interface ProfileDisplayProps {
  profileId?: string; // Optional: untuk multi-user portfolio
}

export default function ProfileDisplay({ profileId }: ProfileDisplayProps = {}) {
  const { profile, isLoading, isError } = usePublicProfile({ profileId });

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">Failed to load profile</p>
          <p className="text-sm text-red-500 mt-2">{isError.message}</p>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">
            Profile Not Found
          </h3>
          <p className="text-blue-700 mb-4">
            Create your profile to get started
          </p>
          <a
            href="/dashboard/profile"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Profile
          </a>
        </div>
      </div>
    );
  }

  // Display profile
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          {profile.profile_image ? (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={profile.profile_image}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-5xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
            {profile.headline && (
              <p className="text-xl text-white/90 mb-4">{profile.headline}</p>
            )}
            
            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
              {profile.email && (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <span>📧</span>
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <span>📱</span>
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <span>📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">About Me</h2>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Social Links */}
      {profile.social_links && Object.keys(profile.social_links).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Connect</h2>
          <div className="flex flex-wrap gap-3">
            {profile.social_links.github && (
              <a
                href={profile.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}

            {profile.social_links.linkedin && (
              <a
                href={profile.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}

            {profile.social_links.twitter && (
              <a
                href={profile.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </a>
            )}

            {profile.social_links.website && (
              <a
                href={profile.social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}