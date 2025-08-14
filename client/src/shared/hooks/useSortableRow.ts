// hooks/useSortableRow.ts
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const useSortableRow = (id: string) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      // handle: true, // chỉ cho phép kéo qua handle
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return {
    setNodeRef,
    style,
    handleProps: { ...attributes, ...listeners },
  };
};
