
import { create } from "zustand";
import { supabase, createTablesIfNeeded } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface Project {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  team_type: string;
  has_completed_onboarding: boolean;
}

interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  isLoading: boolean;
  projectCreationInProgress: boolean;

  fetchProjects: () => Promise<void>;
  createProject: (name: string, teamType: string) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  setCurrentProject: (id: string | null) => void;
  completeOnboarding: (projectId: string) => Promise<void>;
  switchProject: (id: string) => void;
  ensureProjectExists: () => Promise<string | null>;
}

const CURRENT_PROJECT_KEY = "flowboard_current_project";

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProjectId: localStorage.getItem(CURRENT_PROJECT_KEY),
  isLoading: false,
  projectCreationInProgress: false,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) {
        set({ isLoading: false });
        return;
      }

      const savedProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);

      if (
        process.env.NODE_ENV === "development" &&
        !localStorage.getItem("flowboard_tables_created")
      ) {
        await createTablesIfNeeded();
      }

      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      let projectToUse = savedProjectId;

      if (savedProjectId && projects) {
        const projectExists = projects.some((p) => p.id === savedProjectId);
        if (!projectExists) {
          projectToUse = projects.length > 0 ? projects[0].id : null;
        }
      } else if (!savedProjectId && projects && projects.length > 0) {
        projectToUse = projects[0].id;
      }

      set({
        projects: (projects as Project[]) || [],
        isLoading: false,
        currentProjectId: projectToUse,
      });

      // Sync localStorage with actual state
      if (projectToUse) {
        localStorage.setItem(CURRENT_PROJECT_KEY, projectToUse);
      } else {
        localStorage.removeItem(CURRENT_PROJECT_KEY);
      }

      return;
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Failed to load projects",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createProject: async (name, teamType) => {
    set({ isLoading: true, projectCreationInProgress: true });
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const user = sessionData.session?.user;

      if (!user) {
        throw new Error("User must be authenticated to create a project");
      }

      const newProject = {
        name,
        owner_id: user.id,
        team_type: teamType,
        has_completed_onboarding: false,
      };

      const { data, error } = await supabase
        .from("projects")
        .insert(newProject)
        .select()
        .single();

      if (error) {
        // Handle unique constraint violation (duplicate project name)
        if (error.code === '23505') {
          console.log("Project with this name already exists, fetching existing project");
          
          // Fetch the existing project instead
          const { data: existingProject, error: fetchError } = await supabase
            .from("projects")
            .select("*")
            .eq("owner_id", user.id)
            .eq("name", name)
            .single();

          if (fetchError) {
            throw fetchError;
          }

          if (existingProject) {
            const currentState = get();
            const projectExists = currentState.projects.some(p => p.id === existingProject.id);
            
            if (!projectExists) {
              set((state) => ({
                projects: [...state.projects, existingProject as Project],
                currentProjectId: existingProject.id,
              }));
            } else {
              set({ currentProjectId: existingProject.id });
            }

            localStorage.setItem(CURRENT_PROJECT_KEY, existingProject.id);
            return existingProject as Project;
          }
        }
        throw error;
      }

      set((state) => ({
        projects: [...state.projects, data as Project],
        currentProjectId: data.id,
      }));

      localStorage.setItem(CURRENT_PROJECT_KEY, data.id);

      toast({
        title: "Project created",
        description: `${name} has been created successfully.`,
      });

      return data as Project;
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to create project",
        description: "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      set({ isLoading: false, projectCreationInProgress: false });
    }
  },

  updateProject: async (id, data) => {
    try {
      if (!id) {
        console.error("No project ID provided for update");
        throw new Error("Project ID is required for update");
      }

      const { error } = await supabase
        .from("projects")
        .update(data)
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...data } : project
        ),
      }));

      toast({
        title: "Project updated",
        description: "Changes have been saved.",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Failed to update project",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  },

  setCurrentProject: (id) => {
    set({ currentProjectId: id });
    if (id) {
      localStorage.setItem(CURRENT_PROJECT_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_PROJECT_KEY);
    }
  },

  completeOnboarding: async (projectId) => {
    try {
      if (!projectId) {
        throw new Error("Project ID is required to complete onboarding");
      }

      await get().updateProject(projectId, { has_completed_onboarding: true });
    } catch (error) {
      console.error("Error completing onboarding:", error);
      throw error;
    }
  },

  switchProject: (id) => {
    if (!id) {
      console.warn("Attempting to switch to undefined project");
      return;
    }

    set({ currentProjectId: id });
    localStorage.setItem(CURRENT_PROJECT_KEY, id);

    const projectName = get().projects.find((p) => p.id === id)?.name;
    if (projectName) {
      toast({
        title: "Project switched",
        description: `Now viewing ${projectName}`,
      });
    }
  },

  ensureProjectExists: async () => {
    const state = get();
    
    // Prevent concurrent project creation
    if (state.projectCreationInProgress) {
      console.log("Project creation already in progress, waiting...");
      // Wait for completion and return the result
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const currentState = get();
          if (!currentState.projectCreationInProgress) {
            clearInterval(checkInterval);
            resolve(currentState.currentProjectId);
          }
        }, 100);
      });
    }

    const currentId = state.currentProjectId;
    if (currentId) {
      const existingProject = state.projects.find((p) => p.id === currentId);
      if (existingProject) {
        return currentId;
      }
    }

    const savedProjectId = localStorage.getItem(CURRENT_PROJECT_KEY);
    if (savedProjectId) {
      const existingProject = state.projects.find(
        (p) => p.id === savedProjectId
      );
      if (existingProject) {
        if (state.currentProjectId !== savedProjectId) {
          set({ currentProjectId: savedProjectId });
        }
        return savedProjectId;
      }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error("No user ID available, cannot ensure project exists");
      return null;
    }

    // Refresh projects before checking if we need to create one
    await get().fetchProjects();
    const updatedState = get();

    if (updatedState.projects.length > 0) {
      const projectId = updatedState.projects[0].id;
      get().setCurrentProject(projectId);
      return projectId;
    }

    // Only create if no projects exist and not already creating
    if (!updatedState.projectCreationInProgress) {
      console.log("No projects found, creating default project");
      const newProject = await get().createProject("My First Project", "General");

      if (newProject) {
        return newProject.id;
      }
    }

    return null;
  },
}));
