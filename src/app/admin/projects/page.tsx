import { getProjects } from '@/lib/actions';
import { ProjectsTable } from '@/components/admin/ProjectsTable';
import { Project } from '@prisma/client';

export default async function ProjectsAdminPage() {
  const projects: Project[] = await getProjects();

  return <ProjectsTable initialProjects={projects} />;
}
