import DndWraper from "../components/DndWraper";
import { useTaskStore } from "../stores/task.store";
import { useColumnStore } from "../stores/column.store";
import { Outlet, useParams } from "react-router-dom";
import { useBoardStore } from "../stores/board.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { boardBgColor } from "../constants/color";
import ButtonBoardFavorite from "../components/ButtonBoardFavorite";
import { taskStatusOptions } from "../constants/option";
import { useEffect, useState } from "react";
import { queryClient } from "@/main";
import type { IBoard } from "../types/board.type";
import TextareaAutosize from "react-textarea-autosize";

const BoardIdPage = () => {
  const { boardId } = useParams();
  const { getById, updateById } = useBoardStore();
  const { tasks, setTasks, getAllByBoardId: getTasks } = useTaskStore();
  const { columns, setColumns, getAllByBoardId: getColumns } = useColumnStore();

  // get task x column
  const getColumnsAndTasksResult = useQuery({
    queryKey: ["columns-tasks", boardId],
    queryFn: async () => {
      const [tasks, columns] = await Promise.all([
        getTasks(boardId as string),
        getColumns(boardId as string),
      ]);

      return { tasks, columns };
    },
  });

  // board
  const [boardName, setBoardName] = useState("");

  const getBoardByIdResult = useQuery({
    queryKey: ["boards", boardId],
    queryFn: async () => await getById(boardId as string),
    enabled: !!boardId,
  });

  const updateBoardByIdResult = useMutation({
    mutationFn: async (data: Partial<IBoard>) =>
      await updateById(data._id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
    },
  });

  useEffect(() => {
    // Không chạy khi component mount hoặc khi giá trị đã khớp
    if (
      boardName === getBoardByIdResult?.data?.data.name ||
      !boardId ||
      !boardName
    ) {
      return;
    }
    const timerId = setTimeout(() => {
      // Gọi mutate với dữ liệu mới nhất
      updateBoardByIdResult.mutate({ _id: boardId, name: boardName });
    }, 500);

    // Hàm dọn dẹp: Hủy timer cũ nếu boardName thay đổi
    return () => {
      clearTimeout(timerId);
    };
  }, [getBoardByIdResult?.data?.data.name, boardName, boardId]);

  useEffect(() => {
    if (getBoardByIdResult.data?.data) {
      setBoardName(getBoardByIdResult.data?.data.name);
    }
  }, [getBoardByIdResult.data?.data]);

  if (getBoardByIdResult.isLoading || getColumnsAndTasksResult.isLoading)
    return <div>Loading...</div>;

  if (!getBoardByIdResult.data?.data || !boardId) return;

  return (
    <>
      <div
        className="h-full w-full"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), 
          url('${
            boardBgColor[getBoardByIdResult.data?.data.bgColor || 0]
          }') no-repeat center/cover `,
        }}
      >
        {/* header */}
        <div className="bg-white/25 text-white p-3 flex items-center justify-between">
          {/* left */}
          <TextareaAutosize
            className="bg-transparent px-2 flex-1 outline-none text-base font-medium"
            value={boardName}
            onChange={(e) => {
              setBoardName(e.target.value);
            }}
          />
          {/* right */}
          <div className="flex items-center gap-4">
            <select
              name="filter-task"
              id="filter-task"
              className="bg-transparent text-sm outline-none border-none"
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
          </div>
        </div>
        {/* main */}
        <DndWraper
          columns={columns}
          setColumns={setColumns}
          tasks={tasks}
          setTasks={setTasks}
        />
      </div>
      <Outlet />
    </>
  );
};

export default BoardIdPage;
