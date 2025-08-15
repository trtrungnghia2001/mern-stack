// hooks/useSortableRow.ts
import { useDndContext } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const useSortableRow = (id: string) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,

    // handle: true, // chỉ cho phép kéo qua handle
  });

  const { active } = useDndContext();

  const isActive = active?.id === id;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  return {
    setNodeRef,
    style,
    handleProps: { ...attributes, ...listeners },
    isDragging,
    isActive,
  };
};
