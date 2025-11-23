import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiPhp,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiGithub,
  SiGitlab,
  SiFigma,
  SiPostman,
  SiSlack,
  SiNotion,
  SiTailwindcss,
  SiBootstrap,
  SiLaravel,
  SiVercel,
  SiNetlify,
  SiPrisma,
  SiLinux,
} from 'react-icons/si';

import { Code2, Database, Terminal, Globe, Wrench, Cloud, Palette, Package } from 'lucide-react';

export const toolIcons: Record<string, React.ReactNode> = {
  // Programming Languages
  'React': <SiReact className="text-[#61DAFB]" />,
  'Next.js': <SiNextdotjs />,
  'TypeScript': <SiTypescript className="text-[#3178C6]" />,
  'JavaScript': <SiJavascript className="text-[#F7DF1E]" />,
  'Node.js': <SiNodedotjs className="text-[#339933]" />,
  'Python': <SiPython className="text-[#3776AB]" />,
  'PHP': <SiPhp className="text-[#777BB4]" />,

  // Databases
  'MySQL': <SiMysql className="text-[#4479A1]" />,
  'PostgreSQL': <SiPostgresql className="text-[#4169E1]" />,
  'MongoDB': <SiMongodb className="text-[#47A248]" />,
  'Prisma': <SiPrisma />,

  // DevOps & Tools
  'Docker': <SiDocker className="text-[#2496ED]" />,
  'Git': <SiGit className="text-[#F05032]" />,
  'GitHub': <SiGithub />,
  'GitLab': <SiGitlab className="text-[#FC6D26]" />,

  // IDEs & Editors
  'VS Code': <Code2 className="text-[#007ACC]" />,
  'Visual Studio Code': <Code2 className="text-[#007ACC]" />,
  'Visual Studio': <Code2 className="text-[#007ACC]" />,
  'IntelliJ IDEA': <Code2 />,
  'PyCharm': <Code2 />,
  'WebStorm': <Code2 />,
  'Sublime Text': <Code2 />,
  'Vim': <Terminal />,
  'Neovim': <Terminal />,

  // Design Tools
  'Figma': <SiFigma className="text-[#F24E1E]" />,
  'Photoshop': <Palette className="text-[#31A8FF]" />,
  'Adobe Photoshop': <Palette className="text-[#31A8FF]" />,
  'Illustrator': <Palette className="text-[#FF9A00]" />,
  'Adobe Illustrator': <Palette className="text-[#FF9A00]" />,

  // API & Testing
  'Postman': <SiPostman className="text-[#FF6C37]" />,
  'Jest': <Code2 className="text-[#C21325]" />,
  'Cypress': <Code2 />,

  // Collaboration
  'Slack': <SiSlack className="text-[#4A154B]" />,
  'Trello': <Wrench className="text-[#0052CC]" />,
  'Notion': <SiNotion />,

  // CSS Frameworks
  'Tailwind CSS': <SiTailwindcss className="text-[#06B6D4]" />,
  'TailwindCSS': <SiTailwindcss className="text-[#06B6D4]" />,
  'Bootstrap': <SiBootstrap className="text-[#7952B3]" />,

  // Backend Frameworks
  'Express': <Code2 />,
  'Express.js': <Code2 />,
  'Laravel': <SiLaravel className="text-[#FF2D20]" />,
  'Django': <Code2 className="text-[#092E20]" />,
  'Flask': <Code2 />,

  // Deployment
  'Vercel': <SiVercel />,
  'Netlify': <SiNetlify className="text-[#00C7B7]" />,
  'Heroku': <Cloud className="text-[#430098]" />,
  'AWS': <Cloud className="text-[#FF9900]" />,
  'Amazon Web Services': <Cloud className="text-[#FF9900]" />,
  'Google Cloud': <Cloud className="text-[#4285F4]" />,
  'GCP': <Cloud className="text-[#4285F4]" />,

  // Package Managers
  'npm': <Package className="text-[#CB3837]" />,
  'Yarn': <Package className="text-[#2C8EBB]" />,

  // Build Tools
  'Webpack': <Package className="text-[#8DD6F9]" />,
  'Vite': <Package className="text-[#646CFF]" />,
  'ESLint': <Code2 className="text-[#4B32C3]" />,

  // State Management
  'Redux': <Code2 className="text-[#764ABC]" />,
  'Storybook': <Code2 className="text-[#FF4785]" />,

  // OS
  'Linux': <SiLinux />,
  'Ubuntu': <Terminal className="text-[#E95420]" />,
  'Windows': <Terminal className="text-[#0078D6]" />,
  'macOS': <Terminal />,
  'Mac': <Terminal />,
  'Apple': <Terminal />,

  // Fallback icons
  'Code': <Code2 />,
  'Database': <Database />,
  'Terminal': <Terminal />,
  'Web': <Globe />,
  'Tool': <Wrench />,
};

export function getToolIcon(toolName: string): React.ReactNode {
  // Try exact match first
  if (toolIcons[toolName]) {
    return toolIcons[toolName];
  }

  // Try case-insensitive match
  const lowerToolName = toolName.toLowerCase();
  const matchingKey = Object.keys(toolIcons).find(
    key => key.toLowerCase() === lowerToolName
  );

  if (matchingKey) {
    return toolIcons[matchingKey];
  }

  // Fallback to generic tool icon
  return toolIcons['Tool'];
}
