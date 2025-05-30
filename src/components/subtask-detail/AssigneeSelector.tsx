
import React from 'react';
import { User, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Assignee } from '@/types/kanban';

interface AssigneeSelectorProps {
  assignee?: Assignee | string;
  onAutoAssign: (e: React.MouseEvent) => void;
}

const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({ assignee, onAutoAssign }) => {
  const getAssigneeName = () => {
    if (!assignee) return null;
    if (typeof assignee === 'string') return assignee;
    return assignee.name;
  };

  const getAssigneeAvatar = () => {
    if (!assignee) return null;
    if (typeof assignee === 'string') return null;
    return assignee.avatar;
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 mb-1 block">Assignee</label>
      
      <div className="flex items-center justify-between">
        {assignee ? (
          <div className="flex items-center gap-2 border border-gray-200 rounded-md py-1.5 px-2 group text-sm">
            <Avatar className="h-5 w-5">
              {getAssigneeAvatar() ? (
                <AvatarImage 
                  src={getAssigneeAvatar()} 
                  alt={getAssigneeName() || 'User'} 
                />
              ) : (
                <AvatarFallback className="text-xs bg-blue-100 text-blue-500">
                  {getAssigneeName() ? getAssigneeName()?.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-sm">{getAssigneeName()}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
          </div>
        ) : (
          <Button
            variant="outline" 
            size="sm" 
            className="text-xs h-8 flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <User className="h-3.5 w-3.5" />
            <span>Assign</span>
            <ChevronDown className="h-3 w-3 ml-1 text-gray-500" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-8 hover:bg-gray-100"
          onClick={onAutoAssign}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          <span>Auto</span>
        </Button>
      </div>
    </div>
  );
};

export default AssigneeSelector;
