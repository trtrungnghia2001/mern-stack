import { Ellipsis } from "lucide-react";
import { memo } from "react";
import { cloumnBgColor } from "../constants/color";
import ButtonDropdownMenu from "./ButtonDropdownMenu";
import type { IColumn } from "../types/column.type";
import clsx from "clsx";
import { useColumnStore } from "../stores/column.store";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ColumnCardMenuProps {
  column: IColumn;
  onChangeBgColor: (value: number) => void;
  onChangeSave: (value: boolean) => void;
}

const ColumnCardMenu = ({
  column,
  onChangeBgColor,
  onChangeSave,
}: ColumnCardMenuProps) => {
  const { deleteById } = useColumnStore();
  const deleteByIdResult = useMutation({
    mutationFn: async (id: string) => await deleteById(id),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  return (
    <ButtonDropdownMenu
      button={
        <button className="hover:bg-gray-400/50 p-2 rounded-lg">
          <Ellipsis size={16} />
        </button>
      }
    >
      <div>
        <div className="font-medium text-center p-5">Operation</div>
        <ul>
          <li
            className="py-2 px-3 cursor-pointer hover:bg-gray-100"
            onClick={() => onChangeSave(!column.save)}
          >
            {column.save ? `Unsave` : `Save`}
          </li>
          <li
            className="py-2 px-3 cursor-pointer hover:bg-gray-100"
            onClick={() => deleteByIdResult.mutate(column._id)}
          >
            Delete
          </li>
        </ul>
        <div className="border-t mt-2 py-2 px-3 space-y-2">
          <div className="font-semibold text-xs">Change list color</div>
          <ul className="grid grid-cols-5 gap-2">
            {cloumnBgColor.map((item, idx) => (
              <li
                key={idx}
                onClick={() => onChangeBgColor(idx)}
                className={clsx([
                  `rounded aspect-video cursor-pointer p-0.5 transition-all`,
                  idx === column.bgColor && `border-blue-500 border-2`,
                ])}
                style={{ backgroundColor: item }}
              ></li>
            ))}
          </ul>
          <button
            onClick={() => onChangeBgColor(0)}
            disabled={column.bgColor === 0}
            className="disabled:cursor-not-allowed bg-gray-200 rounded px-3 py-2 w-full font-medium disabled:text-gray-500"
          >
            Remove color
          </button>
        </div>
      </div>
    </ButtonDropdownMenu>
  );
};

export default memo(ColumnCardMenu);
