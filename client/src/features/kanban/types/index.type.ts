export interface IActiveId {
  id: string;
  type: SortableType;
}

export type SortableType = "task" | "column";
