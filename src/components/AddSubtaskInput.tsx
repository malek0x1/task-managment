import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddSubtaskInputProps {
  taskId: string;
  onAddSubtask: (taskId: string, subtaskTitle: string) => void;
  onCancel: () => void;
  showInputDirectly?: boolean;
}

const AddSubtaskInput: React.FC<AddSubtaskInputProps> = ({
  taskId,
  onAddSubtask,
  onCancel,
  showInputDirectly = false,
}) => {
  const [isAdding, setIsAdding] = useState(showInputDirectly);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleStartAdding = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(false);
    setTitle("");
    onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (title.trim()) {
      onAddSubtask(taskId, title.trim());
      setTitle("");
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel(e as unknown as React.MouseEvent);
    }
  };

  if (!isAdding) {
    return (
      <button
        className="flex items-center text-xs text-gray-600 hover:text-gray-900 py-1 group"
        onClick={handleStartAdding}
      >
        <Plus className="w-3.5 h-3.5 mr-1 group-hover:text-green-500 transition-colors" />
        <span>Add Subtask</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="mt-1"
    >
      <Input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter subtask title..."
        className="text-xs h-8 mb-1"
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
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          size="sm"
          className="text-xs h-7"
          disabled={!title.trim()}
        >
          Add
        </Button>
      </div>
    </form>
  );
};

export default AddSubtaskInput;
