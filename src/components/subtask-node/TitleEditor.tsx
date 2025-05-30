
import React from 'react';
import { cn } from '@/lib/utils';

interface TitleEditorProps {
  title: string;
  completed: boolean;
  isEditingTitle: boolean;
  titleValue: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onStartEdit: () => void;
}

const TitleEditor: React.FC<TitleEditorProps> = ({
  title,
  completed,
  isEditingTitle,
  titleValue,
  onTitleChange,
  onTitleBlur,
  onKeyDown,
  onStartEdit
}) => {
  if (isEditingTitle) {
    return (
      <input
        type="text"
        value={titleValue}
        onChange={onTitleChange}
        onBlur={onTitleBlur}
        onKeyDown={onKeyDown}
        className="flex-1 px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
        onClick={(e) => e.stopPropagation()}
        autoFocus
      />
    );
  }
  
  return (
    <span 
      className={cn(completed ? "line-through text-gray-400" : "")}
      onClick={(e) => {
        e.stopPropagation();
        onStartEdit();
      }}
    >
      {title}
    </span>
  );
};

export default TitleEditor;
