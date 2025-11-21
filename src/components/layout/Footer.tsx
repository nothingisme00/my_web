import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-all duration-200 ease-out hover:scale-110">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" aria-hidden="true" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-out hover:scale-110">
            <span className="sr-only">LinkedIn</span>
            <Linkedin className="h-6 w-6" aria-hidden="true" />
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 ease-out hover:scale-110">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" aria-hidden="true" />
          </a>
          <a href="#" className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 ease-out hover:scale-110">
            <span className="sr-only">Email</span>
            <Mail className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} DevAditya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
