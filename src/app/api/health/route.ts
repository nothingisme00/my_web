/**
 * Health Check Endpoint
 * Returns system health status for monitoring and deployment verification
 * Access: GET /api/health
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Always run dynamically, never cache

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'ok' | 'error';
      latency?: number;
      error?: string;
    };
    environment: {
      status: 'ok' | 'error';
      nodeEnv: string;
      missingVars?: string[];
    };
  };
  version?: string;
}

/**
 * Check database connectivity and latency
 */
async function checkDatabase(): Promise<HealthStatus['checks']['database']> {
  try {
    const startTime = Date.now();

    // Simple database query to check connectivity
    await prisma.$queryRaw`SELECT 1`;

    const latency = Date.now() - startTime;

    return {
      status: 'ok',
      latency,
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}

/**
 * Check critical environment variables
 */
function checkEnvironment(): HealthStatus['checks']['environment'] {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'RESEND_API_KEY',
    'CONTACT_EMAIL',
    'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
    'RECAPTCHA_SECRET_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  return {
    status: missingVars.length === 0 ? 'ok' : 'error',
    nodeEnv: process.env.NODE_ENV || 'development',
    ...(missingVars.length > 0 && { missingVars }),
  };
}

/**
 * GET /api/health
 * Returns health status of the application
 */
export async function GET() {
  try {
    // Run all health checks
    const [databaseCheck, environmentCheck] = await Promise.all([
      checkDatabase(),
      Promise.resolve(checkEnvironment()),
    ]);

    // Determine overall health status
    let overallStatus: HealthStatus['status'] = 'healthy';

    if (databaseCheck.status === 'error' || environmentCheck.status === 'error') {
      overallStatus = 'unhealthy';
    } else if (databaseCheck.latency && databaseCheck.latency > 1000) {
      // Database is slow (>1s response time)
      overallStatus = 'degraded';
    }

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: databaseCheck,
        environment: environmentCheck,
      },
    };

    // Add version if available (from package.json)
    try {
      const packageJson = await import('../../../../package.json');
      healthStatus.version = packageJson.default.version || 'unknown';
    } catch {
      // Ignore if package.json not found
    }

    // Return appropriate HTTP status code
    const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthStatus, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    // If health check itself fails, return error status
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
