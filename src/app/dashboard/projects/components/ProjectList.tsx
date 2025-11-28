// src/app/dashboard/projects/components/ProjectList.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/app/api/projects/typeProject';
import Image from 'next/image';

interface ProjectListProps {
  onEdit: (project: Project) => void;
  refresh: number;
}

export default function ProjectList({ onEdit, refresh }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch('/api/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete project');
      }

      // Refresh the list
      fetchProjects();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No projects found. Create your first project!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {project.thumbnail_url && (
            <div className="h-48 bg-gray-200 overflow-hidden">
              <Image
                src={project.thumbnail_url}
                width={500}
                height={500}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.title}
            </h3>
            
            {project.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {project.description}
              </p>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 text-sm mb-3">
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Repository
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Live Demo
                </a>
              )}
            </div>

            {(project.start_date || project.end_date) && (
              <p className="text-xs text-gray-500 mb-3">
                {project.start_date && new Date(project.start_date).toLocaleDateString()}
                {project.start_date && project.end_date && ' - '}
                {project.end_date && new Date(project.end_date).toLocaleDateString()}
              </p>
            )}

            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => onEdit(project)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deleteLoading === project.id}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deleteLoading === project.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}