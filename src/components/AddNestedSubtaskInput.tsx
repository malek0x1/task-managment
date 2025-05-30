import React, { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddNestedSubtaskInputProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

const AddNestedSubtaskInput: React.FC<AddNestedSubtaskInputProps> = ({
  onAdd,
  onCancel,
  autoFocus = true,
}) => {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      toast({
        title: "Subtask added",
        description: `"${title.trim()}" has been added`,
        duration: 2000,
      });
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-1 my-1 pl-2 animate-fade-in"
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a subtask..."
        className="flex-1 text-sm border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50 transition-colors"
        aria-label="Save subtask"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="Cancel"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
};

export default AddNestedSubtaskInput;
