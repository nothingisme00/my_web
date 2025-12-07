"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Parse pathname into breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Map segments to readable names
  const getSegmentName = (segment: string) => {
    const nameMap: Record<string, string> = {
      'admin': 'Dashboard',
      'posts': 'Posts',
      'projects': 'Projects',
      'categories': 'Categories',
      'tags': 'Tags',
      'media': 'Media Library',
      'settings': 'Settings',
      'new': 'Create New',
      'edit': 'Edit',
    };
    
    return nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  // Build breadcrumb path
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const name = getSegmentName(segment);
    return { name, path };
  });

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <Link
        href="/admin"
        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        // Skip 'admin' in breadcrumbs since we have home icon
        if (crumb.name === 'Dashboard' && index === 0) return null;
        
        return (
          <div key={crumb.path} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.path}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {crumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
