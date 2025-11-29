// src/components/ExperienceManager.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Experience } from '@/app/api/experience/typeExperience';

interface ExperienceManagerProps {
    profileId: string;
}

export default function ExperienceManager({ profileId }: ExperienceManagerProps) {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        current: false  // Checkbox untuk "I currently work here"
    });

    // Fetch experiences
    useEffect(() => {
        fetchExperiences();
    }, [profileId]);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/experience?profile_id=${profileId}`);
            if (!res.ok) throw new Error('Failed to fetch experiences');
            const data = await res.json();
            setExperiences(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch experiences');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                current: checked,
                end_date: checked ? '' : prev.end_date  // Clear end_date if current job
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Create new experience
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.position || !formData.company || !formData.start_date) {
            setError('Position, company, and start date are required');
            return;
        }

        try {
            const payload = {
                position: formData.position,
                company: formData.company,
                location: formData.location,
                start_date: formData.start_date,
                end_date: formData.current ? null : formData.end_date || null,
                description: formData.description
            };

            const res = await fetch('/api/experience', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create experience');
            }

            const newExperience = await res.json();
            setExperiences([newExperience, ...experiences]);
            resetForm();
            setIsAdding(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create experience');
        }
    };

    // Update experience
    const handleUpdate = async (id: string) => {
        if (!formData.position || !formData.company || !formData.start_date) {
            setError('Position, company, and start date are required');
            return;
        }

        try {
            const payload = {
                position: formData.position,
                company: formData.company,
                location: formData.location,
                start_date: formData.start_date,
                end_date: formData.current ? null : formData.end_date || null,
                description: formData.description
            };

            const res = await fetch(`/api/experience?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update experience');
            }

            const updatedExperience = await res.json();
            setExperiences(experiences.map(exp => exp.id === id ? updatedExperience : exp));
            setEditingId(null);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update experience');
        }
    };

    // Delete experience
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const res = await fetch(`/api/experience?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete experience');
            }

            setExperiences(experiences.filter(exp => exp.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete experience');
        }
    };

    // Start editing
    const startEdit = (experience: Experience) => {
        setEditingId(experience.id!);
        setFormData({
            position: experience.position,
            company: experience.company,
            location: experience.location || '',
            start_date: experience.start_date,
            end_date: experience.end_date || '',
            description: experience.description || '',
            current: !experience.end_date
        });
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            position: '',
            company: '',
            location: '',
            start_date: '',
            end_date: '',
            description: '',
            current: false
        });
        setError('');
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    // Format date for display
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Calculate duration
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

    if (loading) {
        return <div className="p-4">Loading experiences...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Work Experience</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {isAdding ? 'Cancel' : 'Add Experience'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                    <button onClick={() => setError('')} className="ml-2 font-bold">×</button>
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <form onSubmit={handleCreate} className="bg-gray-50 p-6 rounded mb-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Position *</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                required
                                placeholder="Software Engineer"
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Company *</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                placeholder="Google"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Jakarta, Indonesia"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                required
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                disabled={formData.current}
                                className="w-full border p-2 rounded disabled:bg-gray-200"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.current}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">I currently work here</span>
                            </label>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Describe your responsibilities and achievements..."
                                className="w-full border p-2 rounded resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Create Experience
                    </button>
                </form>
            )}

            {/* Experiences List */}
            <div className="space-y-4">
                {experiences.length === 0 ? (
                    <p className="text-gray-500">No work experience added yet.</p>
                ) : (
                    experiences.map((exp) => (
                        <div key={exp.id} className="border rounded-lg p-6 bg-white shadow-sm">
                            {editingId === exp.id ? (
                                // Edit Form
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Position *</label>
                                            <input
                                                type="text"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Company *</label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Start Date *</label>
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">End Date</label>
                                            <input
                                                type="date"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                disabled={formData.current}
                                                className="w-full border p-2 rounded disabled:bg-gray-200"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.current}
                                                    onChange={handleChange}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">I currently work here</span>
                                            </label>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full border p-2 rounded resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(exp.id!)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Display Mode
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold">{exp.position}</h3>
                                            <p className="text-lg text-gray-700">{exp.company}</p>
                                            {exp.location && (
                                                <p className="text-sm text-gray-500">{exp.location}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(exp)}
                                                className="text-blue-600 hover:text-blue-800 px-3 py-1"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id!)}
                                                className="text-red-600 hover:text-red-800 px-3 py-1"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600 mb-3">
                                        {formatDate(exp.start_date)} - {formatDate(exp.end_date)} · {calculateDuration(exp.start_date, exp.end_date)}
                                    </div>

                                    {exp.description && (
                                        <p className="text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}