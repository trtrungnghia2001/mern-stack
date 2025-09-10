import { memo } from "react";
import { SquarePen } from "lucide-react";
import clsx from "clsx";
import type { ITask } from "../types/task.type";
import { Link, useParams } from "react-router-dom";

interface TaskCardProps {
  task: ITask;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { boardId } = useParams();
  return (
    <div className="group px-3 shadow rounded-lg bg-white border hover:border-blue-500 relative">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className={clsx([
            `group-hover:block`,
            task.complete ? `block` : `hidden`,
          ])}
          checked={task.complete}
        />
        <Link
          to={`/kanban/board/${boardId}/task/${task._id}`}
          className="block w-full py-2"
        >
          {task?.name}
        </Link>
      </div>

      <Link
        to={`/kanban/board/${boardId}/task/${task._id}`}
        className="hidden group-hover:block absolute top-1 right-1 p-1 rounded-full hover:bg-gray-200"
      >
        <SquarePen size={14} />
      </Link>
    </div>
  );
};

export default memo(TaskCard);
