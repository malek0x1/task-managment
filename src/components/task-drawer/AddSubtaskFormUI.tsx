
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Sparkles } from 'lucide-react';

interface AddSubtaskFormUIProps {
  title: string;
  isSubmitting: boolean;
  showGenerateButton: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleGenerate: () => void;
}

const AddSubtaskFormUI: React.FC<AddSubtaskFormUIProps> = ({
  title,
  isSubmitting,
  showGenerateButton,
  handleInputChange,
  handleSubmit,
  handleGenerate
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Add subtask..."
        value={title}
        onChange={handleInputChange}
        className="h-8 text-sm"
      />
      
      <div className="flex items-center space-x-1">
        <Button 
          type="submit" 
          size="sm" 
          className="h-8 px-2"
          disabled={isSubmitting || !title.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
        
        {showGenerateButton && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 px-2"
            onClick={handleGenerate}
          >
            <Sparkles className="w-4 h-4 text-purple-500" />
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddSubtaskFormUI;
