
import React from 'react';
import { cn } from '@/lib/utils';
import { SubtaskDetailPanel } from '@/components/subtask-detail';
import { Subtask } from '@/types/kanban';

interface SubtaskDetailWrapperProps {
  subtask: Subtask;
  taskId: string;
  showDetailPanel?: boolean;
  isClosingPanel: boolean;
  handleSubtaskUpdate: (updates: Partial<Subtask>) => void;
  handleCloseDetailPanel: () => void;
  handleDetailPanelClick: (e: React.MouseEvent) => void;
}

const SubtaskDetailWrapper: React.FC<SubtaskDetailWrapperProps> = ({
  subtask,
  taskId,
  showDetailPanel,
  isClosingPanel,
  handleSubtaskUpdate,
  handleCloseDetailPanel,
  handleDetailPanelClick
}) => {
  if (!showDetailPanel && !isClosingPanel) return null;
  
  return (
    <div 
      className={cn(
        "pl-6 pr-2 py-2 mt-1 bg-gray-50 rounded-md border border-gray-100",
        isClosingPanel ? "animate-accordion-up" : "animate-accordion-down"
      )}
      onClick={handleDetailPanelClick}
    >
      <SubtaskDetailPanel 
        subtask={subtask}
        onUpdate={handleSubtaskUpdate}
        onClose={handleCloseDetailPanel}
      />
    </div>
  );
};

export default SubtaskDetailWrapper;
