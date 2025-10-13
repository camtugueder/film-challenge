'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Movie Search
          </h1>
          <div className="flex gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded transition-colors ${
                pathname === '/'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Search
            </Link>
            <Link
              href="/favorites"
              className={`px-4 py-2 rounded transition-colors ${
                pathname === '/favorites'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Favorites
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
