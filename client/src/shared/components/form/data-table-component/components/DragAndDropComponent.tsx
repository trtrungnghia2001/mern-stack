import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { memo, useMemo, useState } from "react";

type WithId = { id: string };

interface DragAndDropComponentProps<T extends WithId> {
  children: React.ReactNode;
  data: T[];
  onDragEnd?: (newData: T[]) => void;
}

const DragAndDropComponent = <T extends WithId>({
  children,
  data,
  onDragEnd,
}: DragAndDropComponentProps<T>) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const ids = useMemo(() => {
    return data.map((item) => item.id.toString());
  }, [data]);

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id.toString());
  };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    console.log({ activeId, active, over });

    if (!active || !over || active.id === over?.id) return;

    const activeIndex = data.findIndex((r) => String(r.id) === active.id);
    const overIndex = data.findIndex((r) => String(r.id) === over.id);

    if (activeIndex === -1 || overIndex === -1) return;

    requestAnimationFrame(() => {
      const newData = arrayMove(data, activeIndex, overIndex);
      onDragEnd?.(newData);
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragOver}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
      {activeId && <DragOverlay></DragOverlay>}
    </DndContext>
  );
};

export default memo(DragAndDropComponent);
