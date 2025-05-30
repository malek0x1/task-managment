
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DateTimeFieldsProps {
  dueDate: Date | null;
  timeEstimate: string;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeEstimateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTimeEstimateBlur: (e: React.FocusEvent) => void;
  onInputClick: (e: React.MouseEvent) => void;
}

const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  dueDate,
  timeEstimate,
  onDateChange,
  onTimeEstimateChange,
  onTimeEstimateBlur,
  onInputClick
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">
          <Calendar className="w-3 h-3 inline mr-1" />
          Due Date
        </label>
        <input
          type="date"
          value={dueDate ? format(dueDate, 'yyyy-MM-dd') : ''}
          onChange={onDateChange}
          onClick={onInputClick}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-500 mb-1 block">
          <Clock className="w-3 h-3 inline mr-1" />
          Estimate
        </label>
        <input
          type="text"
          placeholder="1h 30m"
          value={timeEstimate}
          onChange={onTimeEstimateChange}
          onBlur={onTimeEstimateBlur}
          onClick={onInputClick}
          className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default DateTimeFields;
