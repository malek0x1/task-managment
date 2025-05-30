
import { useState, useCallback, useRef } from 'react';
import { Edge } from 'reactflow';
import { EdgeMouseHandler } from '../types/nodeTypes';
import { throttle } from 'lodash';
import useDependencyGraphStore from '@/store/useDependencyGraphStore';
import useKanbanStore from '@/store/useKanbanStore';
import { toast } from '@/hooks/use-toast';
import { Subtask } from '@/types/kanban';

export const useNodeInteractions = () => {
  const { 
    toggleNodeCollapse, 
    isNodeCollapsed, 
    collapsedNodes,
    setSubtaskCompletion,
    isSubtaskCompleted,
    extractTaskId
  } = useDependencyGraphStore();
  
  const { addSubtask, addNestedSubtask } = useKanbanStore();
  
  const [recentlyAddedNodes, setRecentlyAddedNodes] = useState<Set<string>>(new Set());
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
  
  const throttledFuncs = useRef({
    setHoveredEdge: throttle((edgeId: string | null) => {
      setHoveredEdge(edgeId);
    }, 50),
    setHighlightedNodes: throttle((nodes: Set<string>) => {
      setHighlightedNodes(nodes);
    }, 50)
  });
  
  const markNodeAsRecentlyAdded = useCallback((nodeId: string) => {
    setRecentlyAddedNodes(prev => {
      const newSet = new Set(prev);
      newSet.add(nodeId);
      
      setTimeout(() => {
        setRecentlyAddedNodes(current => {
          const updatedSet = new Set(current);
          updatedSet.delete(nodeId);
          return updatedSet;
        });
      }, 3000);
      
      return newSet;
    });
  }, []);
  
  const clearRecentlyAddedNodes = useCallback(() => {
    setRecentlyAddedNodes(new Set());
  }, []);
  
  const onEdgeMouseEnter: EdgeMouseHandler = useCallback((event, edge) => {
    if (edge) {
      throttledFuncs.current.setHoveredEdge(edge.id);
      
      const nodesToHighlight = new Set<string>();
      if (edge.source) nodesToHighlight.add(edge.source);
      if (edge.target) nodesToHighlight.add(edge.target);
      
      throttledFuncs.current.setHighlightedNodes(nodesToHighlight);
    }
  }, []);
  
  const onEdgeMouseLeave: EdgeMouseHandler = useCallback(() => {
    throttledFuncs.current.setHoveredEdge(null);
    throttledFuncs.current.setHighlightedNodes(new Set());
  }, []);
  
  const handleAddSubtask = useCallback((taskId: string, parentSubtaskId?: string | null) => {
    if (!taskId) {
      console.error("Cannot add subtask: Missing task ID");
      toast({
        title: "Error adding subtask",
        description: "Task ID is missing",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const cleanTaskId = taskId.startsWith('task-') 
        ? taskId.substring(5)
        : taskId;

      const cleanParentSubtaskId = parentSubtaskId && parentSubtaskId.startsWith('subtask-')
        ? parentSubtaskId.substring(8)
        : parentSubtaskId;
      
      if (cleanParentSubtaskId) {
        const title = "New nested subtask";
        
        try {
          const subtaskPromise = addNestedSubtask(cleanTaskId, cleanParentSubtaskId, title);
          
          if (subtaskPromise && typeof subtaskPromise === 'object' && 'then' in subtaskPromise) {
            subtaskPromise.then((result: any) => {
              if (result && typeof result === 'object' && 'id' in result) {
                markNodeAsRecentlyAdded(`subtask-${result.id}`);
                
                toast({
                  title: "Nested subtask added",
                  description: `New nested subtask created successfully`,
                  duration: 2000,
                });
              }
            })
            .catch(error => {
              console.error('Error adding nested subtask:', error);
              toast({
                title: "Error adding nested subtask",
                description: error.message || "Could not add nested subtask",
                variant: "destructive",
                duration: 3000,
              });
            });
          } else {
            toast({
              title: "Nested subtask operation",
              description: "Operation completed",
              duration: 2000,
            });
          }
        } catch (error) {
          console.error('Error in nested subtask creation:', error);
          toast({
            title: "Error creating nested subtask",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      } else {
        const title = "New subtask";
        
        try {
          const subtaskPromise = addSubtask(cleanTaskId, title);
          
          if (subtaskPromise && typeof subtaskPromise === 'object' && 'then' in subtaskPromise) {
            subtaskPromise.then((result: any) => {
              if (result && typeof result === 'object' && 'id' in result) {
                markNodeAsRecentlyAdded(`subtask-${result.id}`);
                
                toast({
                  title: "Subtask added",
                  description: `New subtask created successfully`,
                  duration: 2000,
                });
              }
            })
            .catch(error => {
              console.error('Error adding subtask:', error);
              toast({
                title: "Error adding subtask",
                description: error.message || "Could not add subtask",
                variant: "destructive",
                duration: 3000,
              });
            });
          } else {
            toast({
              title: "Subtask operation",
              description: "Operation completed", 
              duration: 2000,
            });
          }
        } catch (error) {
          console.error('Error in subtask creation:', error);
          toast({
            title: "Error creating subtask",
            description: "An unexpected error occurred",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error in handleAddSubtask:', error);
      toast({
        title: "Error adding subtask",
        description: "Unexpected error occurred",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [addSubtask, addNestedSubtask, markNodeAsRecentlyAdded]);
  
  const handleToggleSubtaskComplete = useCallback((subtaskId: string, completed: boolean, taskId?: string) => {
    setSubtaskCompletion(subtaskId, completed, taskId);
  }, [setSubtaskCompletion]);

  return {
    recentlyAddedNodes,
    hoveredEdge,
    highlightedNodes,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
    collapsedNodes,
    toggleNodeCollapse,
    isNodeCollapsed,
    handleToggleSubtaskComplete,
    handleAddSubtask,
    markNodeAsRecentlyAdded,
    clearRecentlyAddedNodes,
    isSubtaskCompleted
  };
};

export default useNodeInteractions;
