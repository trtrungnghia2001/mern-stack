import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../components/SortableItem";
import ColumnCard from "../components/ColumnCard";
import DndWraper from "../components/DndWraper";
import { useTaskStore } from "../stores/task.store";
import { useColumnStore } from "../stores/column.store";
import { useParams } from "react-router-dom";
import TaskModel from "../components/TaskModel";

const BoardIdPage = () => {
  const { id } = useParams();

  const { tasks, setTasks } = useTaskStore();
  const { columns, setColumns } = useColumnStore();
  console.log({ tasks });

  return (
    <>
      <div className="overflow-y-hidden">
        <DndWraper
          columns={columns}
          setColumns={setColumns}
          tasks={tasks}
          setTasks={setTasks}
        >
          <ul className="flex gap-3">
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
          </ul>
        </DndWraper>
      </div>
      <TaskModel />
    </>
  );
};

export default BoardIdPage;
