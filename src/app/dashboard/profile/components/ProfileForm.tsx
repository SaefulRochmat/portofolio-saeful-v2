// src/app/dashboard/profile/components/ProfileForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Link2, Images, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

// Type definitions
interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

interface Profile {
  id: string;
  name: string;
  headline?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  profile_image?: string;
  social_links?: SocialLinks;
  created_at?: string;
  updated_at?: string;
}

interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

interface FormData {
  id: string;
  name: string;
  headline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  profile_image: string;
  social_links: SocialLinks;
}

const ProfileManager: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>({ type: 'info', text: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    id: '',
    name: '',
    headline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    profile_image: '',
    social_links: { linkedin: '', github: '', twitter: '', website: '' }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data: Profile = await response.json();
        setProfile(data);
        setFormData({
          id: data.id || '',
          name: data.name || '',
          headline: data.headline || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          profile_image: data.profile_image || '',
          social_links: data.social_links || { linkedin: '', github: '', twitter: '', website: '' }
        });
        setIsEditing(false);
      } else {
        setMessage({ type: 'info', text: 'Belum ada profile. Silakan buat profile baru.' });
        setIsEditing(true);
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal memuat profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string): void => {
    setFormData(prev => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: 'info', text: '' });

    try {
      const method = profile ? 'PUT' : 'POST';
      const response = await fetch('/api/profile', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `Profile berhasil ${profile ? 'diperbarui' : 'dibuat'}!` });
        await fetchProfile();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Terjadi kesalahan' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menyimpan profile' });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Memuat profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Profile Management</h1>
              <p className="text-slate-600 mt-1">Kelola informasi profile Anda</p>
            </div>
            {profile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' :
            message.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Display or Edit Form */}
        {isEditing ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              {profile ? 'Edit Profile' : 'Buat Profile Baru'}
            </h2>

            <div onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  placeholder="e.g., Full Stack Developer"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Ceritakan tentang diri Anda..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Jakarta, Indonesia"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Images className="w-4 h-4 inline mr-2" />
                  URL Foto Profile
                </label>
                <input
                  type="url"
                  name="profile_image"
                  value={formData.profile_image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <Link2 className="w-4 h-4 inline mr-2" />
                  Social Links
                </label>
                <div className="space-y-3 pl-6">
                  {(['linkedin', 'github', 'twitter', 'website'] as const).map(platform => (
                    <input
                      key={platform}
                      type="url"
                      value={formData.social_links[platform] || ''}
                      onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                      placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    const form = e.currentTarget.closest('div');
                    if (form) {
                      const formElement = document.createElement('form');
                      formElement.onsubmit = handleSubmit;
                      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
                      Object.defineProperty(submitEvent, 'target', { value: formElement, writable: false });
                      handleSubmit(submitEvent as any);
                    }
                  }}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-slate-400 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Profile'
                  )}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {formData.profile_image && (
                <Image
                  src={formData.profile_image}
                  width={400}
                  height={200}
                  alt={formData.name}
                  className="w-1/2s rounded-xl object-contain border-4 border-slate-100"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>
                {formData.headline && (
                  <p className="text-blue-600 font-medium mt-1">{formData.headline}</p>
                )}
                {formData.bio && (
                  <p className="text-slate-600 mt-3 text-justify">{formData.bio}</p>
                )}
                
                <div className="grid grid-cols-1 gap-3 mt-4">
                  {formData.email && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span>{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{formData.phone}</span>
                    </div>
                  )}
                  {formData.location && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.location}</span>
                    </div>
                  )}
                </div>

                {formData.social_links && Object.values(formData.social_links).some(link => link) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Social Links:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(formData.social_links).map(([platform, url]) => 
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition"
                          >
                            {platform}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileManager;