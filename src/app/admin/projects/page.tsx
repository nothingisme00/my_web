import { getProjects } from "@/lib/actions";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { Project } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const projects: Project[] = await getProjects();

  return <ProjectsTable initialProjects={projects} />;
}
