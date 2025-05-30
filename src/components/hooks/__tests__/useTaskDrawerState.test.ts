
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTaskDrawerState } from '../useTaskDrawerState';
import { toast } from '@/hooks/use-toast';


vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

vi.mock('@/utils/aiAssistant', () => ({
  generateTaskTitle: vi.fn().mockResolvedValue('Generated Title'),
  summarizeTaskDescription: vi.fn().mockResolvedValue('Summarized Description'),
  suggestTaskMetadata: vi.fn().mockResolvedValue({
    priority: 'high',
    dueDate: '2023-12-31',
    tags: ['important', 'urgent']
  }),
  generateSubtasks: vi.fn().mockResolvedValue(['Subtask 1', 'Subtask 2', 'Subtask 3'])
}));

describe('useTaskDrawerState', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'This is a test task description',
    column_id: 'column-1',
    project_id: 'project-1',
    order: 0,
    priority: 'medium' as const,
    subtasks: []
  };
  
  const mockUpdateTask = vi.fn();
  const mockToggleSubtask = vi.fn();
  const mockAddNestedSubtask = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should initialize with task values', () => {
    const { result } = renderHook(() => 
      useTaskDrawerState(mockTask, true, mockUpdateTask)
    );
    
    expect(result.current.titleValue).toBe('Test Task');
    expect(result.current.descriptionValue).toBe('This is a test task description');
    expect(result.current.activeTab).toBe('details');
  });
  
  it('should handle title changes correctly', () => {
    const { result } = renderHook(() => 
      useTaskDrawerState(mockTask, true, mockUpdateTask)
    );
    
    act(() => {
      result.current.setEditingTitle(true);
    });
    
    expect(result.current.editingTitle).toBe(true);
    

    act(() => {
      result.current.handleTitleSave();
    });
    
    expect(mockUpdateTask).toHaveBeenCalledWith(mockTask.id, { title: 'Test Task' });
  });
  
  it('should handle priority change', () => {
    const { result } = renderHook(() => 
      useTaskDrawerState(mockTask, true, mockUpdateTask)
    );
    
    act(() => {
      result.current.handlePriorityChange('high');
    });
    
    expect(mockUpdateTask).toHaveBeenCalledWith(mockTask.id, { priority: 'high' });
  });
});
