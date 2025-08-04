'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error logging service (e.g., Sentry)
      // Example: Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="bg-destructive/10 mx-auto mb-4 rounded-full p-3">
                <AlertTriangle className="text-destructive h-6 w-6" />
              </div>
              <CardTitle>Application error</CardTitle>
              <CardDescription>
                A critical error occurred. Please refresh the page or contact
                support if the problem persists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-muted rounded-md p-3">
                  <p className="text-muted-foreground font-mono text-sm">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-muted-foreground mt-1 text-xs">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={reset} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = '/')}
                  variant="outline"
                  className="flex-1"
                >
                  Reload app
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
