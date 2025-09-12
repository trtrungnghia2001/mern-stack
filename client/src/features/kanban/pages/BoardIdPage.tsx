import DndWraper from "../components/DndWraper";
import { useTaskStore } from "../stores/task.store";
import { useColumnStore } from "../stores/column.store";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useBoardStore } from "../stores/board.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { boardBgColor } from "../constants/color";
import ButtonBoardFavorite from "../components/ButtonBoardFavorite";
import { taskStatusOptions } from "../constants/option";
import type { IBoard } from "../types/board.type";
import useSearchParamsValue from "@/shared/hooks/useSearchParamsValue";
import Loading from "../components/Loading";
import InputDebounce from "../components/InputDebounce";
import { Check, Image, Trash } from "lucide-react";
import ButtonDropdownMenu from "../components/ButtonDropdownMenu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BoardIdPage = () => {
  const { boardId } = useParams();
  const { getById, updateById, deleteById } = useBoardStore();
  const { tasks, setTasks, getAllByBoardId: getTasks } = useTaskStore();
  const { columns, setColumns, getAllByBoardId: getColumns } = useColumnStore();

  // get task x column
  const { searchParams, handleSearchParams } = useSearchParamsValue();
  const filter = searchParams.get("filter") || taskStatusOptions[0].value;

  const getColumnsAndTasksResult = useQuery({
    queryKey: ["columns-tasks", boardId, searchParams.toString()],
    queryFn: async () => {
      const [tasks, columns] = await Promise.all([
        getTasks(boardId as string, searchParams.toString()),
        getColumns(boardId as string),
      ]);

      return { tasks, columns };
    },
  });

  // board
  const [board, setBoard] = useState<Partial<IBoard>>();
  const getBoardByIdResult = useQuery({
    queryKey: ["boards", boardId],
    queryFn: async () => await getById(boardId as string),
    enabled: !!boardId,
  });
  useEffect(() => {
    if (getBoardByIdResult.isSuccess && getBoardByIdResult.data) {
      setBoard(getBoardByIdResult.data.data);
    }
  }, [getBoardByIdResult.isSuccess, getBoardByIdResult.data]);

  const updateBoardByIdResult = useMutation({
    mutationFn: async (data: Partial<IBoard>) =>
      await updateById(boardId as string, data),
  });
  const navigate = useNavigate();
  const deleteBoardByIdResult = useMutation({
    mutationFn: async () => await deleteById(boardId as string),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/kanban/boards`);
    },
    onError: (error) => toast.error(error.message),
  });

  if (getBoardByIdResult.isLoading || getColumnsAndTasksResult.isLoading)
    return <Loading />;

  if (!getBoardByIdResult.data?.data || !boardId) return;

  return (
    <>
      <div
        className="h-full w-full overflow-auto flex flex-col"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), 
          url('${boardBgColor[board?.bgColor || 0]}') no-repeat center/cover `,
        }}
      >
        {/* header */}
        <div className="bg-white/25 text-white p-3 w-full flex items-center justify-between gap-8">
          {/* left */}
          <InputDebounce
            initValue={getBoardByIdResult.data.data.name}
            setInitValue={(value) =>
              updateBoardByIdResult.mutate({ name: value })
            }
          />

          {/* right */}
          <div className="flex items-center gap-2">
            <select
              name="filter-task"
              id="filter-task"
              className="bg-transparent text-sm outline-none border-none"
              value={filter}
              onChange={(e) => handleSearchParams("filter", e.target.value)}
            >
              {taskStatusOptions.map((item) => (
                <option
                  key={item.value}
                  className="text-black"
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
            <ButtonBoardFavorite board={getBoardByIdResult.data.data} />
            <ButtonDropdownMenu
              button={
                <button
                  type="button"
                  className="p-1 rounded-full overflow-hidden hover:bg-gray-300 hover:text-blue-500"
                >
                  <Image size={16} />
                </button>
              }
            >
              <ul className="grid grid-cols-3 gap-2 p-1">
                {boardBgColor.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setBoard((prev) => ({ ...prev, bgColor: idx }));
                      updateBoardByIdResult.mutate({ bgColor: idx });
                    }}
                    className="relative rounded overflow-hidden"
                  >
                    {idx === board?.bgColor && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Check className="absolute text-white" size={16} />
                      </div>
                    )}
                    <img
                      src={item}
                      alt="board-bg"
                      loading="lazy"
                      className="img"
                    />
                  </li>
                ))}
              </ul>
            </ButtonDropdownMenu>

            <button
              className="p-1 rounded-full overflow-hidden hover:bg-gray-300 hover:text-red-500"
              onClick={() => deleteBoardByIdResult.mutate()}
            >
              <Trash size={16} />
            </button>
          </div>
        </div>
        {/* main */}
        <div className="overflow-auto flex-1">
          <DndWraper
            columns={columns}
            setColumns={setColumns}
            tasks={tasks}
            setTasks={setTasks}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default BoardIdPage;
