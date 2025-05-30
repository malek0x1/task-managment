
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { NestedSubtask } from '@/utils/subtaskTree';
import SubtaskNode from './subtask-node';
import AddNestedSubtaskInput from './AddNestedSubtaskInput';
import { Subtask } from '@/types/kanban';

interface SubtaskTreeProps {
  subtasks: NestedSubtask[];
  taskId: string;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddNestedSubtask: (taskId: string, parentSubtaskId: string | null, title: string) => void;
  onUpdateSubtask?: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => Promise<void>;
  onReorderSubtask?: (taskId: string, subtaskId: string, direction: 'up' | 'down') => void;
}

const SubtaskTree: React.FC<SubtaskTreeProps> = ({
  subtasks,
  taskId,
  onToggleSubtask,
  onAddNestedSubtask,
  onUpdateSubtask = () => {},
  onDeleteSubtask = () => Promise.resolve(),
  onReorderSubtask
}) => {
  const [showAddInput, setShowAddInput] = useState<boolean>(false);
  const [showNestedInputs, setShowNestedInputs] = useState<Record<string, boolean>>({});
  
  const handleAddRootSubtask = (title: string): void => {
    if (!taskId) {
      return;
    }
    
    onAddNestedSubtask(taskId, null, title);
    setShowAddInput(false);
  };

  const handleAddNestedSubtask = (parentSubtaskId: string, title: string): void => {
    if (!taskId) {
      return;
    }
    
    onAddNestedSubtask(taskId, parentSubtaskId, title);
    setShowNestedInputs(prev => ({
      ...prev,
      [parentSubtaskId]: false
    }));
  };

  const showNestedInput = (subtaskId: string) => {
    setShowNestedInputs(prev => ({
      ...prev,
      [subtaskId]: true
    }));
  };

  const hideNestedInput = (subtaskId: string) => {
    setShowNestedInputs(prev => ({
      ...prev,
      [subtaskId]: false
    }));
  };
  
  return (
    <div className="space-y-2">
      {subtasks && subtasks.map(subtask => (
        <div key={subtask.id}>
          <SubtaskNode
            id={subtask.id}
            data={{
              label: subtask.title,
              completed: subtask.completed,
              hasChildren: !!(subtask.children && subtask.children.length > 0),
              isCollapsed: false,
              onToggleCollapse: (subtaskId: string) => {},
              priority: subtask.priority,
              level: 0,
              subtask: subtask,
              taskId: taskId,
              parentSubtaskId: subtask.parentSubtaskId,
              onToggleComplete: onToggleSubtask,
              onAddSubtask: () => showNestedInput(subtask.id),
              onUpdateSubtask: onUpdateSubtask,
              onDeleteSubtask: onDeleteSubtask
            }}
          />
          
          {showNestedInputs[subtask.id] && (
            <div className="ml-6 mt-2">
              <AddNestedSubtaskInput
                onAdd={(title) => handleAddNestedSubtask(subtask.id, title)}
                onCancel={() => hideNestedInput(subtask.id)}
              />
            </div>
          )}
        </div>
      ))}
      
      {showAddInput ? (
        <AddNestedSubtaskInput
          onAdd={handleAddRootSubtask}
          onCancel={() => setShowAddInput(false)}
        />
      ) : (
        <button
          className="flex items-center text-xs text-gray-500 hover:text-gray-800 py-1 px-2 mt-2"
          onClick={() => setShowAddInput(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Subtask
        </button>
      )}
    </div>
  );
};

export default SubtaskTree;
