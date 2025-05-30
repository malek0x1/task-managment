import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect, useState, useRef } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import DependencyMindmapPage from "./pages/dependency-mindmap";
import { supabase, checkAuthStatus } from "./integrations/supabase/client";
import { createTablesIfNeeded } from "./lib/supabase/client";
import { useAuthStore } from "./store/useAuthStore";
import { useProjectStore } from "./store/useProjectStore";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "./hooks/use-toast";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const useAppInitialization = () => {
  const {
    isAuthenticated,
    isLoading: authLoading,
    user,
    refreshUser,
    sessionTimedOut,
  } = useAuthStore();
  const {
    fetchProjects,
    isLoading: projectsLoading,
    projects,
    currentProjectId,
    ensureProjectExists,
    projectCreationInProgress,
  } = useProjectStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const [networkError, setNetworkError] = useState(false);
  const [tablesCreated, setTablesCreated] = useState(false);
  const MAX_INIT_ATTEMPTS = 3;
  const initInProgressRef = useRef(false);

  const initializeApp = async () => {
    if (initInProgressRef.current) {
      return;
    }

    try {
      initInProgressRef.current = true;
      console.log("Initializing app... (attempt " + (initAttempts + 1) + ")");
      setNetworkError(false);

      const { isAuthenticated: isAuth, userId } = await checkAuthStatus();

      if (!isAuth || !userId) {
        console.log(
          "User not authenticated or missing userId, skipping further initialization"
        );
        setIsInitialized(true);
        initInProgressRef.current = false;
        return;
      }

      await refreshUser();

      if (useAuthStore.getState().sessionTimedOut) {
        setIsInitialized(true);
        initInProgressRef.current = false;
        return;
      }

      const authState = useAuthStore.getState();
      const currentUser = authState.user;

      if (!authState.isAuthenticated || !currentUser?.id) {
        console.log(
          "User not authenticated or missing userId after refresh, skipping further initialization"
        );
        setIsInitialized(true);
        initInProgressRef.current = false;
        return;
      }

      console.log("Auth status after refresh:", {
        authenticated: authState.isAuthenticated,
        userId: currentUser?.id,
        user: currentUser
          ? { email: currentUser.email, id: currentUser.id }
          : null,
      });

      if (!tablesCreated && process.env.NODE_ENV === "development") {
        try {
          await createTablesIfNeeded();
          setTablesCreated(true);
        } catch (tableError) {
          console.error("Error creating tables:", tableError);
        }
      }

      // Centralized project initialization - only do this here
      console.log("Fetching projects for user:", currentUser.id);
      await fetchProjects();

      // Wait for any ongoing project creation to complete
      const projectState = useProjectStore.getState();
      if (
        !projectState.currentProjectId &&
        projectState.projects.length === 0 &&
        !projectState.projectCreationInProgress
      ) {
        console.log("No current project, ensuring one exists");
        await ensureProjectExists();
      }

      setIsInitialized(true);
      initInProgressRef.current = false;
    } catch (error) {
      console.error("Error initializing app:", error);
      initInProgressRef.current = false;

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        setNetworkError(true);
        toast({
          title: "Network connection error",
          description:
            "Unable to connect to the database. Check your connection and try again.",
          variant: "destructive",
        });
      }

      if (initAttempts >= MAX_INIT_ATTEMPTS) {
        console.warn("Max init attempts reached, proceeding anyway");
        setIsInitialized(true);
      } else {
        const delay = Math.pow(2, initAttempts) * 1000;
        console.log(
          `Retrying initialization in ${delay}ms (attempt ${initAttempts + 1})`
        );

        setTimeout(() => {
          setInitAttempts((prev) => prev + 1);
        }, delay);
      }
    }
  };

  useEffect(() => {
    if ((!isInitialized || initAttempts > 0) && !initInProgressRef.current) {
      initializeApp();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change detected:", event);

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const user = session?.user || null;

          if (user && !user.id) {
            console.error(
              "Auth state change: user object found but missing ID:",
              user
            );
            toast({
              title: "Authentication issue",
              description:
                "User data is incomplete. Please try logging out and back in.",
              variant: "destructive",
            });
          } else if (user) {
            console.log("Auth state change: user authenticated:", {
              userId: user.id,
              email: user.email,
            });
          }

          useAuthStore.setState({
            user,
            isAuthenticated: !!(user && user.id),
            sessionTimedOut: false,
          });

          // Debounce project operations after auth change
          setTimeout(async () => {
            try {
              const currentUser = useAuthStore.getState().user;

              if (!currentUser || !currentUser.id) {
                console.error(
                  "Cannot fetch projects: Missing userId in auth state"
                );
                return;
              }

              console.log(
                "Fetching projects for user after auth change:",
                currentUser.id
              );
              await fetchProjects();

              const projectState = useProjectStore.getState();
              if (
                !projectState.currentProjectId &&
                projectState.projects.length === 0 &&
                !projectState.projectCreationInProgress
              ) {
                await ensureProjectExists();
              }

              setNetworkError(false);
            } catch (error) {
              console.error("Error after auth change:", error);
              if (
                error instanceof TypeError &&
                error.message.includes("Failed to fetch")
              ) {
                setNetworkError(true);
              }
            }
          }, 500);
        } else if (event === "SIGNED_OUT") {
          useAuthStore.setState({
            user: null,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [
    refreshUser,
    fetchProjects,
    isInitialized,
    initAttempts,
    ensureProjectExists,
  ]);

  return {
    isInitialized,
    networkError,
    authLoading,
    projectsLoading: projectsLoading || projectCreationInProgress,
    sessionTimedOut,
    isAuthenticated,
    initAttempts,
    user,
    retryConnection: () => {
      setNetworkError(false);
      setIsInitialized(false);
      setInitAttempts(0);
      initInProgressRef.current = false;
    },
  };
};

const App = () => {
  const {
    isInitialized,
    networkError,
    sessionTimedOut,
    isAuthenticated,
    initAttempts,
    user,
    retryConnection,
  } = useAppInitialization();

  const { projects } = useProjectStore();

  if (!isInitialized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">
          {initAttempts > 0
            ? `Loading... (attempt ${initAttempts + 1})`
            : "Loading..."}
        </p>
      </div>
    );
  }

  if (networkError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the database. This could be due to network
            issues or the backend service may be temporarily unavailable.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={retryConnection} className="w-full">
              Retry Connection
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={() => useAuthStore.getState().logout()}
                className="w-full"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (sessionTimedOut) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <HelmetProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route
                  path="*"
                  element={<Navigate to="/auth/signin?timeout=true" />}
                />
                <Route path="/auth/signin" element={<SignIn />} />
              </Routes>
            </BrowserRouter>
          </HelmetProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const hasProjects = projects.length > 0;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HelmetProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? <Index /> : <Navigate to="/auth/signin" />
                }
              />
              <Route
                path="/dependency-mindmap"
                element={
                  isAuthenticated ? (
                    <DependencyMindmapPage />
                  ) : (
                    <Navigate to="/auth/signin" />
                  )
                }
              />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </HelmetProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
