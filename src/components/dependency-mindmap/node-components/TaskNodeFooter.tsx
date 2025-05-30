
import React from 'react';
import {
  Eye,
  Link2,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AiDependencyExplainer from '../../ai/AiDependencyExplainer';
import useSelectedNodeState from '../hooks/useSelectedNodeState';
import { useToast } from '@/hooks/use-toast';

interface TaskNodeFooterProps {
  id?: string;
  isHovered: boolean;
  hasChildren: boolean;
  subtasksCount?: number;
  handleViewTask: (e: React.MouseEvent) => void;
  handleAddDependency: (e: React.MouseEvent) => void;
  handleAddSubtask: (e: React.MouseEvent) => void;
}

export const TaskNodeFooter: React.FC<TaskNodeFooterProps> = ({
  id,
  isHovered,
  hasChildren,
  subtasksCount = 0,
  handleViewTask,
  handleAddDependency,
  handleAddSubtask
}) => {
  const { selectNode } = useSelectedNodeState();
  const { toast } = useToast();
  
  const viewTaskHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleViewTask(e);
  };

  const addDependencyHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    handleAddDependency(e);
  };
  
  const viewNotesHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (id) {
      const actualId = id.startsWith('task-') ? id.substring(5) : id;
      selectNode(actualId, 'task');
      
      toast({
        title: "Notes View",
        description: "Showing notes for selected task",
      });
    } else {
      toast({
        title: "Error",
        description: "Cannot view notes - task ID is missing",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full pointer-events-auto" data-no-dnd="true">
      {isHovered && (
        <div className="flex justify-between items-center w-full mb-2 animate-fade-in pointer-events-auto" data-no-dnd="true">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 clickable pointer-events-auto"
                  onClick={viewTaskHandler}
                  data-no-dnd="true"
                >
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Task</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 clickable pointer-events-auto"
                  onClick={addDependencyHandler}
                  data-no-dnd="true"
                >
                  <Link2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add Dependency</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {id && <AiDependencyExplainer taskId={id} />}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 clickable pointer-events-auto"
                  onClick={viewNotesHandler}
                  data-no-dnd="true"
                  disabled={!id}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{id ? "View Notes" : "No Notes Available"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 clickable pointer-events-auto"
                  data-no-dnd="true"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open Details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
      
      <div className="flex justify-between w-full items-center pointer-events-auto" data-no-dnd="true">
        <div className="text-xs text-gray-500">
          {hasChildren ? `${subtasksCount || 0} subtasks` : "No subtasks"}
        </div>
      </div>
    </div>
  );
};

export default TaskNodeFooter;
