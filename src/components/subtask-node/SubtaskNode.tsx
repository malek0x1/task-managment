import React from "react";
import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import CompletionButton from "./CompletionButton";
import { useSubtaskNode } from "./useSubtaskNode";
import SubtaskContent from "./SubtaskContent";
import SubtaskDetailWrapper from "./SubtaskDetailWrapper";
import SubtaskActionButtons from "./SubtaskActionButtons";
import { ChevronRight, ChevronDown } from "lucide-react";

const SubtaskNode: React.FC<{ id: string; data: any }> = ({ id, data }) => {
  const {
    isExpanded,
    isContentExpanded,
    toggleContentExpanded,
    handleToggleComplete,
    handleLabelChange,
    handleAddSubtask,
    handleCollapseToggle,
    handleDeleteSubtask,
    isEditing,
    setIsEditing,
    handleAssigneeChange,
    handleDescriptionChange,
    handleDueDateChange,
    handleTimeEstimateChange,
    handlePriorityChange,
    isDetailPanelOpen,
    setIsDetailPanelOpen,
    subtaskData,
  } = useSubtaskNode({ id, data });

  const {
    label,
    completed,
    hasChildren,
    isCollapsed,
    onToggleCollapse,
    priority,
    level = 0,
    subtask,
    taskId,
    parentSubtaskId,
    onToggleComplete,
    onAddSubtask,
    collaborators = [],
    isHighlighted = false,
  } = data;

  const levelStyle = {
    marginLeft: `${Math.min(level * 10, 30)}px`,
    zIndex: 10 - level,
  };

  const isCollapsible = hasChildren;

  const expandButtonClass = cn(
    "flex items-center justify-center w-5 h-5 transition-all",
    isExpanded ? "text-gray-800" : "text-gray-500"
  );

  const handleCollapseClick = () => {
    if (isCollapsible && subtask.id) {
      onToggleCollapse(subtask.id);
    }
  };

  const handleAddChildClick = React.useCallback(() => {
    if (onAddSubtask) {
      onAddSubtask();
    }
  }, [onAddSubtask]);

  return (
    <div
      className={cn(
        "subtask-node border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow transition-all",
        completed && "border-l-4 border-l-green-500",
        isHighlighted && "ring-2 ring-blue-400",
        isContentExpanded && "expanded-content"
      )}
      style={{ width: 220, ...levelStyle }}
      data-testid={`subtask-node-${id}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2"
        style={{ top: -3, borderRadius: 0 }}
      />

      {hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 border-2"
          style={{ bottom: -3, borderRadius: 0 }}
        />
      )}

      <div className="p-3 flex flex-col">
        <div className="flex items-start gap-2">
          <CompletionButton
            completed={completed}
            taskId={taskId}
            subtaskId={subtask?.id || ""}
            onToggle={onToggleComplete}
          />

          <div className="flex-grow">
            <div className="flex items-center gap-1">
              {isCollapsible && (
                <button
                  onClick={handleCollapseClick}
                  className={expandButtonClass}
                  aria-label={isCollapsed ? "Expand" : "Collapse"}
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}

              <div className="flex-grow">
                <SubtaskContent
                  subtask={subtask}
                  taskId={taskId}
                  completed={completed}
                  hasChildren={hasChildren}
                  isHovered={isHighlighted}
                  isEditingTitle={isEditing}
                  titleValue={label}
                  handleTitleChange={handleLabelChange}
                  handleTitleBlur={() => {}}
                  handleKeyDown={() => {}}
                  handleToggle={onToggleComplete}
                  handleToggleDetailPanel={() =>
                    setIsDetailPanelOpen(!isDetailPanelOpen)
                  }
                  setShowAddInput={() => {}}
                  handleDelete={handleDeleteSubtask}
                  setIsEditingTitle={setIsEditing}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2 gap-2">
          <SubtaskActionButtons
            onToggleDetailPanel={() => setIsDetailPanelOpen(!isDetailPanelOpen)}
            onShowAddInput={handleAddChildClick}
            onDelete={handleDeleteSubtask}
          />
        </div>

        <SubtaskDetailWrapper
          subtask={subtaskData}
          taskId={taskId}
          showDetailPanel={isDetailPanelOpen}
          isClosingPanel={false}
          handleSubtaskUpdate={(updates) => {
            if (updates.assignee) handleAssigneeChange(updates.assignee.id);
            if (updates.description)
              handleDescriptionChange(updates.description);
            if (updates.due_date) handleDueDateChange(updates.due_date);
            if (updates.time_estimate)
              handleTimeEstimateChange(String(updates.time_estimate));
            if (updates.priority) handlePriorityChange(updates.priority);
          }}
          handleCloseDetailPanel={() => setIsDetailPanelOpen(false)}
          handleDetailPanelClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default React.memo(SubtaskNode);
