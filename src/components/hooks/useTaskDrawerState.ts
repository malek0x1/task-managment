import { useState, useCallback, useEffect, useRef } from 'react';
import { Task, Subtask, TabType, Priority } from '@/types/kanban';
import { toast } from '@/hooks/use-toast';
import { 
  generateTaskTitle, 
  summarizeTaskDescription, 
  suggestTaskMetadata, 
  generateSubtasks
} from '@/utils/aiAssistant';

export const useTaskDrawerState = (
  task: Task | null,
  isOpen: boolean,
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void,
  onToggleSubtask?: (taskId: string, subtaskId: string) => void,
  onAddNestedSubtask?: (taskId: string, parentSubtaskId: string | null, title: string) => void,
  onUpdateSubtask?: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void,
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void,
) => {
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [aiSuggestionType, setAiSuggestionType] = useState<string | null>(null);
  const [aiSuggestionLoading, setAiSuggestionLoading] = useState(false);
  const [aiGeneratedSubtasks, setAiGeneratedSubtasks] = useState<string[]>([]);
  

  const previousTaskIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (isOpen && task) {
      const isNewTask = previousTaskIdRef.current !== task.id;
      

      if (isNewTask) {
        const initialTab = (task as any).initialTab;
        if (initialTab && ['details', 'subtasks', 'dependencies', 'comments', 'activity'].includes(initialTab)) {
          setActiveTab(initialTab as TabType);
        } else {
          setActiveTab('details');
        }
        previousTaskIdRef.current = task.id;
      }

    }
  }, [isOpen, task]);
  
  useEffect(() => {
    if (task) {
      setTitleValue(task.title);
      setDescriptionValue(task.description || '');
      setTimeEstimate(task.time_estimate?.toString() || '');
      setDueDate(task.due_date ? new Date(task.due_date) : null);
      setHasChanges(false);
    }
  }, [task]);
  
  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTitle]);
  
  const handleTitleSave = () => {
    if (titleValue.trim() && task && onUpdateTask) {
      onUpdateTask(task.id, { title: titleValue.trim() });
      setHasChanges(true);
      displaySavingToast();
    }
    setEditingTitle(false);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTitleValue(task?.title || '');
      setEditingTitle(false);
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionValue(e.target.value);
    setHasChanges(true);
  };
  
  const handleDescriptionBlur = () => {
    if (task && onUpdateTask) {
      onUpdateTask(task.id, { description: descriptionValue.trim() });
      displaySavingToast();
    }
  };
  
  const handleTimeEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeEstimate(e.target.value);
    setHasChanges(true);
  };
  
  const handleTimeEstimateBlur = () => {
    if (task && onUpdateTask) {
      onUpdateTask(task.id, { time_estimate: timeEstimate.trim() });
      displaySavingToast();
    }
  };
  
  const handlePriorityChange = (priority: Priority) => {
    if (task && task.id && onUpdateTask) {
      if (typeof task.id !== 'string' || task.id.trim() === '') {
        console.error('Invalid task ID:', task.id);
        toast({
          title: 'Error updating task',
          description: 'Invalid task ID. Please try again.',
          variant: 'destructive',
        });
        return;
      }
      
      onUpdateTask(task.id, { priority });
      setHasChanges(true);
      displaySavingToast();
    } else {
      console.error('Cannot update priority: task ID is undefined or onUpdateTask callback missing');
      toast({
        title: 'Error updating task',
        description: 'Could not update priority. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleGenerateDescription = () => {
    if (!task) return;
    
    const newDescription = `${descriptionValue}\n\nThis task involves implementing the requested feature with high priority. It requires careful planning and execution.`;
    
    setDescriptionValue(newDescription);
    
    if (onUpdateTask) {
      onUpdateTask(task.id, { description: newDescription });
      setHasChanges(true);
      displaySavingToast();
    }
  };
  
  const handleUpdateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    if (onUpdateSubtask) {
      onUpdateSubtask(taskId, subtaskId, updates);
      setHasChanges(true);
      displaySavingToast();
    }
  };
  
  const handleDeleteSubtask = (taskId: string, subtaskId: string) => {
    if (onDeleteSubtask) {
      onDeleteSubtask(taskId, subtaskId);
      setHasChanges(true);
      displaySavingToast();
    }
  };
  
  const handleGenerateTitle = async () => {
    if (!task || !task.description) {
      toast({
        title: "Missing description",
        description: "Please add a description first to generate a title",
        variant: "destructive",
      });
      return;
    }
    
    setAiSuggestionLoading(true);
    setAiSuggestionType('title');
    
    try {
      const prompt = `Based on this task description, generate a concise, specific title (5-8 words):
      
Description: ${task.description}
${task.subtasks?.length ? `Related subtasks: ${task.subtasks.map(st => st.title).join(', ')}` : ''}
Priority: ${task.priority}`;
      
      const suggestion = await generateTaskTitle(prompt);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error generating title:", error);
      toast({
        title: "Error",
        description: "Could not generate title suggestion",
        variant: "destructive",
      });
    } finally {
      setAiSuggestionLoading(false);
    }
  };
  
  const handleSummarizeDescription = async () => {
    if (!task || !task.description) {
      toast({
        title: "Missing description",
        description: "Please add a description first to generate a summary",
        variant: "destructive",
      });
      return;
    }
    
    setAiSuggestionLoading(true);
    setAiSuggestionType('description');
    
    try {
      const prompt = `Summarize this task description:
      
Title: ${task.title}
Description: ${task.description}
Priority: ${task.priority}
Subtasks: ${task.subtasks?.length || 0} total, ${task.subtasks?.filter(st => st.completed).length || 0} completed
${task.assignees?.length ? `Assigned to: ${task.assignees.map(a => a.name).join(', ')}` : ''}`;
      
      const suggestion = await summarizeTaskDescription(prompt);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error summarizing description:", error);
      toast({
        title: "Error",
        description: "Could not generate description summary",
        variant: "destructive",
      });
    } finally {
      setAiSuggestionLoading(false);
    }
  };
  
  const handleSuggestMetadata = async () => {
    if (!task) return;
    
    setAiSuggestionLoading(true);
    setAiSuggestionType('metadata');
    
    try {
      const prompt = `Based on this task, suggest appropriate metadata (priority level, due date, and relevant tags):
      
Title: ${task.title}
Description: ${task.description || 'No description provided'}
${task.subtasks?.length ? `Subtasks: ${task.subtasks.map(st => `- ${st.title}`).join('\n')}` : ''}
Current priority: ${task.priority}
${task.due_date ? `Current due date: ${task.due_date}` : 'No due date set'}`;
      
      const suggestion = await suggestTaskMetadata(prompt);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Error suggesting metadata:", error);
      toast({
        title: "Error",
        description: "Could not generate metadata suggestions",
        variant: "destructive",
      });
    } finally {
      setAiSuggestionLoading(false);
    }
  };
  
  const handleGenerateSubtasks = async () => {
    if (!task || (!task.description && !task.title)) {
      toast({
        title: "Missing information",
        description: "Please add a title or description first to generate subtasks",
        variant: "destructive",
      });
      return;
    }
    
    setAiSuggestionLoading(true);
    setAiSuggestionType('subtasks');
    
    try {
      const prompt = `Generate subtasks for task:
      
Title: ${task.title}
Description: ${task.description || 'No description provided'}
Existing subtasks: ${task.subtasks?.map(st => st.title).join(', ') || 'None'}

Generate 3-5 practical subtasks that would help complete this task.`;
      
      const subtasks = await generateSubtasks(prompt);
      setAiGeneratedSubtasks(subtasks);
      setAiSuggestion(subtasks);
    } catch (error) {
      console.error("Error generating subtasks:", error);
      toast({
        title: "Error",
        description: "Could not generate subtasks",
        variant: "destructive",
      });
    } finally {
      setAiSuggestionLoading(false);
    }
  };
  
  const handleAcceptAiSuggestion = () => {
    if (!task || !onUpdateTask) return;
    
    switch (aiSuggestionType) {
      case 'title':
        onUpdateTask(task.id, { title: aiSuggestion });
        setTitleValue(aiSuggestion);
        break;
      case 'description':
        onUpdateTask(task.id, { description: aiSuggestion });
        setDescriptionValue(aiSuggestion);
        break;
      case 'metadata':
        onUpdateTask(task.id, { 
          priority: aiSuggestion.priority,
          due_date: aiSuggestion.dueDate ? new Date(aiSuggestion.dueDate).toISOString() : task.due_date
        });
        break;
      case 'subtasks':
        if (onAddNestedSubtask) {
          aiGeneratedSubtasks.forEach(subtaskTitle => {
            onAddNestedSubtask(task.id, null, subtaskTitle);
          });
        }
        break;
    }
    
    setAiSuggestion(null);
    setAiSuggestionType(null);
    
    toast({
      title: "AI suggestion applied",
      description: "Changes have been applied to the task",
    });
  };
  
  const handleRejectAiSuggestion = () => {
    setAiSuggestion(null);
    setAiSuggestionType(null);
    
    toast({
      description: "AI suggestion dismissed",
    });
  };
  
  const displaySavingToast = () => {
    setIsSaving(true);
    
    toast({
      title: "Changes saved",
      description: "Your task has been updated",
      duration: 2000,
    });
    
    setTimeout(() => {
      setHasChanges(false);
      setIsSaving(false);
    }, 1500);
  };
  
  return {

    activeTab,
    editingTitle,
    titleValue,
    descriptionValue,
    timeEstimate,
    dueDate,
    hasChanges,
    isSaving,
    titleInputRef,
    aiSuggestion,
    aiSuggestionType,
    aiSuggestionLoading,
    

    setActiveTab,
    setEditingTitle,
    handleTitleSave,
    handleTitleKeyDown,
    handleDescriptionChange,
    handleDescriptionBlur,
    handleTimeEstimateChange,
    handleTimeEstimateBlur,
    handlePriorityChange,
    handleGenerateDescription,
    handleUpdateSubtask,
    handleDeleteSubtask,
    handleGenerateTitle,
    handleSummarizeDescription,
    handleSuggestMetadata,
    handleGenerateSubtasks,
    handleAcceptAiSuggestion,
    handleRejectAiSuggestion,
    displaySavingToast
  };
};
