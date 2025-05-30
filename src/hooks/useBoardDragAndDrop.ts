
import { useCallback, useState, useRef } from 'react';
import { 
  DragStartEvent, 
  DragOverEvent, 
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import { Column } from '@/types/kanban';
import useKanbanStore from '@/store/useKanbanStore';
import { toast } from '@/hooks/use-toast';

export const useBoardDragAndDrop = () => {
  const { columns, tasks, reorderColumns, moveTask } = useKanbanStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'column' | 'task' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);
  
  const lastDragOverRef = useRef<{
    taskId: string;
    sourceColId: string;
    destColId: string;
    timestamp: number;
  } | null>(null);
  
  const taskMoveTracker = useRef(new Map<string, Set<string>>());
  const columnIds = columns.map(column => column.id);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setIsDragging(true);
    
    if (columnIds.includes(active.id as string)) {
      setActiveType('column');
    } else {
      setActiveType('task');
    }
  }, [columnIds]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDropTargetId(null);
      setDropPosition(null);
      return;
    }
    
    setDropTargetId(over.id as string);
    
    if (activeType === 'column' && columnIds.includes(over.id as string)) {
      const activeColumnId = active.id as string;
      const overColumnId = over.id as string;
      
      const activeIndex = columns.findIndex(col => col.id === activeColumnId);
      const overIndex = columns.findIndex(col => col.id === overColumnId);
      
      if (activeIndex !== overIndex) {
        const overRect = over.rect as DOMRect;
        
        if (overRect) {
          const mouseX = event.activatorEvent instanceof MouseEvent
            ? event.activatorEvent.clientX
            : (event.activatorEvent as TouchEvent).touches[0].clientX;
          
          const midPoint = overRect.left + (overRect.width / 2);
          setDropPosition(mouseX < midPoint ? 'before' : 'after');
        }
      } else {
        setDropPosition(null);
      }
    }
    
    if (activeType !== 'task' || columnIds.includes(active.id as string)) {
      return;
    }
    
    const activeTaskId = active.id as string;
    const activeTask = tasks.find(t => t.id === activeTaskId);
    
    if (!activeTask) return;
    
    const overId = over.id as string;
    let overColumnId: string | null = null;
    let overIndex = -1;
    
    if (columnIds.includes(overId)) {
      overColumnId = overId;
      const tasksInDestColumn = tasks.filter(t => t.column_id === overColumnId);
      overIndex = tasksInDestColumn.length;
    } 
    else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        overColumnId = overTask.column_id;
        const tasksInDestColumn = tasks.filter(t => t.column_id === overColumnId);
        overIndex = tasksInDestColumn.findIndex(t => t.id === overId);
      }
    }
    
    if (overColumnId) {
      const sourceColumnId = activeTask.column_id;
      
      if (sourceColumnId === overColumnId && overIndex === -1) {
        return;
      }
      
      const taskMoves = taskMoveTracker.current.get(activeTaskId) || new Set();
      const moveKey = `${sourceColumnId}-${overColumnId}-${overIndex}`;
      
      if (taskMoves.has(moveKey)) {
        return;
      }
      
      taskMoves.add(moveKey);
      taskMoveTracker.current.set(activeTaskId, taskMoves);
      
      const now = Date.now();
      const lastOp = lastDragOverRef.current;
      
      if (lastOp && 
          lastOp.taskId === activeTaskId && 
          lastOp.sourceColId === sourceColumnId && 
          lastOp.destColId === overColumnId && 
          now - lastOp.timestamp < 300) {
        return;
      }
      
      lastDragOverRef.current = {
        taskId: activeTaskId,
        sourceColId: sourceColumnId,
        destColId: overColumnId,
        timestamp: now
      };
      
      moveTask(activeTaskId, overColumnId);
    }
  }, [activeType, columnIds, tasks, moveTask, columns]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setIsDragging(false);
    setDropTargetId(null);
    setDropPosition(null);
    lastDragOverRef.current = null;
    taskMoveTracker.current.clear();
    
    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }
    
    if (activeType === 'column') {
      const activeColumnId = active.id as string;
      const overColumnId = over.id as string;
      
      if (activeColumnId !== overColumnId) {
        const activeIndex = columns.findIndex(col => col.id === activeColumnId);
        const overIndex = columns.findIndex(col => col.id === overColumnId);
        
        reorderColumns(activeIndex, overIndex);
        
        toast({
          title: "Column moved",
          description: "The column order has been updated",
        });
      }
    }
    
    setActiveId(null);
    setActiveType(null);
  }, [columns, reorderColumns]);

  return {
    activeId,
    activeType,
    isDragging,
    dropTargetId,
    dropPosition,
    sensors,
    columnIds,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  };
};
