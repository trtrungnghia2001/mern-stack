import { ListTodo } from "lucide-react";
import type { ITodo } from "../types/task.type";
import { memo, useState } from "react";
import { v4 } from "uuid";
import { useTaskStore } from "../stores/task.store";
import { useParams } from "react-router-dom";

interface TaskModelTodoListProps {
  todos: ITodo[];
}

const initTodo = {
  _id: v4(),
  name: "",
  complete: false,
};

const TaskModelTodoList = ({ todos }: TaskModelTodoListProps) => {
  const [todo, setTodo] = useState<ITodo>(initTodo);

  const [openInput, setOpenInput] = useState(false);

  const { taskId } = useParams();
  const { updateById } = useTaskStore();

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <ListTodo size={16} />
        <div className="font-bold text-base">Todo List</div>
      </div>
      <ul className="space-y-3">
        {todos.map((item) => (
          <li key={item._id}>
            <label htmlFor={item._id} className="flex gap-3">
              <input id={item._id} type="checkbox" checked={item.complete} />
              <span>{item.name}</span>
            </label>
          </li>
        ))}
        <li>
          {openInput ? (
            <>
              <input
                type="text"
                placeholder="Add an item"
                className="focus:border-blue-500 border-2 outline-none rounded px-3 py-2 w-full"
                value={todo.name}
                onChange={(e) =>
                  setTodo((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <div className="mt-2 space-x-1">
                <button
                  onClick={() => {
                    setOpenInput(false);
                    setTodo(initTodo);
                  }}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded"
                >
                  More
                </button>
                <button
                  onClick={() => {
                    setOpenInput(false);
                    setTodo(initTodo);
                  }}
                  className="px-3 py-1.5 hover:bg-gray-200  rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setOpenInput(true)}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Add an item
            </button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default memo(TaskModelTodoList);
