import React, { useState, useRef, useEffect } from "react";
import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AiMenuTrigger from "@/components/ai/AiMenuTrigger";

interface AddSubtaskFormProps {
  onAddNestedSubtask: (
    taskId: string,
    parentSubtaskId: string | null,
    title: string
  ) => void;
  taskId: string;
  handleGenerateSubtasks: () => Promise<void>;
}

const AddSubtaskForm: React.FC<AddSubtaskFormProps> = ({
  onAddNestedSubtask,
  taskId,
  handleGenerateSubtasks,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleStartAdding = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(false);
    setTitle("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (title.trim()) {
      onAddNestedSubtask(taskId, null, title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel(e as unknown as React.MouseEvent);
    }
  };

  if (isAdding) {
    return (
      <div className="flex gap-2">
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="flex-1"
        >
          <Input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter subtask title..."
            className="text-sm h-9 mb-2"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={handleCancel}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="text-xs h-7"
              disabled={!title.trim()}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Add
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-xs flex items-center"
        onClick={handleStartAdding}
      >
        <Plus className="w-3.5 h-3.5 mr-1" />
        Add Subtask
      </Button>

      <AiMenuTrigger
        options={[
          {
            label: "Generate Subtasks from Description",
            onClick: handleGenerateSubtasks,
          },
        ]}
        size="sm"
        variant="outline"
        showText
        compact
      />
    </div>
  );
};

export default AddSubtaskForm;
