import { Ellipsis } from "lucide-react";
import { memo } from "react";
import { cloumnBgColor } from "../constants/color";
import type { IColumn } from "../types/column.type";
import clsx from "clsx";
import { useColumnStore } from "../stores/column.store";
import { useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  const { isPending, mutate } = useMutation({
    mutationFn: async (id: string) => await deleteById(id),
    onSuccess: (data) => toast.success(data.message),
    onError: (error) => toast.error(error.message),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-gray-400/50 p-2 rounded-lg">
        <Ellipsis size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem onClick={() => onChangeSave(!column.save)}>
          {column.save ? `Unsave` : `Save`}
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={isPending}
          onClick={() => mutate(column._id)}
        >
          Delete
        </DropdownMenuItem>
        <div className="border-t pt-2 p-2 space-y-2">
          <div className="font-semibold text-xs">Change list color</div>
          <ul className="grid grid-cols-3 gap-2">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(ColumnCardMenu);
