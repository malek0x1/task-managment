
import React from 'react';

const AuthLogo = () => {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M16 20V4H8"/>
          <path d="M12 14V4"/>
          <path d="M20 20V9.5L12 4L4 9.5V20"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
      <p className="text-sm text-gray-500 mt-1">
        AI-powered project management
      </p>
    </div>
  );
};

export default AuthLogo;
