
import React from 'react';
import ProjectHeader from './ProjectHeader';
import HeaderActions from './HeaderActions';

interface AppHeaderProps {
  projects: Array<{ id: string; name: string }>;
  currentProjectId: string | null;
  projectName: string;
  user: any;
  switchProject: (id: string) => void;
  handleSignOut: () => Promise<void>;
  openProjectModal: () => void;
  openOnboarding?: () => void;
  resetOnboardingForTesting?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  projects,
  currentProjectId,
  projectName,
  user,
  switchProject,
  handleSignOut,
  openProjectModal,
  openOnboarding,
  resetOnboardingForTesting
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <header className="bg-white border-b py-3 px-6 flex items-center justify-between shadow-sm">
      <ProjectHeader 
        projects={projects}
        currentProjectId={currentProjectId}
        projectName={projectName}
        switchProject={switchProject}
        openProjectModal={openProjectModal}
      />
      
      <HeaderActions 
        user={user}
        handleSignOut={handleSignOut}
        openOnboarding={openOnboarding}
        resetOnboardingForTesting={resetOnboardingForTesting}
        isDevelopment={isDevelopment}
      />
    </header>
  );
};

export default AppHeader;
