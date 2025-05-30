import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tikdkicchnfbztyuuhso.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

export async function checkAuthStatus() {
  try {
    const { data, error } = await supabase.auth.getSession();
    const session = data?.session;
    const isAuthenticated = !!session?.user;
    const userId = session?.user?.id || null;
    
    return { isAuthenticated, userId, error };
  } catch (e) {
    console.error('Error checking auth status:', e);
    return { isAuthenticated: false, userId: null, error: e };
  }
}
