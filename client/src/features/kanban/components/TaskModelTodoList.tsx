import { ListTodo } from "lucide-react";
import type { ITodo } from "../types/task.type";
import { useState } from "react";
import { v4 } from "uuid";

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

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <ListTodo size={16} />
        <div className="font-bold text-base">Todo List</div>
      </div>
      <ul className="space-y-3">
        {todos.map((item) => (
          <li key={item._id} className="flex gap-3">
            <input type="checkbox" checked={item.complete} />
            <div>{item.name}</div>
          </li>
        ))}
        <li>
          {openInput ? (
            <>
              <input
                type="text"
                placeholder="Add an item"
                className="focus:border-blue-500 border-2 outline-none rounded px-3 py-2 w-full"
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

export default TaskModelTodoList;
