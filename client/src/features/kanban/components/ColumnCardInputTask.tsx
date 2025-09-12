import { memo, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import type { ICreateDTO } from "../types/task.type";
import { useTaskStore } from "../stores/task.store";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Plus, X } from "lucide-react";
import type { IColumn } from "../types/column.type";

const taskInit: ICreateDTO = {
  name: "",
  column: "",
  board: "",
};

interface ColumnCardInputTaskProps {
  column: IColumn;
}

const ColumnCardInputTask = ({ column }: ColumnCardInputTaskProps) => {
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
            placeholder="Enter title"
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
            "hover:bg-black/10 py-2 px-3 rounded-lg",
          ])}
        >
          <Plus size={16} /> <span>Add card</span>
        </button>
      )}
    </div>
  );
};

export default memo(ColumnCardInputTask);
