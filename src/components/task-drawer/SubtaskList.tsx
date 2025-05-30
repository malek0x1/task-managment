import React, { useState, useEffect } from "react";
import { buildSubtaskTree } from "@/utils/subtaskTree";
import { Task, Subtask } from "@/types/kanban";
import AiSuggestionPreview from "@/components/ai/AiSuggestionPreview";
import SubtaskItem from "@/components/subtask-item";
import AddNestedSubtaskInput from "@/components/AddNestedSubtaskInput";
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { useSubtaskActions } from "@/hooks/useSubtaskActions";

interface SubtaskListProps {
  task: Task;
  aiSuggestion: any;
  aiSuggestionType: string | null;
  aiSuggestionLoading: boolean;
  handleAcceptAiSuggestion: () => void;
  handleRejectAiSuggestion: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddNestedSubtask: (
    taskId: string,
    parentSubtaskId: string | null,
    title: string
  ) => void;
  handleUpdateSubtask: (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => void;
  handleDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

const SubtaskList: React.FC<SubtaskListProps> = ({
  task,
  aiSuggestion,
  aiSuggestionType,
  aiSuggestionLoading,
  handleAcceptAiSuggestion,
  handleRejectAiSuggestion,
  onToggleSubtask,
  onAddNestedSubtask,
  handleUpdateSubtask,
  handleDeleteSubtask,
}) => {
  const { deleteSubtask: storeDeleteSubtask } = useSubtaskActions();

  const [processingSubtasks, setProcessingSubtasks] = useState<
    Record<string, boolean>
  >({});
  const [deletedSubtasks, setDeletedSubtasks] = useState<
    Record<string, boolean>
  >({});
  const [debugMode, setDebugMode] = useState(false);
  const [showNestedInputs, setShowNestedInputs] = useState<
    Record<string, boolean>
  >({});

  const subtaskTree = buildSubtaskTree(task.subtasks || []);

  const [expandedSubtasks, setExpandedSubtasks] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};

    const setupExpandedState = (subtasks: any[]) => {
      subtasks.forEach((subtask) => {
        initialExpandedState[subtask.id] = true;
        if (subtask.children && subtask.children.length > 0) {
          setupExpandedState(subtask.children);
        }
      });
    };

    setupExpandedState(subtaskTree);
    setExpandedSubtasks(initialExpandedState);
  }, [task.subtasks]);

  const toggleExpanded = (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubtasks((prev) => ({
      ...prev,
      [subtaskId]: !prev[subtaskId],
    }));
  };

  const showNestedInput = (subtaskId: string) => {
    setShowNestedInputs((prev) => ({
      ...prev,
      [subtaskId]: true,
    }));
  };

  const hideNestedInput = (subtaskId: string) => {
    setShowNestedInputs((prev) => ({
      ...prev,
      [subtaskId]: false,
    }));
  };

  const handleAddNestedSubtask = (parentSubtaskId: string, title: string) => {
    onAddNestedSubtask(task.id, parentSubtaskId, title);
    hideNestedInput(parentSubtaskId);
  };

  const handleDeleteWithOptimisticUI = (taskId: string, subtaskId: string) => {
    setProcessingSubtasks((prev) => ({
      ...prev,
      [subtaskId]: true,
    }));

    setDeletedSubtasks((prev) => ({
      ...prev,
      [subtaskId]: true,
    }));

    try {
      handleDeleteSubtask(taskId, subtaskId);
    } catch (error) {
      setDeletedSubtasks((prev) => {
        const updated = { ...prev };
        delete updated[subtaskId];
        return updated;
      });
    } finally {
      setTimeout(() => {
        setProcessingSubtasks((prev) => {
          const updated = { ...prev };
          delete updated[subtaskId];
          return updated;
        });
      }, 500);
    }
  };

  const testDirectDelete = async (taskId: string, subtaskId: string) => {
    try {
      await storeDeleteSubtask(taskId, subtaskId);

      setDeletedSubtasks((prev) => ({
        ...prev,
        [subtaskId]: true,
      }));

      return true;
    } catch (error) {
      return false;
    }
  };

  const renderSubtasks = (subtasks: any[], level = 0) => {
    return subtasks
      .map((subtask) => {
        const hasChildren = subtask.children && subtask.children.length > 0;
        const isExpanded = expandedSubtasks[subtask.id] !== false;
        const isProcessing = processingSubtasks[subtask.id] || false;
        const isDeleted = deletedSubtasks[subtask.id] || false;
        const showInput = showNestedInputs[subtask.id] || false;

        if (isDeleted) {
          return null;
        }

        return (
          <div key={subtask.id} className="mb-2">
            <div className="flex items-start">
              {hasChildren && (
                <button
                  onClick={(e) => toggleExpanded(subtask.id, e)}
                  className="mr-1 mt-2 p-0.5 rounded hover:bg-gray-100 focus:outline-none"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              )}

              <div className={`flex-1 ${isProcessing ? "opacity-50" : ""}`}>
                <SubtaskItem
                  subtask={subtask}
                  taskId={task.id}
                  onToggle={onToggleSubtask}
                  onUpdateSubtask={handleUpdateSubtask}
                  onAddNestedSubtask={() => showNestedInput(subtask.id)}
                  onDeleteSubtask={handleDeleteWithOptimisticUI}
                  onOpenDeepSubtasks={(e) =>
                    hasChildren && toggleExpanded(subtask.id, e)
                  }
                />

                {showInput && (
                  <div className="pl-6 mt-2">
                    <AddNestedSubtaskInput
                      onAdd={(title) =>
                        handleAddNestedSubtask(subtask.id, title)
                      }
                      onCancel={() => hideNestedInput(subtask.id)}
                    />
                  </div>
                )}

                {hasChildren && isExpanded && (
                  <div className="pl-6 mt-2 border-l border-gray-100">
                    {renderSubtasks(subtask.children, level + 1)}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="animate-fade-in space-y-4">
      {aiSuggestion && aiSuggestionType === "subtasks" && (
        <AiSuggestionPreview
          title="Generated Subtasks"
          suggestion={aiSuggestion}
          onAccept={handleAcceptAiSuggestion}
          onReject={handleRejectAiSuggestion}
          isLoading={aiSuggestionLoading}
          className="mb-4"
        />
      )}

      <div className="subtask-tree">
        {subtaskTree.length > 0 ? (
          renderSubtasks(subtaskTree)
        ) : (
          <div className="text-sm text-gray-500 py-2">
            No subtasks yet. Add some using the button above.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtaskList;
