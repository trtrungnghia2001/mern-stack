import TaskCard from "./TaskCard";
import { Plus, X } from "lucide-react";
import SortableItem from "./SortableItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { memo, useEffect, useRef, useState } from "react";
import ColumnCardMenu from "./ColumnCardMenu";
import { cloumnBgColor } from "../constants/color";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import type { IColumn } from "../types/column.type";
import type { ICreateDTO, ITask } from "../types/task.type";
import { useTaskStore } from "../stores/task.store";
import { useMutation } from "@tanstack/react-query";

interface ColumnCardProps {
  column: IColumn;
  tasks: ITask[];
}

const taskInit: ICreateDTO = {
  name: "",
  column: "",
  board: "",
};

const ColumnCard = ({ column, tasks }: ColumnCardProps) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const [task, setTask] = useState(taskInit);

  const handleClose = () => {
    setTask(taskInit);
    setOpen(false);
  };

  const { create } = useTaskStore();
  const createTaskResult = useMutation({
    mutationFn: async (data: ICreateDTO) => await create(data),
    onSuccess: () => {
      setOpen(false);
      setTask(taskInit);
    },
  });

  return (
    <div
      className={clsx([
        `rounded-lg shadow space-y-2 py-2 min-w-[272px] flex flex-col h-max`,
      ])}
      style={{
        backgroundColor: cloumnBgColor[column.bgColor],
      }}
    >
      {/*  */}
      <div className="flex items-center gap-2 px-2">
        <input
          type="text"
          value={column.name}
          onChange={() => {}}
          className="bg-transparent px-2 outline-none flex-1"
        />
        <ColumnCardMenu />
      </div>
      {/* tasks */}
      <ul className="px-2 space-y-2  overflow-y-auto">
        <SortableContext
          items={tasks.map((item) => item._id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableItem key={task._id} id={task._id} type="task">
              <TaskCard task={task} />
            </SortableItem>
          ))}
        </SortableContext>
      </ul>
      {/* input */}
      <div className="px-2">
        {open ? (
          <div className="space-y-2">
            <TextareaAutosize
              className="resize-none w-full rounded-lg px-3 py-1.5 border-2 focus:border-blue-500 "
              value={task.name}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, name: e.target.value }))
              }
              ref={inputRef}
            />
            <div className="flex items-stretch gap-2">
              <button
                onClick={() =>
                  createTaskResult.mutate({
                    name: task.name.trim(),
                    column: column._id,
                    board: column.board,
                  })
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg"
              >
                Add card
              </button>
              <button
                onClick={handleClose}
                className="hover:bg-gray-400/50 px-3 py-1.5 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className={clsx([
              `flex items-center gap-2 w-full py-2 px-3 rounded-lg`,
              "hover:bg-white/50 py-2 px-3 rounded-lg",
            ])}
          >
            <Plus size={16} /> <span>Add card</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(ColumnCard);
