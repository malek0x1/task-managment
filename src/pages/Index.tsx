
import React, { useEffect, useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSeedData } from '@/hooks/useSeedData';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import { toast } from '@/hooks/use-toast';
import ProjectCreateModal from '@/components/project/ProjectCreateModal';
import AppHeader from '@/components/header/AppHeader';
import useKanbanStore from '@/store/useKanbanStore';

interface IndexProps {
  needsOnboarding?: boolean;
}

const Index: React.FC<IndexProps> = () => {
  const { isSeeded, isSeeding, needsSeeding, seedData } = useSeedData();
  const { logout, user } = useAuthStore();
  const { 
    projects, 
    currentProjectId, 
    switchProject, 
    fetchProjects,
    isLoading: projectsLoading
  } = useProjectStore();
  
  const { columns, tasks, fetchData, resetState } = useKanbanStore();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [seedingCompleted, setSeedingCompleted] = useState(false);
  const [initialDataChecked, setInitialDataChecked] = useState(false);
  const [previousProjectId, setPreviousProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (currentProjectId && previousProjectId && currentProjectId !== previousProjectId) {
      setInitialDataChecked(false);
      setSeedingCompleted(false);
      resetState();
    }
    
    setPreviousProjectId(currentProjectId);
  }, [currentProjectId, previousProjectId, resetState]);

  useEffect(() => {
    if (!initialDataChecked && currentProjectId) {
      const hasExistingData = columns.length > 0 || tasks.length > 0;
      
      if (!hasExistingData) {
        fetchData().then(() => {
          setInitialDataChecked(true);
        }).catch(error => {
          console.error('Error fetching initial data:', error);
          setInitialDataChecked(true);
        });
      } else {
        setInitialDataChecked(true);
      }
    }
  }, [currentProjectId, columns.length, tasks.length, fetchData, initialDataChecked]);

  const handleSeedData = async () => {
    try {
      await seedData();
      setSeedingCompleted(true);
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };

  const currentProject = projects.find(p => p.id === currentProjectId);
  const projectName = currentProject?.name || 'Project Board';

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: 'Signed out successfully',
        description: 'You have been signed out of your account.',
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error signing out',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const shouldShowSeedingUI = !initialDataChecked || 
    (needsSeeding && !isSeeding && !isSeeded && !seedingCompleted && columns.length === 0 && tasks.length === 0);

  if (shouldShowSeedingUI) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Card className="max-w-md w-full shadow-lg border-0">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M16 20V4H8"/>
                <path d="M12 14V4"/>
                <path d="M20 20V9.5L12 4L4 9.5V20"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold mb-4">Welcome to Project Board</h1>
            <p className="mb-6 text-gray-600">
              Your board is empty. Create the default columns to get started with your project management board.
            </p>
            <Button 
              onClick={handleSeedData} 
              disabled={isSeeding}
              className="w-full"
            >
              {isSeeding ? 'Creating board...' : 'Create Board'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <AppHeader
        projects={projects}
        currentProjectId={currentProjectId}
        projectName={projectName}
        user={user}
        switchProject={switchProject}
        handleSignOut={handleSignOut}
        openProjectModal={() => setIsProjectModalOpen(true)}
      />
      
      <main className="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>

      <ProjectCreateModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
