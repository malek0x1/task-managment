
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionEditorProps {
  description: string;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDescriptionBlur: (e: React.FocusEvent) => void;
  onGenerateDescription: (e: React.MouseEvent) => void;
  onInputClick: (e: React.MouseEvent) => void;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({
  description,
  onDescriptionChange,
  onDescriptionBlur,
  onGenerateDescription,
  onInputClick
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-xs font-medium text-gray-500">Description</h4>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs text-gray-500 flex items-center h-6 px-2"
          onClick={onGenerateDescription}
        >
          <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
          Generate
        </Button>
      </div>
      <Textarea
        placeholder="Add a more detailed description..."
        value={description}
        onChange={onDescriptionChange}
        onBlur={onDescriptionBlur}
        onClick={onInputClick}
        className="min-h-[80px] text-sm"
      />
    </div>
  );
};

export default DescriptionEditor;
