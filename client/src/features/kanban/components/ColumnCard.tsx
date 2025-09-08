import TaskCard from "./TaskCard";
import { Plus, X } from "lucide-react";
import SortableItem from "./SortableItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { memo, useState } from "react";
import ColumnCardMenu from "./ColumnCardMenu";
import { cloumnBgColor } from "../constants/color";
import clsx from "clsx";
import TextareaAutosize from "react-textarea-autosize";
import type { IColumn } from "../types/column.type";
import type { ITask } from "../types/task.type";

interface ColumnCardProps {
  column: IColumn;
  tasks: ITask[];
}

const ColumnCard = ({ column, tasks }: ColumnCardProps) => {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setName("");
    setOpen(false);
  };

  return (
    <div
      className={clsx([
        `rounded-lg shadow space-y-2 py-2 min-w-[272px] flex flex-col h-max`,
      ])}
      style={{
        backgroundColor: cloumnBgColor[column.bgColor],
      }}
    >
      <div className="flex items-center gap-2 px-2">
        <span className="flex-1 p-3">{column.name}</span>
        <ColumnCardMenu />
      </div>
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
      <div className="px-2">
        {open ? (
          <div className="space-y-2">
            <TextareaAutosize
              className="resize-none w-full rounded-lg p-3 border-2 focus:border-blue-500 "
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="flex items-stretch gap-2">
              <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg">
                Add card
              </button>
              <button
                onClick={handleClose}
                className="hover:bg-gray-400/50 py-2 px-3 rounded-lg"
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
              "hover:bg-white/70 py-2 px-3 rounded-lg",
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
