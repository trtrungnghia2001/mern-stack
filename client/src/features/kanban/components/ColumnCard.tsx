import TaskCard from "./TaskCard";
import SortableItem from "./SortableItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { memo } from "react";
import ColumnCardMenu from "./ColumnCardMenu";
import { cloumnBgColor } from "../constants/color";
import clsx from "clsx";
import type { IColumn } from "../types/column.type";
import type { ITask } from "../types/task.type";
import { useMutation } from "@tanstack/react-query";
import ColumnCardInputTask from "./ColumnCardInputTask";
import { useColumnStore } from "../stores/column.store";
import InputDebounce from "./InputDebounce";
import { Save } from "lucide-react";

interface ColumnCardProps {
  column: IColumn;
  tasks: ITask[];
}

const ColumnCard = ({ column, tasks }: ColumnCardProps) => {
  const { updateById } = useColumnStore();
  const updateByIdResult = useMutation({
    mutationFn: async (data: Partial<IColumn>) => updateById(column._id, data),
  });

  return (
    <div
      className={clsx([
        `rounded-lg shadow space-y-2 py-2 w-[300px] flex flex-col h-max transition-all`,
      ])}
      style={{
        backgroundColor: cloumnBgColor[column.bgColor],
      }}
    >
      {/*  */}
      <div className="flex items-center gap-2 px-2">
        <InputDebounce
          initValue={column.name}
          setInitValue={(value) => updateByIdResult.mutate({ name: value })}
        />
        {column.isSave && (
          <button onClick={() => updateByIdResult.mutate({ isSave: false })}>
            <Save size={16} className="text-gray-500" />
          </button>
        )}
        <ColumnCardMenu
          column={column}
          onChangeBgColor={(value) =>
            updateByIdResult.mutate({ bgColor: value })
          }
          onChangeSave={(value) => updateByIdResult.mutate({ isSave: value })}
        />
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
      <ColumnCardInputTask column={column} />
    </div>
  );
};

export default memo(ColumnCard);
