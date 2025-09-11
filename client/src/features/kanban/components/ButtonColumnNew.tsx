import { useParams } from "react-router-dom";
import { useColumnStore } from "../stores/column.store";
import { useMutation } from "@tanstack/react-query";
import type { ICreateDTO } from "../types/column.type";
import clsx from "clsx";
import { useState } from "react";
import { cloumnBgColor } from "../constants/color";
import { X } from "lucide-react";

const init: ICreateDTO = { board: "", name: "" };

const ButtonColumnNew = () => {
  const { boardId } = useParams();
  const { create } = useColumnStore();
  const createResult = useMutation({
    mutationFn: async (data: ICreateDTO) => await create(data),
    onSuccess: () => {
      setOpen(false);
      setColumn(init);
    },
  });

  const [open, setOpen] = useState(false);
  const [column, setColumn] = useState<ICreateDTO>(init);

  return (
    <div className="min-w-[272px] rounded-lg shadow space-y-2">
      {open && (
        <div
          className={clsx([`rounded-lg p-2`])}
          style={{
            backgroundColor: cloumnBgColor[0],
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createResult.mutate({ ...column, board: boardId as string });
            }}
            className="space-y-2"
          >
            <input
              value={column.name}
              onChange={(e) =>
                setColumn((prev) => ({ ...prev, name: e.target.value }))
              }
              type="text"
              placeholder="Title"
              className="w-full rounded-lg px-3 py-1.5 border"
            />
            <div className="flex items-center gap-2">
              <button
                disabled={!column.name}
                type="submit"
                className={clsx([
                  `px-3 py-1.5 rounded bg-blue-500 text-white`,
                  !column.name && `cursor-not-allowed`,
                ])}
              >
                Create new
              </button>
              <button
                onClick={() => {
                  setColumn(init);
                  setOpen(false);
                }}
                className="hover:bg-gray-400/50 px-3 py-1.5 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={clsx([
            `py-2 bg-white/50 text-white font-medium w-full rounded-lg`,
          ])}
        >
          Add column
        </button>
      )}
    </div>
  );
};

export default ButtonColumnNew;
