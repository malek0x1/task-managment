

import { supabase as supabaseClient, checkAuthStatus } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';
import { useAuthStore } from '@/store/useAuthStore';


export const supabase = supabaseClient;


export { checkAuthStatus };


export async function createTablesIfNeeded(forceRecreate = false) {

  const tablesCreatedKey = 'flowboard_tables_created';
  


  if (localStorage.getItem(tablesCreatedKey) && !forceRecreate) {
    return false;
  }
  

  if (process.env.NODE_ENV === 'production' && !forceRecreate) {
    localStorage.setItem(tablesCreatedKey, 'true');
    return false;
  }
  
  try {
    

    const { isAuthenticated, userId } = await checkAuthStatus();
    
    if (!isAuthenticated || !userId) {
      return false;
    }



    const { error: projectsError } = await supabase.rpc('create_projects_table');
    if (projectsError) console.error('Error creating projects table:', projectsError);
    
    const { error: columnsError } = await supabase.rpc('create_columns_table');
    if (columnsError) console.error('Error creating columns table:', columnsError);
    
    const { error: tasksError } = await supabase.rpc('create_tasks_table');
    if (tasksError) console.error('Error creating tasks table:', tasksError);


    localStorage.setItem(tablesCreatedKey, 'true');
    
    return true; 
  } catch (error) {
    console.error('Error in table creation:', error);
    toast({
      title: 'Database setup issue',
      description: 'Some features may not work correctly until connection is restored.',
      variant: 'destructive',
    });
    

    localStorage.setItem(tablesCreatedKey, 'true');
    return false;
  }
}
