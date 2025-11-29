// src/components/ProfileManager.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Profile } from '@/app/api/profile/typeProfile';

export default function ProfileManager() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        headline: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        profile_image: '',
        social_links: {
            github: '',
            linkedin: '',
            twitter: '',
            website: ''
        }
    });

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError('');
            
            const res = await fetch('/api/profile');
            
            if (res.status === 404) {
                // Profile belum ada, set mode create
                setProfile(null);
                setIsEditing(true);
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch profile');
            }

            const data = await res.json();
            setProfile(data);
            
            // Populate form with existing data
            setFormData({
                name: data.name || '',
                headline: data.headline || '',
                bio: data.bio || '',
                email: data.email || '',
                phone: data.phone || '',
                location: data.location || '',
                profile_image: data.profile_image || '',
                social_links: {
                    github: data.social_links?.github || '',
                    linkedin: data.social_links?.linkedin || '',
                    twitter: data.social_links?.twitter || '',
                    website: data.social_links?.website || ''
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle social links changes
    const handleSocialChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [platform]: value
            }
        }));
    };

    // Create or Update profile
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Filter empty social links
            const cleanedSocialLinks = Object.fromEntries(
                Object.entries(formData.social_links).filter(([_, value]) => value.trim() !== '')
            );

            const payload = {
                ...formData,
                social_links: Object.keys(cleanedSocialLinks).length > 0 ? cleanedSocialLinks : undefined
            };

            let res;
            if (profile) {
                // Update existing profile
                res = await fetch('/api/profile', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: profile.id,
                        ...payload
                    })
                });
            } else {
                // Create new profile
                res = await fetch('/api/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to save profile');
            }

            const updatedProfile = await res.json();
            setProfile(updatedProfile);
            setIsEditing(false);
            setSuccess(profile ? 'Profile updated successfully!' : 'Profile created successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        if (profile) {
            // Revert to original data
            setFormData({
                name: profile.name || '',
                headline: profile.headline || '',
                bio: profile.bio || '',
                email: profile.email || '',
                phone: profile.phone || '',
                location: profile.location || '',
                profile_image: profile.profile_image || '',
                social_links: {
                    github: profile.social_links?.github || '',
                    linkedin: profile.social_links?.linkedin || '',
                    twitter: profile.social_links?.twitter || '',
                    website: profile.social_links?.website || ''
                }
            });
            setIsEditing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Profile Management</h2>
                {!isEditing && profile && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Alerts */}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-xl font-bold">×</button>
                </div>
            )}

            {success && (
                <div className="bg-green-100 text-green-700 p-4 rounded mb-4 flex justify-between items-center">
                    <span>{success}</span>
                    <button onClick={() => setSuccess('')} className="text-xl font-bold">×</button>
                </div>
            )}

            {isEditing ? (
                // Edit/Create Form
                <form onSubmit={handleSave} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center mb-6">
                        {formData.profile_image && (
                            <img 
                                src={formData.profile_image} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover mb-4"
                            />
                        )}
                        <div className="w-full">
                            <label className="block text-sm font-medium mb-2">Profile Image URL</label>
                            <input
                                type="url"
                                name="profile_image"
                                value={formData.profile_image}
                                onChange={handleChange}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Headline</label>
                            <input
                                type="text"
                                name="headline"
                                value={formData.headline}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Full Stack Developer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="+62 812 3456 7890"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Jakarta, Indonesia"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">GitHub</label>
                                <input
                                    type="url"
                                    value={formData.social_links.github}
                                    onChange={(e) => handleSocialChange('github', e.target.value)}
                                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://github.com/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    value={formData.social_links.linkedin}
                                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Twitter</label>
                                <input
                                    type="url"
                                    value={formData.social_links.twitter}
                                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://twitter.com/username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Website</label>
                                <input
                                    type="url"
                                    value={formData.social_links.website}
                                    onChange={(e) => handleSocialChange('website', e.target.value)}
                                    className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex-1"
                        >
                            {saving ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                        </button>
                        
                        {profile && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500 disabled:cursor-not-allowed flex-1"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                // Display Mode
                <div className="bg-white shadow-lg rounded-lg p-8">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                        {profile?.profile_image && (
                            <img 
                                src={profile.profile_image} 
                                alt={profile.name}
                                className="w-32 h-32 rounded-full object-cover"
                            />
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
                            {profile?.headline && (
                                <p className="text-xl text-gray-600 mb-4">{profile.headline}</p>
                            )}
                            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                                {profile?.email && (
                                    <span className="flex items-center gap-1">
                                        📧 {profile.email}
                                    </span>
                                )}
                                {profile?.phone && (
                                    <span className="flex items-center gap-1">
                                        📱 {profile.phone}
                                    </span>
                                )}
                                {profile?.location && (
                                    <span className="flex items-center gap-1">
                                        📍 {profile.location}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3">About</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
                        </div>
                    )}

                    {/* Social Links */}
                    {profile?.social_links && Object.keys(profile.social_links).length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Connect</h3>
                            <div className="flex flex-wrap gap-3">
                                {profile.social_links.github && (
                                    <a 
                                        href={profile.social_links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {profile.social_links.linkedin && (
                                    <a 
                                        href={profile.social_links.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                                {profile.social_links.twitter && (
                                    <a 
                                        href={profile.social_links.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
                                    >
                                        Twitter
                                    </a>
                                )}
                                {profile.social_links.website && (
                                    <a 
                                        href={profile.social_links.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                    >
                                        Website
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="mt-8 pt-6 border-t text-sm text-gray-500">
                        {profile?.created_at && (
                            <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
                        )}
                        {profile?.updated_at && (
                            <p>Last updated: {new Date(profile.updated_at).toLocaleDateString()}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}