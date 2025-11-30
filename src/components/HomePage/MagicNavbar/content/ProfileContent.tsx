'use client';

import { User } from 'lucide-react';
import { usePublicProfile } from '@/hooks/homepage/useProfile';
import LoadingState from '../shared/LoadingState';
import ErrorState from '../shared/ErrorState';
import EmptyState from '../shared/EmptyState';
import Image from 'next/image';

export default function ProfileContent() {
  // ✅ Using your SWR hook
  const { profile, isLoading, isError, mutate } = usePublicProfile();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState error={isError} onRetry={mutate} />;
  if (!profile) return <EmptyState message="Profile not found" icon="👤" />;

  return (
    <div className="h-full flex flex-col justify-center overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        {profile.profile_image ? (
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/20">
            <Image
              src={profile.profile_image}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="bg-white/20 p-6 rounded-3xl">
            <User className="text-white" size={48} />
          </div>
        )}
        <div>
          <h2 className="text-6xl font-bold text-white">{profile.name}</h2>
          {profile.headline && (
            <p className="text-2xl text-white/80 mt-2">{profile.headline}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-3">About</h3>
          <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {profile.email && (
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-white/60 text-sm mb-1">Email</div>
            <div className="text-white font-medium">{profile.email}</div>
          </div>
        )}
        {profile.phone && (
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-white/60 text-sm mb-1">Phone</div>
            <div className="text-white font-medium">{profile.phone}</div>
          </div>
        )}
        {profile.location && (
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-white/60 text-sm mb-1">Location</div>
            <div className="text-white font-medium">{profile.location}</div>
          </div>
        )}
      </div>

      {/* Social Links */}
      {profile.social_links && Object.keys(profile.social_links).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Connect</h3>
          <div className="flex flex-wrap gap-3">
            {profile.social_links.github && (
              <a
                href={profile.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
              >
                🐙 GitHub
              </a>
            )}
            {profile.social_links.linkedin && (
              <a
                href={profile.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
              >
                💼 LinkedIn
              </a>
            )}
            {profile.social_links.twitter && (
              <a
                href={profile.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
              >
                🐦 Twitter
              </a>
            )}
            {profile.social_links.website && (
              <a
                href={profile.social_links.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
              >
                🌐 Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}