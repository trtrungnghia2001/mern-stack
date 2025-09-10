import { Check, X } from "lucide-react";
import { memo, useState } from "react";
import { useBoardStore } from "../stores/board.store";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { boardBgColor } from "../constants/color";
import type { ICreateDTO } from "../types/board.type";

interface BoardModelProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const init: ICreateDTO = {
  bgColor: 0,
  name: "",
};

const BoardModel = ({ open, setOpen }: BoardModelProps) => {
  const { create } = useBoardStore();
  const [board, setBoard] = useState<ICreateDTO>(init);

  const createResult = useMutation({
    mutationFn: async () => create(board),
    onSuccess: () => {
      setBoard(init);
      setOpen(false);
    },
  });

  if (!open) return;
  return (
    <div className="absolute left-0 bottom-0 bg-white shadow rounded-lg w-[300px] border p-3">
      <button
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"
      >
        <X size={16} />
      </button>
      <div className="space-y-6">
        <div className="text-center font-medium ">Create table</div>
        <div className="mx-auto w-[60%] h-auto aspect-video rounded overflow-hidden">
          <img src={boardBgColor[board.bgColor]} alt="bg" className="img" />
        </div>
        <div className="space-y-2">
          <div className="font-medium text-xs">Background</div>
          <ul className="grid gap-2 grid-cols-4">
            {boardBgColor.map((item, idx) => (
              <li
                key={idx}
                className={`aspect-video rounded overflow-hidden bg-red-500 relative cursor-pointer`}
                onClick={() => setBoard((prev) => ({ ...prev, bgColor: idx }))}
              >
                {idx === board.bgColor && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Check className="absolute text-white" size={16} />
                  </div>
                )}
                <img src={item} alt="bg" className="img" />
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createResult.mutate();
          }}
          className="space-y-2"
        >
          <input
            value={board.name}
            onChange={(e) =>
              setBoard((prev) => ({ ...prev, name: e.target.value }))
            }
            type="text"
            placeholder="Title"
            className="w-full rounded-lg px-3 py-1.5 border"
          />
          <button
            disabled={!board.name}
            type="submit"
            className={clsx([
              `w-full px-3 py-1.5 rounded`,
              board.name
                ? `bg-blue-500 text-white`
                : `bg-gray-100 cursor-not-allowed`,
            ])}
          >
            Create new
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(BoardModel);
