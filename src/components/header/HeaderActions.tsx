import React from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeaderActionsProps {
  user: any;
  handleSignOut: () => Promise<void>;
  openOnboarding?: () => void;
  resetOnboardingForTesting?: () => void;
  isDevelopment?: boolean;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  user,
  handleSignOut,
  openOnboarding,
  resetOnboardingForTesting,
  isDevelopment = false,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {isDevelopment && openOnboarding && resetOnboardingForTesting && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm hover:bg-purple-50 hover:text-purple-700"
            onClick={openOnboarding}
          >
            <Sparkles className="mr-1 h-4 w-4 text-purple-500" />
            Open Onboarding
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-sm hover:bg-purple-50 hover:text-purple-700"
            onClick={resetOnboardingForTesting}
          >
            <Sparkles className="mr-1 h-4 w-4 text-purple-500" />
            Reset Onboarding
          </Button>
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="text-sm hover:bg-red-50 hover:text-red-700"
        onClick={handleSignOut}
      >
        <LogOut className="mr-1 h-4 w-4" />
        Sign Out
      </Button>

      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        {user?.email ? (
          <span className="text-sm font-medium">
            {user.email.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="text-sm font-medium">U</span>
        )}
      </div>
    </div>
  );
};

export default HeaderActions;
