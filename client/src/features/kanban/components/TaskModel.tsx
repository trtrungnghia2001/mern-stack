import { memo, useEffect, useRef, useState } from "react";
import { ImageUp, Trash, X } from "lucide-react";
import TaskModelTodoList from "./TaskModelTodoList";
import TaskModelFilesList from "./TaskModelFilesList";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useTaskStore } from "../stores/task.store";
import type { ITask } from "../types/task.type";
import TaskModelDescription from "./TaskModelDescription";
import TextareaAutosize from "react-textarea-autosize";
import TaskModelDate from "./TaskModelDate";

const TaskModel = () => {
  //
  const navigate = useNavigate();
  const { boardId } = useParams();
  const closeModal = () => {
    navigate(`/kanban/board/${boardId}`);
  };
  //
  const { taskId } = useParams();
  const { tasks, updateById, deleteById } = useTaskStore();

  const task = tasks.find((item) => item._id === taskId);

  const updateByIdResult = useMutation({
    mutationFn: async (data: Partial<ITask> | FormData) =>
      updateById(taskId as string, data),
  });
  const deleteByIdResult = useMutation({
    mutationFn: async (id: string) => await deleteById(id),
  });

  // task name
  const [taskName, setTaskName] = useState(task?.name);
  useEffect(() => {
    // Không chạy khi component mount hoặc khi giá trị đã khớp
    if (taskName === task?.name || !taskName) {
      return;
    }
    const timerId = setTimeout(() => {
      // Gọi mutate với dữ liệu mới nhất
      updateByIdResult.mutate({ name: taskName.trim() });
    }, 500);

    // Hàm dọn dẹp: Hủy timer cũ nếu boardName thay đổi
    return () => {
      clearTimeout(timerId);
    };
  }, [taskName, task?.name]);

  // bgUrl
  const inputBgRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => {
    if (!inputBgRef.current) return;
    inputBgRef.current.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("singleFile", file);

    updateByIdResult.mutate(formData);
  };

  //

  if (!taskId || !task) return;

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center">
      {/* background overlay */}
      <div
        onClick={closeModal}
        className="absolute inset-0 bg-black/50 -z-10"
      ></div>

      {/* modal */}
      <div className="overflow-hidden relative flex flex-col max-w-[1080px] w-full max-h-[calc(100vh-32px)] rounded-lg bg-white shadow">
        {/* actions */}
        <div className="absolute top-3 right-3 space-x-2">
          <button
            onClick={() => deleteByIdResult.mutate(taskId)}
            className="rounded-full overflow-hidden p-1 bg-white/50 hover:bg-gray-300"
          >
            <Trash size={16} />
          </button>
          <button
            onClick={handleUploadClick}
            className="rounded-full overflow-hidden p-1 bg-white/50 hover:bg-gray-300"
          >
            <ImageUp size={16} />
          </button>
          <input
            type="file"
            className="hidden"
            ref={inputBgRef}
            onChange={handleFileChange}
          />
          <button
            onClick={closeModal}
            className="rounded-full overflow-hidden p-1 bg-white/50 hover:bg-gray-300"
          >
            <X size={16} />
          </button>
        </div>

        <div
          className="min-h-40 max-h-40 w-full border-b"
          style={{
            background: `url('${task.bgUrl}') no-repeat center center / cover`,
          }}
        ></div>
        <div className="flex-1 flex overflow-hidden">
          {/* left */}
          <div className="w-[60%] p-7 border-r space-y-8 overflow-y-auto">
            {/* name */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task?.complete}
                onChange={(e) =>
                  updateByIdResult.mutate({
                    complete: e.target.checked,
                  })
                }
              />
              <TextareaAutosize
                className="bg-transparent px-2 flex-1 outline-none text-base font-medium"
                value={taskName}
                onChange={(e) => {
                  setTaskName(e.target.value);
                }}
              />
            </div>

            {/* description */}
            <TaskModelDescription
              value={task.description}
              updateValue={(value) => {
                updateByIdResult.mutate({ description: value });
              }}
            />

            {/* file */}
            <TaskModelFilesList
              files={task?.files || []}
              uploadFiles={(files) => {
                updateByIdResult.mutate({ files: files });
              }}
            />
          </div>

          {/* right */}
          <div className="w-[40%] p-7 space-y-8 overflow-y-auto ">
            {/* date */}
            <TaskModelDate
              startDate={task.startDate}
              endDate={task.endDate}
              updateDate={(date) =>
                updateByIdResult.mutate({
                  startDate: date.startDate,
                  endDate: date.endDate,
                })
              }
            />
            {/* todolist */}
            <TaskModelTodoList
              todos={task?.todos || []}
              updateTodos={(todos) => {
                updateByIdResult.mutate({ todos: todos });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskModel);
