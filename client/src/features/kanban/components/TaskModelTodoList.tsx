import { ListTodo, Trash } from "lucide-react";
import type { ITodo, ITodoCreate } from "../types/task.type";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

interface TaskModelTodoListProps {
  todos: ITodo[];

  updateTodos: (todos: ITodo[]) => void;
}

const initTodo = {
  name: "",
  complete: false,
};

const TaskModelTodoList = ({ todos, updateTodos }: TaskModelTodoListProps) => {
  const [todo, setTodo] = useState<ITodoCreate>(initTodo);

  const [openInput, setOpenInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (openInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openInput]);

  const handleAdd = () => {
    const newTodos = [...todos, todo] as ITodo[];
    updateTodos(newTodos);
    setTodo(initTodo);
    setOpenInput(false);
  };

  const handleComplete = (id: string) => {
    const newTodos = todos.map((item) =>
      item._id === id ? { ...item, complete: !item.complete } : item
    );
    updateTodos(newTodos);
  };

  const handleRemove = (id: string) => {
    const newTodos = todos.filter((item) => item._id !== id);
    updateTodos(newTodos);
  };

  const percent = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.complete).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [todos]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <ListTodo size={16} />
        <div className="font-bold text-base">Todo List</div>
      </div>
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">{percent}%</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* list */}
      <ul>
        {todos.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between gap-6 border-b py-2"
          >
            <label htmlFor={item._id} className="flex gap-3 flex-1">
              <input
                id={item._id}
                type="checkbox"
                checked={item.complete}
                onChange={() => handleComplete(item._id)}
              />
              <span
                className={clsx([
                  ``,
                  item.complete &&
                    `line-through decoration-blue-500 text-blue-500`,
                ])}
              >
                {item.name}
              </span>
            </label>

            <button onClick={() => handleRemove(item._id)}>
              <Trash
                size={16}
                className="hover:stroke-red-500 hover:fill-red-500 "
              />
            </button>
          </li>
        ))}
        <li className="mt-2">
          {openInput && (
            <>
              <input
                type="text"
                placeholder="Add an item"
                className="focus:border-blue-500 border-2 outline-none rounded px-3 py-2 w-full"
                value={todo.name}
                onChange={(e) =>
                  setTodo((prev) => ({ ...prev, name: e.target.value }))
                }
                ref={inputRef}
              />
              <div className="mt-2 space-x-1">
                <button
                  onClick={handleAdd}
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
          )}
          {!openInput && (
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
