
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MobileActionsProps {
  isVisible: boolean;
}

const MobileActions: React.FC<MobileActionsProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <Button 
      size="lg"
      className="fixed bottom-6 left-6 rounded-full shadow-lg h-14 w-14 p-0"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
};

export default MobileActions;
