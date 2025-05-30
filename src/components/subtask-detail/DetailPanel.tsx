import React, { useState, useEffect } from "react";
import { Subtask, Assignee } from "@/types/kanban";
import { Button } from "@/components/ui/button";
import DescriptionEditor from "./DescriptionEditor";
import PrioritySelector from "./PrioritySelector";
import DateTimeFields from "./DateTimeFields";
import AssigneeSelector from "./AssigneeSelector";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface DetailPanelProps {
  subtask: Subtask;
  onUpdate: (updates: Partial<Subtask>) => void;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  subtask,
  onUpdate,
  onClose,
}) => {
  const [description, setDescription] = useState(subtask.description || "");
  const [dueDate, setDueDate] = useState<Date | null>(
    subtask.due_date ? new Date(subtask.due_date) : null
  );
  const [timeEstimate, setTimeEstimate] = useState<string>(
    subtask.time_estimate?.toString() || ""
  );
  const [isClosingPanel, setIsClosingPanel] = useState(false);

  const handleUpdate = (updates: Partial<Subtask>) => {
    try {
      const fullUpdatePayload: Partial<Subtask> = {
        ...subtask,
        ...updates,
        id: subtask.id,
        completed:
          "completed" in updates ? updates.completed : subtask.completed,
        title: updates.title || subtask.title,
        parentSubtaskId:
          "parentSubtaskId" in updates
            ? updates.parentSubtaskId
            : subtask.parentSubtaskId,
      };

      onUpdate(fullUpdatePayload);
    } catch (error) {
      console.error(
        `DetailPanel: Error updating subtask ${subtask.id}:`,
        error
      );
      toast({
        title: "Error",
        description: "Could not update subtask details",
        variant: "destructive",
      });
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.stopPropagation();
    setDescription(e.target.value);
  };

  const handleDescriptionBlur = (e: React.FocusEvent) => {
    e.stopPropagation();
    handleUpdate({ description: description.trim() });
  };

  const handlePriorityChange = (
    priority: Subtask["priority"],
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    handleUpdate({ priority });
  };

  const handleGenerateDescription = (e: React.MouseEvent) => {
    e.stopPropagation();

    const aiDescription = `${
      description.trim() ? description + "\n\n" : ""
    }This subtask should be completed with attention to detail and careful testing.`;
    setDescription(aiDescription);
    handleUpdate({ description: aiDescription });
  };

  const handleAutoAssign = (e: React.MouseEvent) => {
    e.stopPropagation();

    const aiAssignee: Assignee = {
      id: "ai-assigned-1",
      name: "Alex Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    };
    handleUpdate({ assignee: aiAssignee });
  };

  const handlePanelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsClosingPanel(true);

    if (description !== subtask.description) {
      handleUpdate({ description });
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const date = e.target.value ? new Date(e.target.value) : null;
    setDueDate(date);
    handleUpdate({ due_date: date?.toISOString() });
  };

  const handleTimeEstimateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setTimeEstimate(e.target.value);
  };

  const handleTimeEstimateBlur = (e: React.FocusEvent) => {
    e.stopPropagation();
    handleUpdate({ time_estimate: timeEstimate });
  };

  useEffect(() => {
    if (isClosingPanel) {
      const timer = setTimeout(() => {
        onClose();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosingPanel, onClose, subtask.id]);

  return (
    <div
      className={cn(
        "space-y-3 text-sm will-change-transform will-change-opacity",
        "transition-all duration-300 ease-in-out",
        isClosingPanel
          ? "opacity-0 transform scale-95"
          : "opacity-100 animate-fade-in transform scale-100"
      )}
      onClick={handlePanelClick}
    >
      <DescriptionEditor
        description={description}
        onDescriptionChange={handleDescriptionChange}
        onDescriptionBlur={handleDescriptionBlur}
        onGenerateDescription={handleGenerateDescription}
        onInputClick={handleInputClick}
      />

      <PrioritySelector
        selectedPriority={subtask.priority || "medium"}
        onPriorityChange={handlePriorityChange}
      />

      <DateTimeFields
        dueDate={dueDate}
        timeEstimate={timeEstimate}
        onDateChange={handleDateChange}
        onTimeEstimateChange={handleTimeEstimateChange}
        onTimeEstimateBlur={handleTimeEstimateBlur}
        onInputClick={handleInputClick}
      />

      <AssigneeSelector
        assignee={subtask.assignee}
        onAutoAssign={handleAutoAssign}
      />

      <div
        className="flex justify-end mt-3 space-x-2"
        onClick={handlePanelClick}
      >
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-4 transition-all hover:bg-primary/10 hover:text-primary"
          onClick={handleCloseClick}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default DetailPanel;
