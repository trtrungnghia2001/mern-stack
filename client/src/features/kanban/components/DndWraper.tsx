import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { memo, useState, type FC } from "react";
import type { IActiveId } from "../types/index.type";
import ColumnCard from "./ColumnCard";
import TaskCard from "./TaskCard";
import type { IColumn } from "../types/column.type";
import type { ITask } from "../types/task.type";
import SortableItem from "./SortableItem";
import ButtonColumnNew from "./ButtonColumnNew";
import { useTaskStore } from "../stores/task.store";
import { useColumnStore } from "../stores/column.store";

interface DndWraperProps {
  //
  columns: IColumn[];
  setColumns: (columns: IColumn[]) => void;
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
}

const DndWraper: FC<DndWraperProps> = ({
  columns,
  setColumns,
  tasks,
  setTasks,
}) => {
  //
  const { updatePosition: updatePositionTasks } = useTaskStore();
  const { updatePosition: updatePositionColumns } = useColumnStore();

  //
  const [activeId, setActiveId] = useState<IActiveId | null>(null);

  //
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  //
  const onDragStart = (e: DragStartEvent) => {
    const { active } = e;
    if (!active) return;
    setActiveId({
      id: active.id.toString(),
      type: active.data.current?.type,
    });
  };

  const onDragMove = (e: DragMoveEvent) => {
    const { active, over } = e;
    if (!active || !over || active.id === over.id) return;

    // column x column
    if (
      active.data.current?.type === "column" &&
      over.data.current?.type === "column"
    ) {
      const activeColumnIdx = columns.findIndex(
        (item) => item._id === active.id
      );
      const overColumnIdx = columns.findIndex((item) => item._id === over.id);
      const newColumns = arrayMove(columns, activeColumnIdx, overColumnIdx);
      setColumns(newColumns);
      return;
    }

    // task x column
    if (
      active.data.current?.type === "task" &&
      over.data.current?.type === "column"
    ) {
      const newTasks = tasks.map((item) =>
        item._id === active.id ? { ...item, column: over.id.toString() } : item
      );
      setTasks(newTasks);
    }

    // task x task
    if (
      active.data.current?.type === "task" &&
      over.data.current?.type === "task"
    ) {
      const activeTaskIdx = tasks.findIndex((item) => item._id === active.id);
      const overTaskIdx = tasks.findIndex((item) => item._id === over.id);

      const isSameColumn =
        tasks.find((item) => item._id === active.id)?.column ===
        tasks.find((item) => item._id === over.id)?.column;

      // same column
      if (isSameColumn) {
        const newTask = arrayMove(tasks, activeTaskIdx, overTaskIdx);
        setTasks(newTask);
      } else {
        const taskOver = tasks.find((item) => item._id === over.id);

        if (!taskOver) return;

        const newTasks = tasks;
        newTasks[activeTaskIdx].column = taskOver.column;
        setTasks(newTasks);
      }
      return;
    }
  };

  const onDragEnd = async (e: DragEndEvent) => {
    const { active } = e;
    if (!activeId || !active) return;

    setActiveId(null);

    await updatePositionTasks(tasks);
    await updatePositionColumns(columns);
  };

  //

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      <ul className="flex gap-3 p-3 ">
        <SortableContext
          items={columns.map((item) => item._id)}
          strategy={verticalListSortingStrategy}
        >
          {columns.map((column) => {
            const tasksColumn = tasks.filter(
              (task) => task.column === column._id
            );
            return (
              <SortableItem key={column._id} id={column._id} type="column">
                <ColumnCard column={column} tasks={tasksColumn} />
              </SortableItem>
            );
          })}
        </SortableContext>
        <li>
          <ButtonColumnNew />
        </li>
      </ul>
      {activeId && (
        <DragOverlay>
          {activeId.type === "column" && (
            <ColumnCard
              column={
                columns.find((item) => item._id === activeId.id) as IColumn
              }
              tasks={tasks.filter((task) => task.column === activeId.id)}
            />
          )}
          {activeId.type === "task" && (
            <TaskCard
              task={tasks.find((task) => task._id === activeId.id) as ITask}
            />
          )}
        </DragOverlay>
      )}
    </DndContext>
  );
};

export default memo(DndWraper);
