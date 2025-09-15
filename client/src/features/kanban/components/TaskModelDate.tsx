import clsx from "clsx";
import { Calendar } from "lucide-react";
import { memo, useState, type HTMLAttributes } from "react";

interface IUpdateDateValue {
  startDate: string;
  endDate: string;
}

interface TaskModelDateProps extends HTMLAttributes<HTMLDivElement> {
  startDate: string;
  endDate: string;
  updateDate: (date: Partial<IUpdateDateValue>) => void;
}

const TaskModelDate = ({
  startDate,
  endDate,
  updateDate,
  className,
}: TaskModelDateProps) => {
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-3">
        <Calendar size={14} />
        <div className="font-bold">Date</div>
      </div>
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="date-start" className="font-medium text-13">
            Start date:
          </label>
          <input
            name="date-start"
            id="date-start"
            type="datetime-local"
            className="px-3 py-1.5 border rounded w-full"
            value={start ? new Date(start).toISOString().slice(0, 16) : ""}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="date-end" className="font-medium text-13">
            End date:
          </label>
          <input
            name="date-end"
            id="date-end"
            type="datetime-local"
            className="px-3 py-1.5 border rounded w-full"
            value={end ? new Date(end).toISOString().slice(0, 16) : ""}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <button
          onClick={() => updateDate({ startDate: start, endDate: end })}
          className={clsx([
            `px-3 py-1.5 rounded bg-blue-500 text-white`,
            `disabled:cursor-not-allowed disabled:opacity-50`,
          ])}
          disabled={start === startDate && end === endDate}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default memo(TaskModelDate);
