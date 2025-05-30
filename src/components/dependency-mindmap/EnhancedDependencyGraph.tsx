
import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import TaskDependencyMindmap from './TaskDependencyMindmap';
import withSubtaskActions from './withSubtaskActions';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';

const EnhancedTaskDependencyMindmap = withSubtaskActions(TaskDependencyMindmap);

const EnhancedDependencyGraph: React.FC<{ taskId: string }> = ({ taskId }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [expandedPanel, setExpandedPanel] = useState<'graph' | 'notes' | null>(null);
  const [panelLayout, setPanelLayout] = useState<'horizontal' | 'vertical'>(() => {
    const savedLayout = localStorage.getItem('dependency-mindmap-layout');
    return savedLayout === 'vertical' ? 'vertical' : 'horizontal';
  });

  useEffect(() => {
    localStorage.setItem('dependency-mindmap-layout', panelLayout);
  }, [panelLayout]);

  return (
    <div className={cn(
      "h-full w-full transition-all duration-300",
      "bg-gradient-to-b from-gray-50 to-white",
      expandedPanel === 'graph' ? 'graph-expanded' : '',
      expandedPanel === 'notes' ? 'notes-expanded' : '',
    )}>
      <ReactFlowProvider>
        <EnhancedTaskDependencyMindmap 
          taskId={taskId}
          expandedPanel={expandedPanel}
          onExpandPanel={setExpandedPanel}
          isMobile={isMobile}
          panelLayout={panelLayout}
          onPanelLayoutChange={setPanelLayout}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default EnhancedDependencyGraph;
