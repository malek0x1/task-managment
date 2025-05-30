
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderLabelProps {
  label: string;
  completed: boolean;
}

export const HeaderLabel: React.FC<HeaderLabelProps> = ({
  label,
  completed
}) => {
  return (
    <div 
      className="flex-1 overflow-hidden pointer-events-auto"
      data-no-dnd="true"
    >
      <h3 
        className={cn(
          "text-sm font-medium line-clamp-2 pointer-events-auto",
          completed ? "text-gray-500 line-through" : "text-gray-900"
        )}
      >
        {label}
      </h3>
    </div>
  );
};

export default HeaderLabel;
