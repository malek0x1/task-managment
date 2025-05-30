
import React from 'react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiMenuTrigger from '@/components/ai/AiMenuTrigger';
import AiSuggestionPreview from '@/components/ai/AiSuggestionPreview';
import PrioritySelector from '@/components/subtask-detail/PrioritySelector';

interface TaskDetailsPanelProps {
  titleValue: string;
  editingTitle: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
  descriptionValue: string;
  timeEstimate: string;
  dueDate: Date | null;
  taskId: string;
  taskPriority: 'low' | 'medium' | 'high';
  aiSuggestion: any;
  aiSuggestionType: string | null;
  aiSuggestionLoading: boolean;
  
  setEditingTitle: (editing: boolean) => void;
  handleTitleSave: () => void;
  handleTitleKeyDown: (e: React.KeyboardEvent) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleDescriptionBlur: () => void;
  handleTimeEstimateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeEstimateBlur: () => void;
  handlePriorityChange: (priority: 'low' | 'medium' | 'high') => void;
  handleGenerateDescription: () => void;
  handleGenerateTitle: () => Promise<void>;
  handleSummarizeDescription: () => Promise<void>;
  handleSuggestMetadata: () => Promise<void>;
  handleAcceptAiSuggestion: () => void;
  handleRejectAiSuggestion: () => void;
}

const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({
  titleValue,
  editingTitle,
  titleInputRef,
  descriptionValue,
  timeEstimate,
  dueDate,
  taskId,
  taskPriority,
  aiSuggestion,
  aiSuggestionType,
  aiSuggestionLoading,
  
  setEditingTitle,
  handleTitleSave,
  handleTitleKeyDown,
  handleDescriptionChange,
  handleDescriptionBlur,
  handleTimeEstimateChange,
  handleTimeEstimateBlur,
  handlePriorityChange,
  handleGenerateDescription,
  handleGenerateTitle,
  handleSummarizeDescription,
  handleSuggestMetadata,
  handleAcceptAiSuggestion,
  handleRejectAiSuggestion
}) => {
  return (
    <div className="animate-fade-in space-y-6">
      {aiSuggestion && aiSuggestionType && (
        <AiSuggestionPreview
          title={
            aiSuggestionType === 'title' ? 'Suggested Title' :
            aiSuggestionType === 'description' ? 'Summarized Description' :
            aiSuggestionType === 'metadata' ? 'Suggested Task Metadata' :
            'AI Suggestion'
          }
          suggestion={
            aiSuggestionType === 'metadata' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs">Priority:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    aiSuggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                    aiSuggestion.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {aiSuggestion.priority}
                  </span>
                </div>
                {aiSuggestion.dueDate && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">Due Date:</span>
                    <span>{aiSuggestion.dueDate}</span>
                  </div>
                )}
                {aiSuggestion.tags && aiSuggestion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiSuggestion.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ) : aiSuggestion
          }
          onAccept={handleAcceptAiSuggestion}
          onReject={handleRejectAiSuggestion}
          isLoading={aiSuggestionLoading}
        />
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {editingTitle ? (
            <div className="mb-2 flex-1">
              <input
                ref={titleInputRef}
                type="text"
                value={titleValue}
                onChange={(e) => {}}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="w-full text-lg font-medium px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          ) : (
            <h3 
              className="text-lg font-medium mb-2 hover:bg-gray-50 px-2 py-1 rounded-md cursor-pointer transition-colors flex-1"
              onClick={() => setEditingTitle(true)}
            >
              {titleValue}
            </h3>
          )}
          
          <AiMenuTrigger 
            options={[
              {
                label: "Draft title from context",
                onClick: handleGenerateTitle
              },
              {
                label: "Summarize this task",
                onClick: handleSummarizeDescription
              },
              {
                label: "Suggest priority & due date",
                onClick: handleSuggestMetadata
              }
            ]}
            size="xs"
            variant="ghost"
            triggerClassName="ml-2"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-500">Description</h4>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs text-gray-500 flex items-center"
            onClick={handleGenerateDescription}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-500" />
            Generate
          </Button>
        </div>
        <Textarea
          placeholder="Add a more detailed description..."
          value={descriptionValue}
          onChange={handleDescriptionChange}
          onBlur={handleDescriptionBlur}
          className="min-h-[100px] text-sm"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {}}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 mb-1 block">
            Time Estimate
          </label>
          <input
            type="text"
            placeholder="1h 30m"
            value={timeEstimate}
            onChange={handleTimeEstimateChange}
            onBlur={handleTimeEstimateBlur}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <PrioritySelector 
          selectedPriority={taskPriority}
          onPriorityChange={handlePriorityChange}
          taskId={taskId}
        />
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
