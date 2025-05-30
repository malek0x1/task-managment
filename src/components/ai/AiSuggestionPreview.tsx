
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AiSuggestionPreviewProps {
  title: string;
  suggestion: string | string[] | React.ReactNode;
  onAccept: () => void;
  onReject: () => void;
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

const AiSuggestionPreview: React.FC<AiSuggestionPreviewProps> = ({
  title,
  suggestion,
  onAccept,
  onReject,
  className,
  isLoading = false,
  loadingMessage = "Generating suggestion..."
}) => {
  const { toast } = useToast();
  
  const handleAccept = () => {
    onAccept();
    toast({
      title: "AI suggestion applied",
      description: "You can undo this action if needed",
    });
  };
  
  const handleReject = () => {
    onReject();
    toast({
      description: "AI suggestion dismissed",
    });
  };
  
  return (
    <Card className={cn("border-purple-100 shadow-md", className)}>
      <CardContent className="p-4 pt-4">
        <div className="flex items-center gap-2 mb-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-purple-500 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-purple-500" />
          )}
          <h4 className="text-sm font-medium">{title}</h4>
        </div>
        
        <div className="bg-purple-50/50 rounded-md p-3 text-sm">
          {isLoading ? (
            <div className="flex items-center justify-center h-16">
              <div className="animate-pulse flex flex-col items-center">
                <Loader2 className="h-5 w-5 text-purple-400 animate-spin mb-2" />
                <p className="text-purple-700 text-xs">{loadingMessage}</p>
              </div>
            </div>
          ) : (
            <>
              {Array.isArray(suggestion) ? (
                <ul className="list-disc list-inside space-y-1">
                  {suggestion.map((item, index) => (
                    <li key={index} className="text-gray-800">{item}</li>
                  ))}
                </ul>
              ) : typeof suggestion === 'string' ? (
                <p className="text-gray-800 whitespace-pre-line">{suggestion}</p>
              ) : (
                suggestion
              )}
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 px-4 py-3 border-t bg-gray-50/50">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 text-xs"
          onClick={handleReject}
          disabled={isLoading}
        >
          <X className="h-3.5 w-3.5 mr-1" /> Dismiss
        </Button>
        
        <Button
          variant="default"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-xs"
          onClick={handleAccept}
          disabled={isLoading}
        >
          <Check className="h-3.5 w-3.5 mr-1" /> Apply
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AiSuggestionPreview;
