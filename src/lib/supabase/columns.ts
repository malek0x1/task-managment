
import { supabase } from './client';
import { toast } from '@/hooks/use-toast';
import type { Column } from '@/types/kanban';

interface DatabaseColumn {
  id: string;
  project_id: string;
  title: string;
  order: number;
  color?: string;
  wip_limit?: number;
}


export async function fetchColumns(projectId: string): Promise<Column[]> {
  try {
    if (!projectId) {
      console.error("Project ID is required to fetch columns");
      return [];
    }

    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('project_id', projectId)
      .order('order');

    if (error) {
      console.error('Error fetching columns:', error);
      throw error;
    }


    return (data as DatabaseColumn[]).map(dbColumn => ({
      id: dbColumn.id,
      title: dbColumn.title,
      position: dbColumn.order,
      project_id: dbColumn.project_id,
      order: dbColumn.order,
      color: dbColumn.color,
      wip_limit: dbColumn.wip_limit
    }));
  } catch (error) {
    console.error('Error in fetchColumns:', error);

    return [];
  }
}


export async function createColumn(columnData: Partial<Column>): Promise<Column[]> {
  try {
    if (!columnData.project_id) {
      throw new Error("Project ID is required to create a column");
    }


    const columnToCreate = {
      project_id: columnData.project_id,
      title: columnData.title || 'New Column',
      order: columnData.order || 0,
      color: columnData.color,
      wip_limit: columnData.wip_limit
    };

    const { data, error } = await supabase
      .from('columns')
      .insert(columnToCreate)
      .select();

    if (error) {
      console.error('Error creating column:', error);
      throw error;
    }


    return (data as DatabaseColumn[]).map(dbColumn => ({
      id: dbColumn.id,
      title: dbColumn.title,
      position: dbColumn.order,
      project_id: dbColumn.project_id,
      order: dbColumn.order,
      color: dbColumn.color,
      wip_limit: dbColumn.wip_limit
    }));
  } catch (error) {
    console.error('Error in createColumn:', error);
    toast({
      title: 'Failed to create column',
      description: 'Please try again later.',
      variant: 'destructive',
    });
    throw error;
  }
}


export async function updateColumn(columnData: Partial<Column> & { id: string }): Promise<void> {
  try {
    if (!columnData.id) {
      throw new Error("Column ID is required for update");
    }

    const { error } = await supabase
      .from('columns')
      .update(columnData)
      .eq('id', columnData.id);

    if (error) {
      console.error('Error updating column:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateColumn:', error);
    toast({
      title: 'Failed to update column',
      description: 'Please try again later.',
      variant: 'destructive',
    });
    throw error;
  }
}
