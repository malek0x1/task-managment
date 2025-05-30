
import React from 'react';
import { cn } from '@/lib/utils';
import { Subtask } from '@/types/kanban';
import { SubtaskDetailPanel } from '@/components/subtask-detail';
import { toast } from '@/hooks/use-toast';

interface SubtaskDetailWrapperProps {
  isClosing: boolean;
  subtask: Subtask;
  onUpdate: (updates: Partial<Subtask>) => void;
  onClose: () => void;
}

const SubtaskDetailWrapper: React.FC<SubtaskDetailWrapperProps> = ({
  isClosing,
  subtask,
  onUpdate,
  onClose
}) => {
  const handleUpdate = (updates: Partial<Subtask>) => {
    try {
      onUpdate({
        ...updates,
        id: subtask.id
      });
    } catch (error) {
      console.error('SubtaskDetailWrapper: Error during update:', error);
      toast({
        title: 'Update failed',
        description: 'Could not save your changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div 
      className={cn(
        "pl-6 pr-2 py-2 mt-1 bg-gray-50/70 backdrop-blur-sm rounded-md border border-gray-100 shadow-sm",
        "transition-all duration-300 ease-in-out will-change-transform will-change-opacity",
        isClosing 
          ? "opacity-0 transform scale-95" 
          : "opacity-100 transform scale-100"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <SubtaskDetailPanel 
        subtask={subtask}
        onUpdate={handleUpdate}
        onClose={onClose}
      />
    </div>
  );
};

export default SubtaskDetailWrapper;
