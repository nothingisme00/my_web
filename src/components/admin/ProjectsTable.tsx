'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { deleteProject } from '@/lib/actions';
import { toast } from '@/hooks/useToast';
import { Plus, Trash2, Edit, Search, Filter, ExternalLink, Github } from 'lucide-react';
import { Project } from '@prisma/client';

interface ProjectsTableProps {
  initialProjects: Project[];
}

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; project: Project | null }>({
    isOpen: false,
    project: null,
  });
  const [isPending, startTransition] = useTransition();

  // Filter projects based on search
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [initialProjects, searchQuery]);

  const handleDeleteClick = (project: Project) => {
    setDeleteModal({ isOpen: true, project });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.project) return;

    const projectToDelete = deleteModal.project;
    startTransition(async () => {
      try {
        await deleteProject(projectToDelete.id);
        toast.success('Project deleted successfully!');
        setDeleteModal({ isOpen: false, project: null });
      } catch (error) {
        console.error('Delete failed:', error);
        toast.error('Failed to delete project. Please try again.');
      }
    });
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredProjects.length} of {initialProjects.length} projects
            </p>
          </div>
          <Link href="/admin/projects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects by title, tech stack, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Tech Stack
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Links
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {project.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        /{project.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {project.techStack}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Demo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                            title="View GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {new Date(project.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(project)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No projects found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Create your first project to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, project: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        itemName={deleteModal.project?.title}
        isDeleting={isPending}
      />
    </>
  );
}
