/**
 * Handles node interaction events while preventing conflicts with interactive elements
 * Includes throttling for performance and smart event delegation
 */

import { useCallback } from 'react';
import { NodeMouseHandler, NodeDragHandler } from 'reactflow';
import { throttle } from 'lodash';

// Prevents drag/click interference with form controls and interactive UI elements
const isInteractiveElement = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  
  if (
    element.tagName === 'INPUT' || 
    element.tagName === 'BUTTON' || 
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA' ||
    element.tagName === 'A' ||
    element.tagName === 'LABEL'
  ) {
    return true;
  }
  
  if (
    element.getAttribute('role') === 'button' ||
    element.getAttribute('role') === 'checkbox' ||
    element.getAttribute('role') === 'switch'
  ) {
    return true;
  }
  
  if (element.getAttribute('data-no-dnd') === 'true') {
    return true;
  }
  
  return false;
};

// TODO: fix any
export const useNodeEventHandlers = (
  onNodesChange: (changes: any) => void,
  onEdgesChange: (changes: any) => void
) => {
  // Throttle updates to 60fps for smooth interactions without excessive re-renders
  const throttledNodesChange = useCallback(
    throttle((changes) => {
      onNodesChange(changes);
    }, 16), 
    [onNodesChange]
  );

  const throttledEdgesChange = useCallback(
    throttle((changes) => {
      onEdgesChange(changes);
    }, 16), 
    [onEdgesChange]
  );

  const onNodeClick: NodeMouseHandler = useCallback((e, node) => {
    const target = e.target as HTMLElement;
    
    if (isInteractiveElement(target)) {
      e.stopPropagation();
      return;
    }
  }, []);
  
  const onNodeDragStart: NodeDragHandler = useCallback((e, node) => {
    const target = e.target as HTMLElement;
    
    if (isInteractiveElement(target)) {
      e.stopPropagation();
      return;
    }
  }, []);
  
  const onNodeDragStop: NodeDragHandler = useCallback((e, node) => {

  }, []);

  const onNodeDrag: NodeDragHandler = useCallback(() => {

  }, []);

  const onPaneClick = useCallback(() => {

  }, []);

  return {
    throttledNodesChange,
    throttledEdgesChange,
    onNodeClick,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragStop,
    onPaneClick
  };
};

export default useNodeEventHandlers;
