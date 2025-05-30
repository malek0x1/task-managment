
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Subtask } from '@/types/kanban';
import SubtaskNode from './SubtaskNode';

interface CollapsibleSubtaskSectionProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  subtask: Subtask;
  taskId: string;
  depth: number;
  renderSubtaskContent: () => React.ReactNode;
  showDetailPanel: boolean;
  isClosingPanel: boolean;
  handleDetailPanelClick: (e: React.MouseEvent) => void;
  showAddInput: boolean;
  detailPanelContent: React.ReactNode;
  addInputContent: React.ReactNode;
  onToggle: (taskId: string, subtaskId: string) => void;
  onAddNestedSubtask: (parentTaskId: string, parentSubtaskId: string, title: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
  onReorderSubtask?: (taskId: string, subtaskId: string, direction: 'up' | 'down') => void;
}

const CollapsibleSubtaskSection: React.FC<CollapsibleSubtaskSectionProps> = ({
  isOpen,
  setIsOpen,
  subtask,
  taskId,
  depth,
  renderSubtaskContent,
  showDetailPanel,
  isClosingPanel,
  handleDetailPanelClick,
  showAddInput,
  detailPanelContent,
  addInputContent,
  onToggle,
  onAddNestedSubtask,
  onUpdateSubtask,
  onDeleteSubtask,
  onReorderSubtask
}) => {
  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <div className="flex items-start">
        <CollapsibleTrigger className="flex items-center mr-1 mt-1" onClick={(e) => e.stopPropagation()}>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        
        <div className="flex-1">
          {renderSubtaskContent()}
          
          {(showDetailPanel || isClosingPanel) && (
            <div 
              className={`pl-6 pr-2 py-2 mt-1 bg-gray-50 rounded-md border border-gray-100 ${isClosingPanel ? "animate-accordion-up" : "animate-accordion-down"}`}
              onClick={handleDetailPanelClick}
            >
              {detailPanelContent}
            </div>
          )}
          
          {showAddInput && (
            <div 
              style={{ paddingLeft: '24px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {addInputContent}
            </div>
          )}
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="pl-2 border-l border-gray-100 ml-1.5">
          {subtask.children?.slice(0, 5).map(child => (
            <SubtaskNode
              key={child.id}
              id={child.id}
              data={{
                label: child.title,
                completed: child.completed,
                hasChildren: !!(child.children && child.children.length > 0),
                isCollapsed: false,
                onToggleCollapse: () => {},
                priority: child.priority,
                level: depth + 1,
                subtask: child,
                taskId: taskId,
                parentSubtaskId: child.parentSubtaskId,
                onToggleComplete: onToggle,
                onAddSubtask: onAddNestedSubtask,
                onUpdateSubtask: onUpdateSubtask,
                onDeleteSubtask: onDeleteSubtask
              }}
            />
          ))}
          
          {subtask.children && subtask.children.length > 5 && (
            <div className="pl-6 text-xs text-blue-500 hover:text-blue-700 cursor-pointer my-1">
              Show {subtask.children.length - 5} more...
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSubtaskSection;
