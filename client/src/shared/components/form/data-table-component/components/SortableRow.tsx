import { memo } from "react";
import { useSortableRow } from "../contexts/useSortableRow";
import { TableRow } from "@/shared/components/ui/table";
import clsx from "clsx";

export interface ISortableRowProps {
  id: string;
  children?: React.ReactNode;
}

const SortableRow = ({ id, children }: ISortableRowProps) => {
  const { setNodeRef, style, isDragging } = useSortableRow(id);

  return (
    <TableRow
      ref={setNodeRef}
      className={clsx([
        "transition-colors",
        isDragging && "opacity-50 shadow-md cursor-grabbing",
      ])}
      style={style}
    >
      {children}
    </TableRow>
  );
};

export default memo(SortableRow);
