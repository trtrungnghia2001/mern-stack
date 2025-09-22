import { memo, useRef, useState } from "react";
import {
  ImageUp,
  SquareCheckBig,
  Tag,
  Timer,
  Trash,
  UserPlus,
  X,
} from "lucide-react";
import TaskModelTodoList from "./TaskModelTodoList";
import TaskModelFilesList from "./TaskModelFilesList";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTaskStore } from "../stores/task.store";
import type { ITask } from "../types/task.type";
import TaskModelDescription from "./TaskModelDescription";
import TaskModelDate from "./TaskModelDate";
import InputDebounce from "./InputDebounce";
import TaskModelComment from "./TaskModelComment";
import Loading from "./Loading";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import ErrorPage from "../pages/ErrorPage";

const TaskModel = () => {
  //
  const navigate = useNavigate();
  const { boardId } = useParams();
  const closeModal = () => {
    navigate(`/kanban/board/${boardId}`);
  };
  //
  const { taskId } = useParams();
  const { updateById, deleteById, getById, task } = useTaskStore();

  const getByIdResult = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => getById(taskId as string),
  });

  const updateByIdResult = useMutation({
    mutationFn: async (data: Partial<ITask> | FormData) =>
      updateById(taskId as string, data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteByIdResult = useMutation({
    mutationFn: async (id: string) => await deleteById(id),
    onSuccess: (data) => {
      toast.success(data.message);
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

  // action
  const [openDate, setOpenDate] = useState(false);
  const [openMember, setOpenMember] = useState(false);
  const [openLabel, setOpenLabel] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);

  if (getByIdResult.isLoading) return <Loading />;

  if (!taskId || !task) return <ErrorPage />;

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
        {/* bg */}
        <div
          className="min-h-40 max-h-40 w-full border-b"
          style={{
            background: `url('${task.bgUrl}') no-repeat center center / cover`,
          }}
        ></div>
        {/* main */}
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
              <InputDebounce
                initValue={task.name}
                setInitValue={(value) =>
                  updateByIdResult.mutate({ name: value })
                }
                className="text-base font-medium"
              />
            </div>

            {/* options */}
            <div className="flex items-center flex-wrap gap-2">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setOpenDate(!openDate)}
                className={openDate ? `bg-gray-200` : ""}
              >
                <Timer size={16} /> Date
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setOpenMember(!openMember)}
                className={openMember ? `bg-gray-200` : ""}
              >
                <UserPlus size={16} />
                Member
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setOpenLabel(!openLabel)}
                className={openLabel ? `bg-gray-200` : ""}
              >
                <Tag size={16} />
                Label
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => setOpenTodo(!openTodo)}
                className={openTodo ? `bg-gray-200` : ""}
              >
                <SquareCheckBig size={16} />
                What to do
              </Button>
            </div>

            {/* date */}
            {openDate && (
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
            )}

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

            {/* todolist */}
            <TaskModelTodoList
              todos={task?.todos || []}
              updateTodos={(todos) => {
                updateByIdResult.mutate({ todos: todos });
              }}
            />
          </div>

          {/* right */}
          <div className="w-[40%] p-7 space-y-8 overflow-y-auto bg-[#fcfcfc]">
            <TaskModelComment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TaskModel);
