import { create } from "zustand";
import { toast } from "@/hooks/use-toast";

import { supabase as supabaseClient } from "@/integrations/supabase/client";

interface AuthState {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionTimedOut: boolean;

  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  resetSessionTimeout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  sessionTimedOut: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user || !data.user.id) {
        console.error(
          "Login successful but user or userId is missing:",
          data.user
        );
        throw new Error("Login successful but user data is incomplete");
      }

      set({
        user: data.user,
        isAuthenticated: !!data.user,
        isLoading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.user.id) {
        console.log("Signup successful, user data:", {
          id: data.user.id,
          email: data.user.email,
        });
      } else {
        console.warn(
          "Signup successful but user or userId is missing:",
          data.user
        );
      }

      set({
        user: data.user,
        isAuthenticated: !!data.user,
        isLoading: false,
      });
    } catch (error) {
      console.error("Signup error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) throw error;

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  sendMagicLink: async (email: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      set({ isLoading: false });
    } catch (error) {
      console.error("Magic link error:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  refreshUser: async () => {
    set({ isLoading: true });

    const sessionPromise = supabaseClient.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Session retrieval timed out")), 5000);
    });

    try {
      const { data } = (await Promise.race([
        sessionPromise,
        timeoutPromise,
      ])) as any;

      const user = data?.session?.user || null;

      if (user && !user.id) {
        console.error("User object found but missing ID:", user);

        if (typeof user === "object" && user !== null) {
          toast({
            title: "Authentication issue",
            description:
              "User data is incomplete. Please try logging out and back in.",
            variant: "destructive",
          });
        }
      } else if (user) {
        console.log("User refreshed successfully:", {
          userId: user.id,
          email: user.email,
        });
      }

      set({
        user,
        isAuthenticated: !!(user && user.id),
        isLoading: false,
        sessionTimedOut: false,
      });

      return data;
    } catch (error) {
      console.error("Error or timeout refreshing user:", error);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        sessionTimedOut: true,
      });

      try {
        await supabaseClient.auth.signOut();
      } catch (logoutError) {
        console.error(
          "Error signing out after session refresh failure:",
          logoutError
        );
      }
    }
  },

  resetSessionTimeout: () => {
    set({ sessionTimedOut: false });
  },
}));

useAuthStore
  .getState()
  .refreshUser()
  .catch((error) => {
    console.error("Initial auth check failed:", error);
  });
