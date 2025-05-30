
import React from 'react';
import { cn } from '@/lib/utils';
import { TabType } from '@/types/kanban';
import { MessageSquare, Activity, Network } from 'lucide-react';

interface TaskDrawerTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  completedSubtasks: number;
  totalSubtasks: number;
}

const TaskDrawerTabs: React.FC<TaskDrawerTabsProps> = ({
  activeTab,
  setActiveTab,
  completedSubtasks,
  totalSubtasks
}) => {
  return (
    <div className="flex border-b overflow-x-auto scrollbar-hide mt-4">
      <button 
        className={cn(
          "flex-none py-2 px-3 text-sm font-medium whitespace-nowrap",
          activeTab === 'details' ? "text-primary border-b-2 border-primary" : "text-gray-500"
        )}
        onClick={() => setActiveTab('details')}
      >
        Details
      </button>
      <button 
        className={cn(
          "flex-none py-2 px-3 text-sm font-medium whitespace-nowrap",
          activeTab === 'subtasks' ? "text-primary border-b-2 border-primary" : "text-gray-500"
        )}
        onClick={() => setActiveTab('subtasks')}
      >
        Subtasks {completedSubtasks}/{totalSubtasks}
      </button>
      <button 
        className={cn(
          "flex-none py-2 px-3 text-sm font-medium whitespace-nowrap",
          activeTab === 'dependencies' ? "text-primary border-b-2 border-primary" : "text-gray-500"
        )}
        onClick={() => setActiveTab('dependencies')}
      >
        <Network className="w-4 h-4 inline mr-1" />
        Dependencies
      </button>
      <button 
        className={cn(
          "flex-none py-2 px-3 text-sm font-medium whitespace-nowrap",
          activeTab === 'comments' ? "text-primary border-b-2 border-primary" : "text-gray-500"
        )}
        onClick={() => setActiveTab('comments')}
      >
        <MessageSquare className="w-4 h-4 inline mr-1" />
        Comments
      </button>
      <button 
        className={cn(
          "flex-none py-2 px-3 text-sm font-medium whitespace-nowrap",
          activeTab === 'activity' ? "text-primary border-b-2 border-primary" : "text-gray-500"
        )}
        onClick={() => setActiveTab('activity')}
      >
        <Activity className="w-4 h-4 inline mr-1" />
        Activity
      </button>
    </div>
  );
};

export default TaskDrawerTabs;
