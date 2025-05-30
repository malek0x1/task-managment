import React, { useMemo } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Column from "../Column";
import TaskCard from "../TaskCard";
import ColumnHeader from "../ColumnHeader";
import AddColumnCard from "../AddColumnCard";
import useKanbanStore from "@/store/useKanbanStore";
import { useBoardDragAndDrop } from "@/hooks/useBoardDragAndDrop";
import { useBoardActions } from "@/hooks/useBoardActions";
import { useSubtaskActions } from "@/hooks/useSubtaskActions";

const BoardContent: React.FC = () => {
  const { columns, tasks, activeTask } = useKanbanStore();

  const {
    activeId,
    activeType,
    isDragging,
    dropTargetId,
    dropPosition,
    sensors,
    columnIds,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragAndDrop();

  const {
    updateColumnTitle,
    handleAddTask,
    handleOpenTaskDrawer,
    handleToggleSubtask,
    handleAddColumn,
    addNestedSubtask,
    handleDeleteTask,
    handleDeleteSubtask,
  } = useBoardActions();

  const { updateSubtask: handleUpdateSubtask } = useSubtaskActions();

  const activeColumn = useMemo(
    () =>
      activeType === "column"
        ? columns.find((col) => col.id === activeId)
        : null,
    [activeType, columns, activeId]
  );

  const activeDragTask = useMemo(
    () =>
      activeType === "task" ? tasks.find((task) => task.id === activeId) : null,
    [activeType, tasks, activeId]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
      collisionDetection={closestCenter}
    >
      <div className="flex gap-6 h-full pb-8 overflow-x-auto overflow-y-hidden snap-x snap-mandatory">
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => {
            const columnTasks = tasks
              .filter((task) => task.column_id === column.id)
              .sort((a, b) => a.order - b.order);

            const showBeforePlaceholder =
              activeType === "column" &&
              dropTargetId === column.id &&
              dropPosition === "before" &&
              activeId !== column.id;

            const showAfterPlaceholder =
              activeType === "column" &&
              dropTargetId === column.id &&
              dropPosition === "after" &&
              activeId !== column.id;

            return (
              <React.Fragment key={column.id}>
                {showBeforePlaceholder && (
                  <div className="w-[8px] h-full flex-shrink-0 bg-primary/50 rounded-md animate-pulse" />
                )}

                <Column
                  column={column}
                  tasks={columnTasks}
                  onUpdateColumnTitle={updateColumnTitle}
                  onAddTask={handleAddTask}
                  onOpenTaskDrawer={handleOpenTaskDrawer}
                  onToggleSubtask={handleToggleSubtask}
                  onAddSubtask={(taskId, subtaskTitle) =>
                    addNestedSubtask(taskId, null, subtaskTitle)
                  }
                  onDeleteTask={handleDeleteTask}
                  onDeleteSubtask={handleDeleteSubtask}
                  onUpdateSubtask={handleUpdateSubtask}
                  isDraggingAny={isDragging}
                  isDropTarget={dropTargetId === column.id}
                />

                {showAfterPlaceholder && (
                  <div className="w-[8px] h-full flex-shrink-0 bg-primary/50 rounded-md animate-pulse" />
                )}
              </React.Fragment>
            );
          })}
        </SortableContext>

        <AddColumnCard onAddColumn={handleAddColumn} />
      </div>

      <DragOverlay>
        {activeColumn ? (
          <div className="w-[300px] rounded-xl bg-kanban-column p-4 opacity-70 shadow-md">
            <ColumnHeader
              column={activeColumn}
              onUpdateTitle={() => {}}
              taskCount={
                tasks.filter((t) => t.column_id === activeColumn.id).length
              }
              isDragging={true}
            />
          </div>
        ) : null}

        {activeDragTask ? (
          <TaskCard
            task={activeDragTask}
            onOpenTaskDrawer={() => {}}
            onToggleSubtask={() => {}}
            onAddSubtask={() => {}}
            onDeleteTask={() => {}}
            onUpdateSubtask={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardContent;
