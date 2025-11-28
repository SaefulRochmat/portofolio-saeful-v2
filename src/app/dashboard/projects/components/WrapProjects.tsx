// src/app/dashboard/projects/components/WrapProjects.tsx
'use client';

import { useState } from 'react';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import type { Project } from '@/app/api/projects/typeProject';

export default function ProjectsWraper() {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={handleNewProject}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Project
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h2>
          <ProjectForm
            project={editingProject}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      <ProjectList onEdit={handleEdit} refresh={refreshKey} />
    </div>
  );
}