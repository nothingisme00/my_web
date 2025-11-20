import { Button } from "@/components/ui/Button";
import { Download, Mail, MapPin, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 py-24 sm:py-32 transition-colors duration-300 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Tentang Saya</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Saya adalah seorang Software Engineer dengan pengalaman lebih dari 5 tahun dalam membangun aplikasi web modern. 
            Saya memiliki passion dalam menciptakan pengalaman pengguna yang intuitif dan performa aplikasi yang optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-8 transition-colors duration-300">
              <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-gray-200 dark:bg-gray-700">
                {/* Placeholder for profile picture */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  Foto Profil
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">DevAditya</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">Full Stack Developer</p>

              <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  Jakarta, Indonesia
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  hello@devaditya.com
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4" />
                  devaditya.com
                </div>
              </div>

              <div className="mt-8">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" /> Download CV
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", "Prisma", "PostgreSQL", "Docker", "AWS"].map((tech) => (
                  <span key={tech} className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-gray-700/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pengalaman Kerja</h3>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 dark:bg-blue-500 ring-4 ring-white dark:ring-gray-900" />
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Senior Frontend Engineer</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2022 - Sekarang</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">Tech Startup Unicorn</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Memimpin tim frontend dalam pengembangan dashboard analitik. Meningkatkan performa aplikasi sebesar 40% dengan optimasi rendering React.
                  </p>
                </div>
                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-900" />
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Web Developer</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2020 - 2022</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">Digital Agency</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Membangun berbagai website perusahaan dan e-commerce untuk klien internasional. Mengimplementasikan desain responsif dan aksesibilitas web.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Pendidikan</h3>
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-900" />
                  <div className="mb-1 flex items-center justify-between">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Sarjana Teknik Informatika</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2016 - 2020</span>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">Universitas Teknologi</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Lulus dengan predikat Cum Laude. Aktif dalam organisasi kemahasiswaan dan asisten laboratorium pemrograman.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
