# Sentry Error Monitoring Setup (Optional)

Sentry adalah service error tracking yang sangat berguna untuk production. Namun, setup ini **OPTIONAL** karena aplikasi sudah memiliki built-in logging system.

## Mengapa Menggunakan Sentry?

- Real-time error notifications
- Detailed error stack traces
- User context and session replay
- Performance monitoring
- Free tier tersedia (up to 5,000 errors/month)

## Setup Instructions

### 1. Create Sentry Account

1. Kunjungi https://sentry.io
2. Sign up untuk free account
3. Create new project (pilih "Next.js")
4. Copy DSN yang diberikan

### 2. Install Sentry Dependencies

```bash
npm install @sentry/nextjs
```

### 3. Run Sentry Wizard

```bash
npx @sentry/wizard@latest -i nextjs
```

Wizard akan:
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`
- Create `sentry.edge.config.ts`
- Update `next.config.ts`

### 4. Add Environment Variables

Add to `.env.production`:

```env
SENTRY_DSN="your-sentry-dsn-here"
SENTRY_AUTH_TOKEN="your-auth-token"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="your-project-name"
```

### 5. Update Logger to Use Sentry

Update `src/lib/logger.ts`:

```typescript
// Add at top
import * as Sentry from '@sentry/nextjs';

// In error method:
error(message: string, error?: Error, context?: Record<string, unknown>) {
  this.log('error', message, context, error);

  // Send to Sentry in production
  if (!this.isDevelopment && error) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
      tags: {
        message,
      },
    });
  }
}
```

## Alternative: Simple File-based Logging

Jika tidak ingin menggunakan Sentry, Anda bisa menggunakan PM2 log management:

### PM2 Log Configuration

PM2 automatically captures console.log output. Logs disimpan di:
- Output logs: `~/.pm2/logs/app-out.log`
- Error logs: `~/.pm2/logs/app-error.log`

### View Logs

```bash
# View real-time logs
pm2 logs

# View specific app logs
pm2 logs my_web

# View only errors
pm2 logs --err

# Clear logs
pm2 flush
```

### Log Rotation (Prevent disk full)

Install PM2 log rotate module:

```bash
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## Recommendation

- **Development/Testing**: Use built-in logger (sudah configured)
- **Small Production Sites**: PM2 logs (free, simple)
- **Large Production Sites**: Sentry (advanced features, alerting)

Built-in logging system yang sudah ada sudah cukup untuk kebanyakan use cases!
