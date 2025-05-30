
import React from 'react';
import { Task, Subtask, TabType } from '@/types/kanban';
import TaskDetailsPanel from './TaskDetailsPanel';
import CommentsPanel from './CommentsPanel';
import ActivityPanel from './ActivityPanel';
import DependenciesPanel from './DependenciesPanel';
import SubtaskList from './SubtaskList';
import AddSubtaskForm from './AddSubtaskForm';

interface TabContentProps {
  activeTab: TabType;
  task: Task;
  state: {
    titleValue: string;
    editingTitle: boolean;
    titleInputRef: React.RefObject<HTMLInputElement>;
    descriptionValue: string;
    timeEstimate: string;
    dueDate: Date | null;
    aiSuggestion: any;
    aiSuggestionType: string | null;
    aiSuggestionLoading: boolean;
  };
  actions: {
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

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  task,
  state,
  actions,
  onToggleSubtask,
  onAddNestedSubtask
}) => {
  if (activeTab === 'details') {
    return (
      <TaskDetailsPanel
        titleValue={state.titleValue}
        editingTitle={state.editingTitle}
        titleInputRef={state.titleInputRef}
        descriptionValue={state.descriptionValue}
        timeEstimate={state.timeEstimate}
        dueDate={state.dueDate}
        taskId={task.id}
        taskPriority={task.priority}
        aiSuggestion={state.aiSuggestion}
        aiSuggestionType={state.aiSuggestionType}
        aiSuggestionLoading={state.aiSuggestionLoading}
        setEditingTitle={actions.setEditingTitle}
        handleTitleSave={actions.handleTitleSave}
        handleTitleKeyDown={actions.handleTitleKeyDown}
        handleDescriptionChange={actions.handleDescriptionChange}
        handleDescriptionBlur={actions.handleDescriptionBlur}
        handleTimeEstimateChange={actions.handleTimeEstimateChange}
        handleTimeEstimateBlur={actions.handleTimeEstimateBlur}
        handlePriorityChange={actions.handlePriorityChange}
        handleGenerateDescription={actions.handleGenerateDescription}
        handleGenerateTitle={actions.handleGenerateTitle}
        handleSummarizeDescription={actions.handleSummarizeDescription}
        handleSuggestMetadata={actions.handleSuggestMetadata}
        handleAcceptAiSuggestion={actions.handleAcceptAiSuggestion}
        handleRejectAiSuggestion={actions.handleRejectAiSuggestion}
      />
    );
  }
  
  if (activeTab === 'subtasks') {
    const handleDeleteSubtaskWrapper = (taskId: string, subtaskId: string) => {
      if (!taskId || !subtaskId) {
        return;
      }
      
      try {
        const result = actions.handleDeleteSubtask(taskId, subtaskId);
        return result;
      } catch (error) {
        console.error("Error calling handleDeleteSubtask:", error);
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-medium">Subtasks</h4>
          <AddSubtaskForm 
            onAddNestedSubtask={onAddNestedSubtask}
            taskId={task.id}
            handleGenerateSubtasks={(e?: React.MouseEvent) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              return actions.handleGenerateSubtasks();
            }}
          />
        </div>
        
        <SubtaskList
          task={task}
          aiSuggestion={state.aiSuggestion}
          aiSuggestionType={state.aiSuggestionType}
          aiSuggestionLoading={state.aiSuggestionLoading}
          handleAcceptAiSuggestion={actions.handleAcceptAiSuggestion}
          handleRejectAiSuggestion={actions.handleRejectAiSuggestion}
          onToggleSubtask={onToggleSubtask}
          onAddNestedSubtask={onAddNestedSubtask}
          handleUpdateSubtask={actions.handleUpdateSubtask}
          handleDeleteSubtask={handleDeleteSubtaskWrapper}
        />
      </div>
    );
  }
  
  if (activeTab === 'dependencies') {
    return <DependenciesPanel taskId={task.id} />;
  }
  
  if (activeTab === 'comments') {
    return <CommentsPanel />;
  }
  
  if (activeTab === 'activity') {
    return <ActivityPanel />;
  }
  
  return null;
};

export default TabContent;
