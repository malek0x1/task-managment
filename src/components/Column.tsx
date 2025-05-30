import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import ColumnHeader from "./ColumnHeader";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { Task, Subtask } from "@/types/kanban";
import { Column as ColumnType } from "@/types/kanban";
import { ClipboardList } from "lucide-react";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onUpdateColumnTitle: (id: string, title: string) => void;
  onAddTask: (columnId: string, title: string) => void;
  onOpenTaskDrawer: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => Promise<void>;
  onUpdateSubtask: (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => void;
  isDraggingAny?: boolean;
  isDropTarget?: boolean;
}

const Column: React.FC<ColumnProps> = React.memo(
  ({
    column,
    tasks,
    onUpdateColumnTitle,
    onAddTask,
    onOpenTaskDrawer,
    onToggleSubtask,
    onAddSubtask,
    onDeleteTask,
    onDeleteSubtask,
    onUpdateSubtask,
    isDraggingAny = false,
    isDropTarget = false,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: column.id,
      disabled: isDraggingAny,
    });

    const style = useMemo(() => {
      if (!transform) return undefined;
      return {
        transform: CSS.Transform.toString(transform),
        transition,
      };
    }, [transform, transition]);

    const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          "w-[300px] max-w-[320px] flex-shrink-0 rounded-xl bg-kanban-column p-4 flex flex-col h-full",
          "snap-start scroll-ml-4",
          isDragging ? "opacity-70 shadow-lg z-10" : "shadow-sm",
          isDropTarget
            ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background/5"
            : "",
          "border border-gray-100/60 backdrop-blur-sm transition-all duration-200"
        )}
      >
        <div
          {...listeners}
          className={cn(
            "cursor-grab active:cursor-grabbing",
            "sticky top-0 z-10 bg-kanban-column pt-1 pb-1"
          )}
        >
          <ColumnHeader
            column={column}
            onUpdateTitle={onUpdateColumnTitle}
            taskCount={tasks.length}
            isDragging={isDragging}
          />
        </div>

        <div className="sticky top-14 z-10 pt-2 pb-1 bg-kanban-column/95 backdrop-blur-sm border-b border-gray-100/60 mb-3">
          <AddTaskForm
            columnId={column.id}
            onAddTask={onAddTask}
            data-column-id={column.id}
          />
        </div>

        {tasks.length > 0 ? (
          <div className="flex-1 overflow-auto task-container pr-0.5 space-y-3 will-change-transform">
            <SortableContext
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onOpenTaskDrawer={onOpenTaskDrawer}
                  onToggleSubtask={onToggleSubtask}
                  onAddSubtask={onAddSubtask}
                  onDeleteTask={onDeleteTask}
                  onDeleteSubtask={onDeleteSubtask}
                  onUpdateSubtask={onUpdateSubtask}
                  isDraggingAny={isDraggingAny}
                  animationDelay={index}
                />
              ))}
            </SortableContext>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center task-container animate-fade-in">
            <div className="bg-gray-50 rounded-full p-3 mb-3 hover:scale-105 transition-transform hover:bg-gray-100">
              <ClipboardList className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">
              No tasks yet
            </p>
            <p className="text-gray-400 text-xs text-center max-w-[200px]">
              Add a task to this column using the form above
            </p>
          </div>
        )}
      </div>
    );
  }
);

Column.displayName = "Column";

export default Column;
