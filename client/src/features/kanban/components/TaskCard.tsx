import { memo } from "react";
import { SquarePen } from "lucide-react";
import clsx from "clsx";
import type { ITask } from "../types/task.type";

interface TaskCardProps {
  task: ITask;
}

const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div className="group py-2 px-3 shadow rounded-lg bg-white border hover:border-blue-500 relative">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className={clsx([
            `group-hover:block`,
            task.complete ? `block` : `hidden`,
          ])}
          checked={task.complete}
        />
        <div>{task?.name}</div>
      </div>
      <button className="hidden group-hover:block absolute top-1 right-1 p-1 rounded-full hover:bg-gray-200">
        <SquarePen size={14} />
      </button>
    </div>
  );
};

export default memo(TaskCard);
