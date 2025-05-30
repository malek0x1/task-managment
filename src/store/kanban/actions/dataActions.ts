
import { StoreState } from '../types';
import { fetchColumns as fetchColumnsFromDB, fetchTasks as fetchTasksFromDB } from '@/lib/supabase';
import { useProjectStore } from '../../useProjectStore';
import { toast } from '@/hooks/use-toast';
import { checkAuthStatus } from '@/lib/supabase';
import { ensureSubtaskFields } from '@/utils/subtaskFieldUtils';


const FETCH_DEBOUNCE_MS = 2000;
const FETCH_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;

export interface DataActions {
  fetchData: (retryCount?: number, forceRefresh?: boolean) => Promise<void>;
}

export const createDataActions = (
  set: (state: Partial<StoreState>) => void,
  get: () => StoreState
): DataActions => {

  const fetchData = async (retryCount = 0, forceRefresh = false): Promise<void> => {

    const { isAuthenticated, userId, error: authError } = await checkAuthStatus();
    if (!isAuthenticated || !userId) {
      set({ 
        isLoading: false, 
        error: 'Authentication issue. Please sign in again.' 
      });
      
      toast({
        title: 'Authentication issue',
        description: 'Please sign in again to continue.',
        variant: 'destructive',
      });
      
      return;
    }

    const { currentProjectId } = useProjectStore.getState();
    if (!currentProjectId) {
      set({ isLoading: false, error: 'No project selected' });
      return;
    }


    const now = Date.now();
    const lastFetch = get().lastFetch;
    if (!forceRefresh && lastFetch && (now - lastFetch) < FETCH_DEBOUNCE_MS) {
      return;
    }

    set({ isLoading: true, error: null, lastFetch: now });


    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`Fetch operation timed out after ${FETCH_TIMEOUT_MS}ms`)), FETCH_TIMEOUT_MS);
    });

    try {

      const fetchPromise = async () => {
        // eslint-disable-next-line no-useless-catch
        try {

          const columnsPromise = fetchColumnsFromDB(currentProjectId);
          const tasksPromise = fetchTasksFromDB(currentProjectId);


          const [columns, tasks] = await Promise.all([columnsPromise, tasksPromise]);
          

          const normalizedTasks = ensureSubtaskFields(tasks);
          

          set({ columns, tasks: normalizedTasks, isLoading: false });
        } catch (err) {
          throw err; 
        }
      };
      

      await Promise.race([fetchPromise(), timeoutPromise]);
      

      clearTimeout(timeoutId);
    } catch (error) {

      if (retryCount < MAX_RETRIES) {

        set({ isLoading: false });
        

        setTimeout(() => {

          fetchData(retryCount + 1);
        }, 1000 * (retryCount + 1)); 
        
        return;
      }
      

      set({ isLoading: false, error: 'Failed to load board data' });
      toast({
        title: 'Error loading board',
        description: 'Failed to load your board data. Please try refreshing the page.',
        variant: 'destructive',
      });
    } finally {

      clearTimeout(timeoutId);
      if (get().isLoading) {
        set({ isLoading: false });
      }
    }
  };


  return {
    fetchData
  };
};
