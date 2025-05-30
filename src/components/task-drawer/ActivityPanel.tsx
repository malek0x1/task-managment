
import React from 'react';
import { Activity } from 'lucide-react';

const ActivityPanel: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Activity</h4>
      <div className="space-y-3">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-full p-1 mr-2">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm"><span className="font-medium">You</span> created this task</p>
            <p className="text-xs text-gray-500">Just now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;
