
import React from 'react';
import { Calendar, Link2 } from 'lucide-react';
import UserList from '../UserList';
import { TaskNodeData } from '../types/nodeTypes';

interface TaskNodeContentProps {
  data: TaskNodeData;
}

export const TaskNodeContent: React.FC<TaskNodeContentProps> = ({ data }) => {
  return (
    <>
      {data.task.description && (
        <div className="text-xs text-gray-500 line-clamp-2 mb-2 mt-1">
          {data.task.description}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{data.task.due_date || "No due date"}</span>
          </div>
          
          {data.task.dependencies && data.task.dependencies.length > 0 && (
            <div className="flex items-center gap-1">
              <Link2 className="h-3 w-3" />
              <span>Has dependencies</span>
            </div>
          )}
        </div>
      </div>
      
      {data.collaborators && data.collaborators.length > 0 && (
        <div className="mt-3">
          <UserList collaborators={data.collaborators} />
        </div>
      )}
    </>
  );
};

export default TaskNodeContent;
