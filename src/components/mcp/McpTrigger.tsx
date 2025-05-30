
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface McpTriggerProps {
  onClick: () => void;
}

const McpTrigger: React.FC<McpTriggerProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-40"
            size="icon"
          >
            <Zap className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          AI Assistant (Press / to open)
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default McpTrigger;
