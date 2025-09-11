import { memo } from "react";
import { ListTodo, Paperclip, SquarePen } from "lucide-react";
import clsx from "clsx";
import type { ITask } from "../types/task.type";
import { Link, useParams } from "react-router-dom";
import { useTaskStore } from "../stores/task.store";

interface TaskCardProps {
  task: ITask;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { boardId } = useParams();
  const { updateById } = useTaskStore();
  return (
    <div className="relative group shadow overflow-hidden rounded-lg bg-white border hover:border-blue-500">
      {task.bgUrl && (
        <div className="aspect-video">
          <img src={task.bgUrl} alt="bg" className="img" />
        </div>
      )}
      <Link
        to={`/kanban/board/${boardId}/task/${task._id}`}
        className="hidden group-hover:block absolute top-1 right-1 p-1 rounded-full bg-white hover:bg-gray-200"
      >
        <SquarePen size={14} />
      </Link>

      <div className="px-3 my-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className={clsx([
              `group-hover:block`,
              task.complete ? `block` : `hidden`,
            ])}
            checked={task.complete}
            onChange={(e) =>
              updateById(task._id, { complete: e.target.checked })
            }
          />
          <div className="block w-full">{task?.name}</div>
        </div>
      </div>
      {(task.files.length > 0 || task.todos.length > 0) && (
        <div className="px-3 my-2 flex items-center gap-4 text-13 text-gray-500">
          {task.files.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Paperclip size={14} />
              <span>{task.files.length}</span>
            </div>
          )}
          {task.todos.length > 0 && (
            <div className="flex items-center gap-1.5">
              <ListTodo size={14} />
              <span>{task.todos.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(TaskCard);
