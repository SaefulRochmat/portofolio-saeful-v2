// src/components/SkillsManager.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Skill } from '@/app/api/skills/typeSkill';

interface SkillsManagerProps {
    profileId: string;
}

export default function SkillsManager({ profileId }: SkillsManagerProps) {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        name: '',
        level: 'beginner' as 'beginner' | 'intermediate' | 'expert',
        category: '',
        icon_url: ''
    });

    // Fetch skills
    useEffect(() => {
        fetchSkills();
    }, [profileId]);

    const fetchSkills = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/skills?profile_id=${profileId}`);
            if (!res.ok) throw new Error('Failed to fetch skills');
            const data = await res.json();
            setSkills(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    // Create new skill
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile_id: profileId,
                    ...formData
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create skill');
            }

            const newSkill = await res.json();
            setSkills([newSkill, ...skills]);
            resetForm();
            setIsAdding(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create skill');
        }
    };

    // Update skill
    const handleUpdate = async (id: string) => {
        try {
            const res = await fetch(`/api/skills?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update skill');
            }

            const updatedSkill = await res.json();
            setSkills(skills.map(s => s.id === id ? updatedSkill : s));
            setEditingId(null);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update skill');
        }
    };

    // Delete skill
    const handleDelete = async (id: string) => {
        if (!confirm('Yakin mau hapus skill ini?')) return;

        try {
            const res = await fetch(`/api/skills?id=${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete skill');
            }

            setSkills(skills.filter(s => s.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete skill');
        }
    };

    // Start editing
    const startEdit = (skill: Skill) => {
        setEditingId(skill.id);
        setFormData({
            name: skill.name,
            level: skill.level || 'beginner',
            category: skill.category || '',
            icon_url: skill.icon_url || ''
        });
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            level: 'beginner',
            category: '',
            icon_url: ''
        });
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditingId(null);
        resetForm();
    };

    if (loading) {
        return <div className="p-4">Loading skills...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Skills Management</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {isAdding ? 'Cancel' : 'Add Skill'}
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
                <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Skill Name *"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="border p-2 rounded"
                        />
                        <select
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                            className="border p-2 rounded"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="expert">Expert</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="url"
                            placeholder="Icon URL"
                            value={formData.icon_url}
                            onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                            className="border p-2 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Create Skill
                    </button>
                </form>
            )}

            {/* Skills List */}
            <div className="space-y-4">
                {skills.length === 0 ? (
                    <p className="text-gray-500">Belum ada skills. Tambah dulu yuk!</p>
                ) : (
                    skills.map((skill) => (
                        <div key={skill.id} className="border rounded p-4 bg-white shadow-sm">
                            {editingId === skill.id ? (
                                // Edit Form
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="border p-2 rounded"
                                        />
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                                            className="border p-2 rounded"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="expert">Expert</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="Category"
                                            className="border p-2 rounded"
                                        />
                                        <input
                                            type="url"
                                            value={formData.icon_url}
                                            onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                                            placeholder="Icon URL"
                                            className="border p-2 rounded"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(skill.id)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Display Mode
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {skill.icon_url && (
                                            <img src={skill.icon_url} alt={skill.name} className="w-10 h-10 object-contain" />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                                            <div className="text-sm text-gray-600">
                                                <span className="capitalize">{skill.level || 'N/A'}</span>
                                                {skill.category && ` • ${skill.category}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(skill)}
                                            className="text-blue-600 hover:text-blue-800 px-3 py-1"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="text-red-600 hover:text-red-800 px-3 py-1"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}