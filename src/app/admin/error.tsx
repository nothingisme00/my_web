'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error in Admin Panel
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Something went wrong while processing your request.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={() => reset()} className="w-full">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/admin')}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
            <p className="text-xs font-mono text-red-800 dark:text-red-200 break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
