
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface SubtaskActionButtonsProps {
  onToggleDetailPanel: (e: React.MouseEvent) => void;
  onShowAddInput: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const SubtaskActionButtons: React.FC<SubtaskActionButtonsProps> = ({
  onToggleDetailPanel,
  onShowAddInput,
  onDelete
}) => {
  return (
    <div className="flex space-x-1 transition-opacity duration-200">
      <button 
        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm"
        onClick={onToggleDetailPanel}
        aria-label="Edit subtask details"
      >
        <Edit className="h-3.5 w-3.5" />
      </button>
      <button 
        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm"
        onClick={onDelete}
        aria-label="Delete subtask"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default SubtaskActionButtons;
