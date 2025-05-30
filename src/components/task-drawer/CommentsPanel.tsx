
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const CommentsPanel: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h4 className="text-sm font-medium text-gray-500 mb-2">Comments</h4>
      <div className="bg-gray-50 text-gray-500 rounded p-4 text-center mb-4 transition-all hover:bg-gray-100">
        <MessageSquare className="w-5 h-5 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No comments yet.</p>
      </div>
      
      <div className="mt-4">
        <Textarea 
          placeholder="Add a comment..."
          rows={3}
          className="mb-2"
        />
        <Button className="mt-2">
          Post Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentsPanel;
