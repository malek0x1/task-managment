import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    const isMaxUpdateDepthError = error.message.includes(
      "Maximum update depth exceeded"
    );
    const isCollaboratorsError = error.message.includes(
      "collaborators is null"
    );

    if (isMaxUpdateDepthError) {
      console.warn(
        "Detected React maximum update depth error. This usually happens when state updates cause infinite loops."
      );
    }

    if (isCollaboratorsError) {
      console.warn(
        "Detected Excalidraw collaborators error. This might be related to initializing collaborators incorrectly."
      );
    }

    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.state.error?.message.includes("Maximum update depth exceeded")) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Rendering Error
            </h2>
            <p className="text-gray-600 mb-4 max-w-md">
              There was an issue with the component's state updates.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4"
            >
              Reload Page
            </Button>
          </div>
        );
      }

      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4 max-w-md">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4"
            >
              Try again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
