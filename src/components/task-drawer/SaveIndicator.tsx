
import React from 'react';
import { Check, Circle } from 'lucide-react';

interface SaveIndicatorProps {
  isSaving: boolean;
  hasChanges: boolean;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isSaving, hasChanges }) => {
  if (isSaving) {
    return (
      <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center animate-fade-in z-50">
        <Check className="w-4 h-4 mr-2" />
        Saving changes...
      </div>
    );
  }
  
  if (hasChanges) {
    return (
      <div className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg flex items-center animate-fade-in z-50">
        <Circle className="w-4 h-4 mr-2" />
        Autosaving...
      </div>
    );
  }
  
  return null;
};

export default SaveIndicator;
