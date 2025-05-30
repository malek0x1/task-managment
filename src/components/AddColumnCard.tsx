import React, { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";

interface AddColumnCardProps {
  onAddColumn: (columnData: any) => Promise<void>;
}

const AddColumnCard: React.FC<AddColumnCardProps> = ({ onAddColumn }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddColumn = async () => {
    if (!columnTitle.trim()) {
      toast({
        title: "Column name required",
        description: "Please enter a name for the column",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newColumn = {
        id: uuidv4(),
        title: columnTitle.trim(),
        color: "#9b87f5",
      };

      await onAddColumn(newColumn);

      setColumnTitle("");
      setIsAdding(false);

      toast({
        title: "Column added",
        description: `"${columnTitle}" column has been created`,
      });
    } catch (error) {
      console.error("Error adding column:", error);
      toast({
        title: "Failed to add column",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setColumnTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddColumn();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isAdding) {
    return (
      <div
        className={cn(
          "w-[200px] flex-shrink-0 rounded-md bg-background p-2 flex flex-col h-[120px]",
          "snap-start scroll-ml-4 sticky right-6",
          "border border-primary/20 shadow-sm",
          "animate-fade-in"
        )}
      >
        <div className="text-sm font-medium mb-2">New column</div>

        <Input
          value={columnTitle}
          onChange={(e) => setColumnTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter column name..."
          className="text-sm mb-2"
          autoFocus
          autoComplete="off"
        />

        <div className="flex justify-between mt-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-7 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Cancel
          </Button>

          <Button
            type="submit"
            size="sm"
            onClick={handleAddColumn}
            disabled={!columnTitle.trim() || isSubmitting}
            className="h-7 px-2"
          >
            <Check className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-[120px] flex-shrink-0 rounded-md p-1 flex flex-col justify-center items-center h-[120px]",
        "snap-start scroll-ml-4 sticky right-6",
        "border border-dashed border-gray-200 hover:border-primary/40 hover:bg-gray-50/50",
        "cursor-pointer transition-all duration-200 group"
      )}
      onClick={() => setIsAdding(true)}
    >
      <div className="p-2 rounded-full bg-gray-100 group-hover:bg-primary/10 transition-all duration-300">
        <Plus className="h-4 w-4 text-gray-400 group-hover:text-primary" />
      </div>
      <span className="mt-2 text-xs text-gray-500 font-medium group-hover:text-primary transition-all duration-200">
        Add Column
      </span>
    </div>
  );
};

export default AddColumnCard;
