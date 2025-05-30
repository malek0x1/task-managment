
import React, { useState } from 'react';
import { Network, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DependencyGraph from '@/components/dependency-mindmap/DependencyGraph';

interface DependenciesPanelProps {
  taskId: string;
}

const DependenciesPanel: React.FC<DependenciesPanelProps> = ({ taskId }) => {
  const [showPreview, setShowPreview] = useState(false);
  
  return (
    <div className="animate-fade-in">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Dependencies</h4>
      
      {showPreview ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-64">
          <DependencyGraph taskId={taskId} />
          <div className="absolute bottom-2 right-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-7 shadow-sm"
              asChild
            >
              <Link to={`/dependency-mindmap?taskId=${taskId}`}>
                <ExternalLink className="mr-1 h-3 w-3" />
                Open Full View
              </Link>
            </Button>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-6 text-xs"
            onClick={() => setShowPreview(false)}
          >
            Hide Preview
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
          <Network className="w-8 h-8 text-gray-300 mb-2" />
          <p className="text-gray-500 text-sm mb-3">Dependency visualization will appear here</p>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-7"
              onClick={() => setShowPreview(true)}
            >
              Show Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              asChild
            >
              <Link to={`/dependency-mindmap?taskId=${taskId}`}>
                <ExternalLink className="mr-1 h-3 w-3" />
                Open Full View
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DependenciesPanel;
