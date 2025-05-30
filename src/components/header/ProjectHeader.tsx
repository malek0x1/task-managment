import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import useKanbanStore from "@/store/useKanbanStore";

interface ProjectHeaderProps {
  projects: Array<{ id: string; name: string }>;
  currentProjectId: string | null;
  projectName: string;
  switchProject: (id: string) => void;
  openProjectModal: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projects,
  currentProjectId,
  projectName,
  switchProject,
  openProjectModal,
}) => {
  const { fetchData, resetState } = useKanbanStore();

  const handleProjectSwitch = (projectId: string) => {
    if (projectId === currentProjectId) return;

    resetState();

    switchProject(projectId);

    setTimeout(() => {
      fetchData().catch((err) => {
        console.error("Error fetching data after project switch:", err);
      });
    }, 0);
  };

  return (
    <div className="flex items-center space-x-3">
      {projects.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="font-semibold text-xl px-2 hover:bg-transparent"
            >
              {projectName} <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Your Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectSwitch(project.id)}
                className={
                  project.id === currentProjectId
                    ? "bg-primary/10 font-medium"
                    : ""
                }
              >
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openProjectModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <h1 className="text-xl font-semibold">Project Board</h1>
      )}
    </div>
  );
};

export default ProjectHeader;
