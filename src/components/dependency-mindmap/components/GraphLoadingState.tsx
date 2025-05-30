import React from "react";

const GraphLoadingState: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-pulse text-gray-500 text-lg font-medium">
          Loading dependency graph...
        </div>
        <div className="h-1 w-32 bg-gray-200 rounded mt-4 overflow-hidden">
          <div className="h-full w-1/2 bg-blue-500 rounded animate-[progress_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default GraphLoadingState;
