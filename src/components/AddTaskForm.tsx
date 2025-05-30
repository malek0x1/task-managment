
import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  columnId: string;
  onAddTask: (columnId: string, title: string) => void;
  className?: string;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ columnId, onAddTask, className }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAddTask(columnId, title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setTitle('');
    }
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setTitle('');
  };
  
  if (!isAdding) {
    return (
      <button
        className={cn(
          "w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-3 rounded flex items-center justify-center text-sm transition-colors",
          "hover:shadow-sm hover:-translate-y-0.5 transform duration-150 ease-out",
          className
        )}
        onClick={() => setIsAdding(true)}
        data-column-id={columnId}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Task
      </button>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className={cn("animate-fade-in", className)} data-column-id={columnId}>
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <div className="flex space-x-2">
        <Button type="submit" size="sm" className="w-full">
          Add
        </Button>
        <Button type="button" size="sm" variant="outline" className="w-full" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
