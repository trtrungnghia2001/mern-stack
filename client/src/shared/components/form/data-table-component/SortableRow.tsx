import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grip } from "lucide-react";

export interface ISortableRowProps {
  id: string;
  children?: React.ReactNode;
}

const SortableRow = ({ id, children }: ISortableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children || (
        <Grip
          className="w-4 h-4 text-muted-foreground"
          {...attributes}
          {...listeners}
        />
      )}
    </div>
  );
};

export default memo(SortableRow);
