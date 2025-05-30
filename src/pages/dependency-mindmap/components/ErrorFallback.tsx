
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <Alert variant="destructive" className="max-w-md mb-6">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error Loading Dependency Mindmap</AlertTitle>
        <AlertDescription>
          We encountered an issue loading this view. Try refreshing the page.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => window.location.reload()}
        className="flex items-center gap-2"
      >
        <RefreshCcw className="h-4 w-4" />
        Reload Page
      </Button>
    </div>
  );
};

export default ErrorFallback;
