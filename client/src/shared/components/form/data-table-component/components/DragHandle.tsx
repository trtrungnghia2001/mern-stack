import { Grip } from "lucide-react";
import { useSortableRow } from "../contexts/useSortableRow";

export const DragHandle = ({ id }: { id: string }) => {
  const { handleProps } = useSortableRow(id);

  return (
    <div {...handleProps}>
      <Grip className="w-4 h-4 text-muted-foreground cursor-move" />
    </div>
  );
};
