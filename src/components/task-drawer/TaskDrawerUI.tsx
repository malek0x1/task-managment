
import React from 'react';
import { Task, Subtask, TabType } from '@/types/kanban';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import TaskDrawerTabs from './TaskDrawerTabs';
import TabContent from './TabContent';
import SaveIndicator from './SaveIndicator';

interface TaskDrawerUIProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  
  state: {
    activeTab: TabType;
    editingTitle: boolean;
    titleValue: string;
    descriptionValue: string;
    timeEstimate: string;
    dueDate: Date | null;
    hasChanges: boolean;
    isSaving: boolean;
    titleInputRef: React.RefObject<HTMLInputElement>;
    aiSuggestion: any;
    aiSuggestionType: string | null;
    aiSuggestionLoading: boolean;
  };
  
  actions: {
    setActiveTab: (tab: TabType) => void;
    setEditingTitle: (editing: boolean) => void;
    handleTitleSave: () => void;
    handleTitleKeyDown: (e: React.KeyboardEvent) => void;
    handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleDescriptionBlur: () => void;
    handleTimeEstimateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTimeEstimateBlur: () => void;
    handlePriorityChange: (priority: 'low' | 'medium' | 'high') => void;
    handleGenerateDescription: () => void;
    handleUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
    handleDeleteSubtask: (taskId: string, subtaskId: string) => void;
    handleGenerateTitle: () => Promise<void>;
    handleSummarizeDescription: () => Promise<void>;
    handleSuggestMetadata: () => Promise<void>;
    handleGenerateSubtasks: () => Promise<void>;
    handleAcceptAiSuggestion: () => void;
    handleRejectAiSuggestion: () => void;
  };
  
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddNestedSubtask: (taskId: string, parentSubtaskId: string | null, title: string) => void;
}

const TaskDrawerUI: React.FC<TaskDrawerUIProps> = ({
  task,
  isOpen,
  onClose,
  state,
  actions,
  onToggleSubtask,
  onAddNestedSubtask
}) => {
  if (!task) return null;
  
  const {
    activeTab,
    hasChanges,
    isSaving
  } = state;
  
  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  
  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-lg font-medium">Task Details</SheetTitle>
              <SheetClose className="rounded-full p-1 hover:bg-gray-100">
                <X className="w-5 h-5" />
              </SheetClose>
            </div>
          </SheetHeader>
          
          <TaskDrawerTabs
            activeTab={activeTab}
            setActiveTab={actions.setActiveTab}
            completedSubtasks={completedSubtasks}
            totalSubtasks={totalSubtasks}
          />
          
          <div className="mt-4">
            <TabContent
              activeTab={activeTab}
              task={task}
              state={state}
              actions={actions}
              onToggleSubtask={onToggleSubtask}
              onAddNestedSubtask={onAddNestedSubtask}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <SaveIndicator isSaving={isSaving} hasChanges={hasChanges} />
    </>
  );
};

export default TaskDrawerUI;
