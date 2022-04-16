import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: 'https://99ffdbf9c6064a54b819cdc5b7d46d24@o1206618.ingest.sentry.io/6340193',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  blacklistUrls: ['//localhost/'],
})
