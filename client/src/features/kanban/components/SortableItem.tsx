import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type React from "react";
import { memo } from "react";
import type { SortableType } from "../types/index.type";

interface SortableItemProps {
  id: string;
  type: SortableType;
  children: React.ReactNode;
}

const SortableItem = ({ id, type, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id, data: { type } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0, // Đưa item đang kéo lên trên cùng
    opacity: isDragging ? 0.5 : 1, // Giảm độ mờ khi kéo để tạo hiệu ứng
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        ${isDragging ? "cursor-grabbing" : ""}
      `}
      {...attributes}
      {...listeners}
      onKeyDown={(e) => {
        // Nếu đang trong input/textarea thì đừng cho dnd-kit xử lý phím
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          e.stopPropagation();
        }
      }}
    >
      {children}
    </li>
  );
};

export default memo(SortableItem);
