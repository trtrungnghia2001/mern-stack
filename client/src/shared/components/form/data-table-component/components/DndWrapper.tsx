import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { memo, useMemo, useState } from "react";

interface IDndWrapperProps<T extends { id: string }> {
  children: React.ReactNode;
  data: T[];
  onDragEnd?: (newData: T[]) => void;
}

const DndWrapper = <T extends { id: string }>({
  children,
  data,
  onDragEnd,
}: IDndWrapperProps<T>) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const ids = useMemo(() => {
    return data.map((item) => item.id);
  }, [data]);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over?.id) return;

    const oldIndex = data.findIndex((r) => String(r.id) === active.id);
    const newIndex = data.findIndex((r) => String(r.id) === over?.id);

    if (oldIndex === -1 || newIndex === -1) return;

    requestAnimationFrame(() => {
      const newData = arrayMove(data, oldIndex, newIndex);
      onDragEnd?.(newData);
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(e.active.id.toString())}
      onDragOver={handleDragOver}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {activeId && <DragOverlay></DragOverlay>}
    </DndContext>
  );
};

export default memo(DndWrapper);
