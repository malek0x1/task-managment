
import React, { useState, useCallback, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Sparkles, Link, Settings, ChevronDown, Plus, Network, PencilLine, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import SubtaskItem from './subtask-item';
import AddSubtaskInput from './AddSubtaskInput';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Task, TabType, Subtask } from '@/types/kanban';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  onOpenTaskDrawer: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  isDraggingAny?: boolean;
  animationDelay?: number;
}

const TaskCard: React.FC<TaskCardProps> = memo(({ 
  task, 
  onOpenTaskDrawer, 
  onToggleSubtask,
  onAddSubtask,
  onUpdateSubtask,
  onDeleteSubtask = () => {},
  onDeleteTask = () => {},
  isDraggingAny = false,
  animationDelay = 0
}) => {
  const navigate = useNavigate();
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({ 
    id: task.id,
    disabled: isDraggingAny
  });
  
  const style = React.useMemo(() => {
    const baseStyle = {
      animationDelay: `${animationDelay * 50}ms`,
    };
    
    if (!transform) return baseStyle;
    
    return {
      ...baseStyle,
      transform: CSS.Transform.toString(transform),
      transition,
    };
  }, [transform, transition, animationDelay]);
  
  const handleTaskClick = useCallback((e: React.MouseEvent) => {
    if (!isAddingSubtask && !isDragging) {
      onOpenTaskDrawer(task);
    }
  }, [isAddingSubtask, isDragging, onOpenTaskDrawer, task]);
  
  const handleSubtaskDeepClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      const taskWithTabInfo = {
        ...task,
        initialTab: 'subtasks' as TabType
      };
      onOpenTaskDrawer(taskWithTabInfo);
    }
  }, [isDragging, onOpenTaskDrawer, task]);

  const handleAddSubtask = useCallback((taskId: string, subtaskTitle: string) => {
    onAddSubtask(taskId, subtaskTitle);
    setIsAddingSubtask(false);
  }, [onAddSubtask]);
  
  const handleToggleSubtasks = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSubtasksOpen(prev => !prev);
  }, []);
  
  const handleAddSubtaskButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingSubtask(true);
  }, []);
  
  const handleCancelAddSubtask = useCallback(() => {
    setIsAddingSubtask(false);
  }, []);
  
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);
  
  const handleNavigateToMindmap = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (task && task.id) {
      navigate(`/dependency-mindmap?taskId=${task.id}`);
    }
  }, [navigate, task]);
  
  const handleDeleteTask = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (task && task.id && onDeleteTask) {
      onDeleteTask(task.id);
    }
  }, [onDeleteTask, task]);
  
  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenTaskDrawer(task);
  }, [onOpenTaskDrawer, task]);
  
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length || 0;
  const totalSubtasks = subtasks.length || 0;
  const hasSubtasks = totalSubtasks > 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
  
  const MAX_VISIBLE_SUBTASKS = 3;
  const hasMoreSubtasks = totalSubtasks > MAX_VISIBLE_SUBTASKS;
  const hasNestedSubtasks = React.useMemo(() => {
    return subtasks.some(subtask => subtasks.some(s => s.parentSubtaskId === subtask.id));
  }, [subtasks]);
  
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    low: 'bg-blue-100 text-blue-800 border border-blue-200'
  };
  
  const handleUpdateSubtask = useCallback((taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    try {
      const subtask = task.subtasks?.find(st => st.id === subtaskId);
      if (!subtask) {
        return;
      }
      
      const fullUpdate: Partial<Subtask> = {
        ...subtask,
        ...updates,
        id: subtaskId,
        title: updates.title || subtask.title,
        completed: 'completed' in updates ? updates.completed : subtask.completed,
        parentSubtaskId: 'parentSubtaskId' in updates ? updates.parentSubtaskId : subtask.parentSubtaskId
      };
      
      onUpdateSubtask(taskId, subtaskId, fullUpdate);
      
    } catch (error) {
      console.error('TaskCard: Error preparing subtask update:', error);
    }
  }, [task.subtasks, onUpdateSubtask]);
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleTaskClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-white rounded-md p-2.5 mb-2 shadow-sm hover:shadow-md transition-all duration-200",
        "border border-gray-100 hover:border-gray-200",
        isDragging ? "opacity-70 cursor-grabbing z-50 scale-105 rotate-1" : "cursor-grab active:cursor-grabbing",
        "transform-gpu relative group hover:scale-[1.01]",
        "animate-fade-in"
      )}
      data-task-id={task.id}
    >
      <div className="mb-2 relative flex items-start justify-between">
        <div className="flex-1 pr-12">
          <h3 className="text-sm font-medium mb-1.5 leading-5">{task.title}</h3>
          
          {task.labels && task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {task.labels.slice(0, 3).map(label => (
                <span 
                  key={label.id} 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${label.color}20`, color: label.color }}
                >
                  {label.name}
                </span>
              ))}
              {task.labels.length > 3 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  +{task.labels.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className={cn(
          "absolute top-0 right-0 transition-all duration-200 flex gap-0.5",
          "bg-white/95 backdrop-blur-sm rounded-md shadow-sm border border-gray-200/50 p-1",
          isHovering ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}>
          {hasSubtasks && (
            <div 
              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors p-1.5 rounded cursor-pointer"
              onClick={handleNavigateToMindmap}
              title="View in Mindmap"
            >
              <Network className="w-3.5 h-3.5" />
            </div>
          )}
          <div 
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors p-1.5 rounded cursor-pointer"
            onClick={handleEditClick}
            title="Edit Task"
          >
            <PencilLine className="w-3.5 h-3.5" />
          </div>
          <div 
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded cursor-pointer"
            onClick={handleDeleteTask}
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {task.priority && (
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            priorityColors[task.priority as keyof typeof priorityColors]
          )}>
            <span aria-hidden="true">
              {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟠' : '🔵'}
            </span>{' '}
            <span className="priority-label">{task.priority}</span>
          </span>
        )}
        
        {task.due_date && (
          <div className="text-xs text-gray-600 flex items-center bg-gray-50 px-2 py-0.5 rounded-full">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
      </div>
      
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex -space-x-2 mb-2 overflow-hidden">
          {task.assignees.slice(0, 3).map(assignee => (
            <div 
              key={assignee.id} 
              className="w-5 h-5 rounded-full border-2 border-white overflow-hidden hover:z-10 hover:scale-110 transition-transform"
              title={assignee.name}
            >
              <img src={assignee.avatar} alt={assignee.name} className="w-full h-full object-cover" />
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        {task.has_ai_assistant && (
          <div className="p-1 rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors" title="AI Assistant">
            <Sparkles className="w-3 h-3" />
          </div>
        )}
        
        {task.has_dependencies && (
          <div className="p-1 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors" title="Has Dependencies">
            <Link className="w-3 h-3" />
          </div>
        )}
        
        {task.has_automations && (
          <div className="p-1 rounded-full bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors" title="Has Automations">
            <Settings className="w-3 h-3" />
          </div>
        )}
      </div>
      
      {!hasSubtasks && isHovering && (
        <div onClick={(e) => e.stopPropagation()} className="mt-2 pt-2 border-t border-gray-100">
          <AddSubtaskInput 
            taskId={task.id}
            onAddSubtask={handleAddSubtask}
            onCancel={handleCancelAddSubtask}
            showInputDirectly={isAddingSubtask}
          />
        </div>
      )}
      
      {(hasSubtasks || (isAddingSubtask && hasSubtasks)) && (
        <div className="border-t border-gray-100 pt-2 mt-2">
          {hasSubtasks && (
            <>
              <div className="mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span className="flex items-center">
                    <ChevronDown 
                      className={`w-3.5 h-3.5 mr-1 transform transition-transform duration-300 ease-in-out ${isSubtasksOpen ? 'rotate-180' : ''}`}
                      onClick={handleToggleSubtasks}
                    />
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                    {hasNestedSubtasks && (
                      <span 
                        onClick={handleSubtaskDeepClick}
                        className="ml-1 text-xs font-semibold text-blue-500 cursor-pointer hover:underline flex items-center"
                      >
                        <Plus className="w-3 h-3" />
                      </span>
                    )}
                  </span>
                  <span className="text-xs">{Math.round(subtaskProgress)}%</span>
                </div>
                <Progress value={subtaskProgress} className="h-1.5" />
              </div>
              
              <Collapsible 
                open={isSubtasksOpen}
                onOpenChange={setIsSubtasksOpen}
                className="will-change-transform"
              >
                <CollapsibleTrigger 
                  asChild
                  className="flex items-center text-xs text-gray-600 hover:text-gray-900 w-full justify-start group"
                >
                  <button onClick={handleToggleSubtasks} className="flex items-center w-full">
                    <span>
                      {isSubtasksOpen ? "Hide subtasks" : "Show subtasks"}
                    </span>
                  </button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2 overflow-hidden">
                  <div className="pl-1 border-l-2 border-gray-200 animate-in slide-in-from-top-1 duration-200">
                    {subtasks
                      .filter(st => !st.parentSubtaskId)
                      .slice(0, MAX_VISIBLE_SUBTASKS)
                      .map(subtask => (
                        <SubtaskItem
                          key={subtask.id}
                          subtask={subtask}
                          taskId={task.id}
                          onToggle={onToggleSubtask}
                          onOpenDeepSubtasks={handleSubtaskDeepClick}
                          onUpdateSubtask={handleUpdateSubtask}
                          onAddNestedSubtask={(taskId, parentId, title) => onAddSubtask(taskId, title)}
                          onDeleteSubtask={onDeleteSubtask}
                        />
                      ))}
                    
                    {hasMoreSubtasks && (
                      <div 
                        className="text-xs text-gray-500 pl-6 py-1 cursor-pointer hover:text-primary transition-colors flex items-center"
                        onClick={handleSubtaskDeepClick}
                      >
                        <Plus className="w-3 h-3 mr-1" /> 
                        {totalSubtasks - MAX_VISIBLE_SUBTASKS} more subtasks...
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
          
          <div onClick={(e) => e.stopPropagation()}>
            <AddSubtaskInput 
              taskId={task.id}
              onAddSubtask={handleAddSubtask}
              onCancel={handleCancelAddSubtask}
              showInputDirectly={isAddingSubtask}
            />
          </div>
        </div>
      )}
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;
