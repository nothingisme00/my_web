import { Button } from "@/components/ui/Button";
import { Download, Mail, MapPin, Globe, ExternalLink, Github } from "lucide-react";
import { getProjects } from "@/lib/actions";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type Project = Prisma.ProjectGetPayload<{}>;

export default async function AboutPage() {
  const projects = await getProjects() as Project[];
  const selectedProjects = projects.slice(0, 4); // Show only top 4 projects

  return (
    <div className="bg-white dark:bg-gray-900 py-16 lg:py-20 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
            Tentang Saya
          </h1>
          <p className="text-xl leading-8 text-gray-600 dark:text-gray-300">
            Saya adalah seorang Learning Enthusiast dengan passion dalam menciptakan pengalaman web yang beautiful dan performant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Sidebar Info */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
                {/* Profile Avatar */}
                <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-blue-500 to-blue-600">
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                    D
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">DevAditya</h2>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-6">Learning Enthusiast</p>

                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 mb-8">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span>hello@devaditya.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4" />
                    <span>devaditya.com</span>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" /> Download CV
                </Button>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "Prisma", "PostgreSQL", "Docker", "AWS"].map((tech) => (
                    <span key={tech} className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Bio</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Saya memiliki pengalaman lebih dari 5 tahun dalam membangun aplikasi web modern.
                  Spesialisasi saya adalah dalam mengembangkan full-stack aplikasi dengan fokus pada
                  performa, skalabilitas, dan user experience yang exceptional.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Saya passionate tentang clean code, best practices, dan selalu belajar teknologi baru.
                  Melalui blog ini, saya berbagi pengalaman dan hal-hal menarik yang ingin kalian tahu.
                </p>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Pengalaman Kerja</h2>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-white dark:ring-gray-900" />
                  <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Senior Frontend Engineer</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2022 - Sekarang</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Tech Startup Unicorn</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Memimpin tim frontend dalam pengembangan dashboard analitik. Meningkatkan performa aplikasi sebesar 40% dengan optimasi rendering React.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-900" />
                  <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Web Developer</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2020 - 2022</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Digital Agency</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Membangun berbagai website perusahaan dan e-commerce untuk klien internasional. Mengimplementasikan desain responsif dan aksesibilitas web.
                  </p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Pendidikan</h2>
              <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-900" />
                <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sarjana Teknik Informatika</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">2016 - 2020</span>
                </div>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">Universitas Teknologi</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Lulus dengan predikat Cum Laude. Aktif dalam organisasi kemahasiswaan dan asisten laboratorium pemrograman.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Selected Projects Section */}
        {selectedProjects.length > 0 && (
          <section className="border-t border-gray-200 dark:border-gray-800 pt-16">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Selected Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Beberapa project yang pernah saya kerjakan
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {selectedProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
                >
                  {/* Project Image */}
                  {project.image && (
                    <div className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                      />
                    </div>
                  )}

                  {/* Project Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 ease-out">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    {project.techStack && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.split(',').slice(0, 3).map((tech) => (
                          <span
                            key={tech.trim()}
                            className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-out"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-out"
                        >
                          <Github className="h-4 w-4" />
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
