import { memo } from "react";
import { TableRow } from "@/shared/components/ui/table";
import clsx from "clsx";
import { type DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Grip } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface SortableRowProps {
  id: string;
  children: (
    attributes: ReturnType<typeof useSortable>["attributes"],
    listeners: ReturnType<typeof useSortable>["listeners"]
  ) => React.ReactNode;
}

const SortableRow = ({ id, children }: SortableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <TableRow
      ref={setNodeRef}
      className={clsx([
        "transition-colors",
        isDragging && "opacity-50 shadow-md cursor-grabbing",
      ])}
      style={style}
    >
      {children(attributes, listeners)}
    </TableRow>
  );
};

export default memo(SortableRow);

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

export const DragHandle = ({ attributes, listeners }: DragHandleProps) => {
  return (
    <div {...attributes} {...listeners}>
      <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
    </div>
  );
};
