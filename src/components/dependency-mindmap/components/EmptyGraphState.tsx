import React from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const EmptyGraphState: React.FC<{ onRefresh?: () => void }> = ({
  onRefresh,
}) => {
  const handleRefresh = () => {
    toast({
      title: "Refreshing data",
      description: "Attempting to reload graph data",
    });

    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <RefreshCw className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-lg mb-2">
          No dependency data available
        </h3>
        <p className="text-gray-500 mb-4">
          There are no dependencies to display for this task.
        </p>
        <Button variant="outline" onClick={handleRefresh} className="mx-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default EmptyGraphState;
