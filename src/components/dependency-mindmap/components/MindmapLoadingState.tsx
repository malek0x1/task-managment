import React from "react";

const MindmapLoadingState: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-gray-200 mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-36 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default MindmapLoadingState;
