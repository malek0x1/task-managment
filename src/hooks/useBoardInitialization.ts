
import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import useKanbanStore from '@/store/useKanbanStore';

export const useBoardInitialization = () => {
  const { currentProjectId } = useProjectStore();
  const { 
    fetchData, 
    isLoading: kanbanLoading,
    columns,
    tasks,
    error: kanbanError
  } = useKanbanStore();
  
  const initializationRef = useRef(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeBoard = async () => {
      if (!currentProjectId || initializationRef.current) {
        return;
      }

      try {
        initializationRef.current = true;
        setInitialLoading(true);
        setError(null);
        console.log('Initializing kanban board for project:', currentProjectId);
        
        await fetchData();
        
        console.log('Kanban board initialization complete');
      } catch (error) {
        console.error('Error initializing kanban board:', error);
        setError('Failed to load board data');
      } finally {
        initializationRef.current = false;
        setInitialLoading(false);
      }
    };

    if (currentProjectId) {
      initializeBoard();
    }
  }, [currentProjectId, fetchData]);

  const retryLoading = () => {
    if (currentProjectId) {
      initializationRef.current = false;
      setError(null);
      fetchData().catch((err) => {
        console.error('Retry failed:', err);
        setError('Failed to load board data');
      });
    }
  };

  return {
    isLoading: kanbanLoading,
    initialLoading,
    error: error || kanbanError,
    isInitialized: !!currentProjectId && columns.length > 0,
    hasData: columns.length > 0 || tasks.length > 0,
    projectAvailable: !!currentProjectId,
    retryLoading
  };
};

export default useBoardInitialization;
