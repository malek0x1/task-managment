
export const pulseAnimation = `
  @keyframes pulse-node {
    0% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    }
  }
`;

export const graphStyles = `
  .animate-pulse-node {
    animation: pulse-node 1.5s infinite;
  }
  
  @keyframes react-flow__edge-stroke-animation {
    from {
      stroke-dashoffset: 24;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes pulse-node {
    0% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    }
  }
  
  
  .react-flow__node {
    pointer-events: all !important;
    cursor: grab;
    z-index: 5;
    will-change: transform;
    transform: translate3d(0, 0, 0); 
    contain: layout style paint; 
  }
  
  
  .react-flow__node * {
    pointer-events: auto !important;
  }
  
  .clickable {
    pointer-events: auto !important;
    cursor: pointer;
    position: relative;
    z-index: 20;
  }
  
  .pointer-events-auto {
    pointer-events: auto !important;
  }
  
  .react-flow__node.dragging {
    cursor: grabbing;
    z-index: 10;
  }
  
  
  .react-flow__node button, 
  .react-flow__node input, 
  .react-flow__node a,
  .react-flow__node label,
  .react-flow__node [role="button"],
  .react-flow__node .clickable,
  .react-flow__node input[type="checkbox"],
  .react-flow__node input[type="radio"] {
    pointer-events: all !important;
    cursor: pointer;
    position: relative;
    z-index: 20;
  }

  
  .react-flow__node .checkbox, 
  .react-flow__node input[type="checkbox"],
  .react-flow__node input[type="radio"],
  .react-flow__node .subtask-checkbox {
    pointer-events: auto !important;
    cursor: pointer !important;
    z-index: 30 !important; 
    opacity: 1; 
    position: relative;
  }
  
  
  .react-flow__edge {
    pointer-events: visibleStroke !important;
    cursor: pointer;
    z-index: 3;
  }
  
  .react-flow__edge path {
    pointer-events: all !important;
    stroke-width: 4px;
  }
  
  .react-flow__edge.selected path,
  .react-flow__edge:hover path {
    stroke-width: 5px !important;
  }
  
  
  .react-flow__handle {
    pointer-events: all !important;
    z-index: 15;
    cursor: pointer;
  }
  
  
  .react-flow__node.selected {
    box-shadow: 0 0 0 2px #6366f1;
    z-index: 12;
  }
  
  
  .react-flow__node .card,
  .react-flow__node .card * {
    pointer-events: auto !important;
  }
  
  
  .tooltip-content {
    z-index: 9999;
  }

  
  .react-flow__renderer {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }

  .react-flow__pane {
    will-change: transform;
  }

  
  .react-flow__node [data-no-dnd="true"] {
    touch-action: auto !important;
    pointer-events: auto !important;
  }

  
  .react-flow__node .subtask-checkbox,
  .react-flow__node [type="checkbox"] {
    pointer-events: auto !important;
    z-index: 30;
  }

  
  .react-flow__node button.clickable {
    pointer-events: auto !important;
    z-index: 25;
    cursor: pointer !important;
  }
`;
