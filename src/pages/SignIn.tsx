import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useAuthActions } from "@/hooks/useAuthActions";

import AuthLogo from "@/components/auth/AuthLogo";
import EmailSignInForm from "@/components/auth/EmailSignInForm";
import EmailSignUpForm from "@/components/auth/EmailSignUpForm";
import MagicLinkForm from "@/components/auth/MagicLinkForm";
import MagicLinkSent from "@/components/auth/MagicLinkSent";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, refreshUser, resetSessionTimeout } = useAuthStore();
  const { fetchProjects, projects } = useProjectStore();

  const {
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    isMagicLinkSent,
    setIsMagicLinkSent,
    handleEmailSignIn,
    handleEmailSignUp,
    handleMagicLinkSignIn,
    handleSocialSignIn,
  } = useAuthActions();

  const sessionTimedOut =
    new URLSearchParams(location.search).get("timeout") === "true";

  useEffect(() => {
    if (sessionTimedOut) {
      resetSessionTimeout();
    }
  }, [sessionTimedOut, resetSessionTimeout]);

  useEffect(() => {
    const checkAuthAndProjects = async () => {
      try {
        await refreshUser();

        if (isAuthenticated) {
          await fetchProjects();
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };

    checkAuthAndProjects();
  }, [refreshUser, isAuthenticated, fetchProjects]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, projects]);

  if (isMagicLinkSent) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
        <MagicLinkSent
          email={email}
          onTryDifferentMethod={() => setIsMagicLinkSent(false)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AuthLogo />

      {sessionTimedOut && (
        <Alert variant="destructive" className="mb-4 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your session timed out. Please sign in again.
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md shadow-lg border-0">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <EmailSignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              handleEmailSignIn={handleEmailSignIn}
              handleSocialSignIn={handleSocialSignIn}
            />
          </TabsContent>

          <TabsContent value="signup">
            <EmailSignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              handleEmailSignUp={handleEmailSignUp}
              handleSocialSignIn={handleSocialSignIn}
            />
          </TabsContent>

          <TabsContent value="magic">
            <MagicLinkForm
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              handleMagicLinkSignIn={handleMagicLinkSignIn}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SignIn;
