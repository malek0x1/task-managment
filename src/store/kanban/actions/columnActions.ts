
import { StoreState } from '../types';
import { createColumn, updateColumn } from '@/lib/supabase';
import { Column } from '@/types/kanban';
import { toast } from '@/hooks/use-toast';
import { useProjectStore } from '../../useProjectStore';

export interface ColumnActions {
  addColumn: (columnData: Partial<Column>) => Promise<string>;
  updateColumnTitle: (columnId: string, title: string) => Promise<void>;
  reorderColumns: (activeIndex: number, overIndex: number) => Promise<void>;
}

export const createColumnActions = (
  set: (state: Partial<StoreState>) => void,
  get: () => StoreState
): ColumnActions => ({
  addColumn: async (columnData: Partial<Column>) => {
    const { currentProjectId } = useProjectStore.getState();
    if (!currentProjectId) {
      toast({
        title: 'No project selected',
        description: 'Please select a project before adding a column.',
        variant: 'destructive',
      });
      throw new Error('No project selected');
    }

    const { columns } = get();
    
    try {
      const newColumnData = {
        ...columnData,
        project_id: currentProjectId,
        order: columns.length
      };
      
      const result = await createColumn(newColumnData);
      
      if (result && result.length > 0) {
        set({ columns: [...columns, result[0]] });
        return result[0].id;
      }
      
      throw new Error('Failed to create column');
    } catch (error) {
      toast({
        title: 'Failed to create column',
        description: 'An error occurred while creating the column.',
        variant: 'destructive',
      });
      throw error;
    }
  },

  updateColumnTitle: async (columnId: string, title: string) => {
    const { columns } = get();
    const column = columns.find(c => c.id === columnId);
    
    if (!column) {
      toast({
        title: 'Column not found',
        description: 'The column you are trying to update does not exist.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await updateColumn({ id: columnId, title });
      
      set({
        columns: columns.map(c => 
          c.id === columnId ? { ...c, title } : c
        )
      });
    } catch (error) {
      toast({
        title: 'Failed to update column',
        description: 'An error occurred while updating the column.',
        variant: 'destructive',
      });
    }
  },

  reorderColumns: async (activeIndex: number, overIndex: number) => {
    const { columns: oldColumns } = get();
    
    const newColumns = [...oldColumns];
    const [movedColumn] = newColumns.splice(activeIndex, 1);
    newColumns.splice(overIndex, 0, movedColumn);
    
    set({ columns: newColumns });
    
    try {
      const updatePromises = newColumns.map((column, index) => 
        updateColumn({ id: column.id, order: index })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      set({ columns: oldColumns });
      
      toast({
        title: 'Failed to reorder columns',
        description: 'An error occurred while updating column order.',
        variant: 'destructive',
      });
    }
  },
});
