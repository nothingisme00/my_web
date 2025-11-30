import { Icon } from '@iconify/react';

export function getToolIcon(toolName: string): React.ReactNode {
  // Iconify icon map with colored logos
  const iconMap: Record<string, string> = {
    // Programming Languages (colored)
    'JavaScript': 'logos:javascript',
    'TypeScript': 'logos:typescript-icon',
    'Python': 'logos:python',
    'Java': 'logos:java',
    'PHP': 'logos:php',
    'Go': 'logos:go',
    'Rust': 'logos:rust',
    'C++': 'logos:c-plusplus',
    'C#': 'logos:c-sharp',
    'Ruby': 'logos:ruby',
    'Swift': 'logos:swift',
    'Kotlin': 'logos:kotlin-icon',

    // Frontend Frameworks (colored)
    'React': 'logos:react',
    'Next.js': 'logos:nextjs-icon',
    'Vue': 'logos:vue',
    'Vue.js': 'logos:vue',
    'Angular': 'logos:angular-icon',
    'Svelte': 'logos:svelte-icon',
    'Nuxt': 'logos:nuxt-icon',
    'Gatsby': 'logos:gatsby',
    'Remix': 'logos:remix-icon',

    // Backend Frameworks (colored)
    'Node.js': 'logos:nodejs-icon',
    'Express': 'skill-icons:expressjs-dark',
    'Express.js': 'skill-icons:expressjs-dark',
    'Django': 'logos:django-icon',
    'Flask': 'logos:flask',
    'Laravel': 'logos:laravel',
    'Spring': 'logos:spring-icon',
    'Spring Boot': 'logos:spring-icon',
    'NestJS': 'logos:nestjs',
    'FastAPI': 'logos:fastapi-icon',

    // Databases (colored)
    'PostgreSQL': 'logos:postgresql',
    'MySQL': 'logos:mysql-icon',
    'MongoDB': 'logos:mongodb-icon',
    'Redis': 'logos:redis',
    'SQLite': 'logos:sqlite',
    'MariaDB': 'logos:mariadb-icon',
    'Firebase': 'logos:firebase',
    'Supabase': 'logos:supabase-icon',
    'Prisma': 'logos:prisma',
    'GraphQL': 'logos:graphql',
    'Cassandra': 'logos:cassandra',
    'ElasticSearch': 'logos:elasticsearch',

    // Cloud & DevOps (colored)
    'Docker': 'logos:docker-icon',
    'Kubernetes': 'logos:kubernetes',
    'AWS': 'logos:aws',
    'Amazon Web Services': 'logos:aws',
    'Azure': 'logos:azure-icon',
    'Microsoft Azure': 'logos:azure-icon',
    'GCP': 'logos:google-cloud',
    'Google Cloud': 'logos:google-cloud',
    'Vercel': 'logos:vercel-icon',
    'Netlify': 'logos:netlify-icon',
    'Heroku': 'logos:heroku-icon',
    'DigitalOcean': 'logos:digital-ocean',
    'Jenkins': 'logos:jenkins',
    'GitLab CI': 'logos:gitlab',
    'GitHub Actions': 'logos:github-actions',
    'CircleCI': 'logos:circleci',
    'Terraform': 'logos:terraform-icon',

    // Version Control (colored)
    'Git': 'logos:git-icon',
    'GitHub': 'logos:github-icon',
    'GitLab': 'logos:gitlab',
    'Bitbucket': 'logos:bitbucket',

    // IDEs & Editors (colored)
    'VS Code': 'logos:visual-studio-code',
    'Visual Studio Code': 'logos:visual-studio-code',
    'Visual Studio': 'logos:visual-studio',
    'IntelliJ IDEA': 'logos:intellij-idea',
    'PyCharm': 'logos:pycharm',
    'WebStorm': 'logos:webstorm',
    'Sublime Text': 'logos:sublime-text',
    'Atom': 'logos:atom-icon',
    'Vim': 'logos:vim',
    'Neovim': 'logos:neovim',
    'Emacs': 'logos:gnu-emacs',

    // Design Tools (colored)
    'Figma': 'logos:figma',
    'Photoshop': 'logos:adobe-photoshop',
    'Adobe Photoshop': 'logos:adobe-photoshop',
    'Illustrator': 'logos:adobe-illustrator',
    'Adobe Illustrator': 'logos:adobe-illustrator',
    'XD': 'logos:adobe-xd',
    'Adobe XD': 'logos:adobe-xd',
    'Sketch': 'logos:sketch',
    'Canva': 'logos:canva',
    'InVision': 'logos:invision',
    'After Effects': 'logos:adobe-after-effects',
    'Premiere Pro': 'logos:adobe-premiere',

    // CSS Frameworks (colored)
    'Tailwind CSS': 'logos:tailwindcss-icon',
    'TailwindCSS': 'logos:tailwindcss-icon',
    'Bootstrap': 'logos:bootstrap',
    'Material-UI': 'logos:material-ui',
    'MUI': 'logos:material-ui',
    'Chakra UI': 'simple-icons:chakraui',
    'Ant Design': 'logos:ant-design',
    'Sass': 'logos:sass',
    'Less': 'logos:less',
    'PostCSS': 'logos:postcss',

    // Testing (colored)
    'Jest': 'logos:jest',
    'Cypress': 'logos:cypress-icon',
    'Playwright': 'logos:playwright',
    'Selenium': 'logos:selenium',
    'Postman': 'logos:postman-icon',
    'Insomnia': 'logos:insomnia',
    'Vitest': 'logos:vitest',

    // Package Managers (colored)
    'npm': 'logos:npm-icon',
    'Yarn': 'logos:yarn',
    'pnpm': 'logos:pnpm',
    'pip': 'logos:pypi',

    // Build Tools (colored)
    'Webpack': 'logos:webpack',
    'Vite': 'logos:vitejs',
    'Rollup': 'logos:rollup',
    'Parcel': 'logos:parcel-icon',
    'ESLint': 'logos:eslint',
    'Prettier': 'logos:prettier',
    'Babel': 'logos:babel',

    // State Management & Libraries
    'Redux': 'logos:redux',
    'Zustand': 'simple-icons:zustand',
    'MobX': 'logos:mobx',
    'Storybook': 'logos:storybook-icon',
    'Three.js': 'logos:threejs',
    'D3.js': 'logos:d3',

    // Mobile Development (colored)
    'React Native': 'logos:react',
    'Flutter': 'logos:flutter',
    'Ionic': 'logos:ionic-icon',
    'Expo': 'logos:expo-icon',
    'Xamarin': 'logos:xamarin',

    // CMS & E-commerce (colored)
    'WordPress': 'logos:wordpress-icon',
    'Shopify': 'logos:shopify',
    'WooCommerce': 'logos:woocommerce-icon',
    'Magento': 'logos:magento',
    'Strapi': 'logos:strapi-icon',
    'Contentful': 'logos:contentful',
    'Sanity': 'logos:sanity',

    // Social Media & Brands (colored)
    'Instagram': 'logos:instagram-icon',
    'Twitter': 'logos:twitter',
    'LinkedIn': 'logos:linkedin-icon',
    'YouTube': 'logos:youtube-icon',
    'TikTok': 'logos:tiktok-icon',
    'Discord': 'logos:discord-icon',
    'WhatsApp': 'logos:whatsapp-icon',
    'Telegram': 'logos:telegram',
    'Facebook': 'logos:facebook',
    'Slack': 'logos:slack-icon',
    'Notion': 'logos:notion-icon',
    'Trello': 'logos:trello',
    'Jira': 'logos:jira',
    'Asana': 'logos:asana',

    // Companies (colored)
    'Google': 'logos:google-icon',
    'Microsoft': 'logos:microsoft-icon',
    'Apple': 'logos:apple',
    'Meta': 'logos:meta-icon',
    'Netflix': 'logos:netflix-icon',
    'Spotify': 'logos:spotify-icon',
    'Airbnb': 'logos:airbnb-icon',
    'Uber': 'logos:uber',

    // Payment (colored)
    'Stripe': 'logos:stripe',
    'PayPal': 'logos:paypal',

    // Operating Systems (colored)
    'Linux': 'logos:linux-tux',
    'Ubuntu': 'logos:ubuntu',
    'Debian': 'logos:debian',
    'Fedora': 'logos:fedora',
    'CentOS': 'logos:centos-icon',
    'Windows': 'logos:microsoft-windows-icon',
    'macOS': 'logos:apple',
    'Mac': 'logos:apple',
    'Android': 'logos:android-icon',
    'iOS': 'logos:apple',

    // Other Tools
    'Nginx': 'logos:nginx',
    'Apache': 'logos:apache',
    'Cloudflare': 'logos:cloudflare-icon',
    'RabbitMQ': 'logos:rabbitmq-icon',
    'Kafka': 'logos:kafka-icon',
    'Grafana': 'logos:grafana',
    'Prometheus': 'logos:prometheus',
    'Sentry': 'logos:sentry-icon',
  };

  // Try exact match
  if (iconMap[toolName]) {
    return <Icon icon={iconMap[toolName]} width="40" height="40" />;
  }

  // Try case-insensitive match
  const lowerToolName = toolName.toLowerCase();
  const matchingKey = Object.keys(iconMap).find(
    key => key.toLowerCase() === lowerToolName
  );

  if (matchingKey) {
    return <Icon icon={iconMap[matchingKey]} width="40" height="40" />;
  }

  // Fallback to generic code icon
  return <Icon icon="mdi:code-tags" width="40" height="40" />;
}
