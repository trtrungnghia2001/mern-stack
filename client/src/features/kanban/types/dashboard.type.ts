export interface IDashboardSummary {
  boards: number;
  tasks: number;
  completed: number;
  overdue: number;
}

export interface IDashboardStatus {
  name: "In Progress" | "Complete" | "Overdue";
  value: number;
}

export interface IBoardData {
  name: string;
  tasks: number;
}

export interface IBoardOverview {
  _id: string;
  name: string;
  columnsCount: number;
  tasksCount: number;
  inProgress: number;
  completed: number;
  overdue: number;
  updatedAt: string;
}

export interface IDashboardOverview {
  summary: IDashboardSummary;
  statusData: IDashboardStatus[];
  boardData: IBoardData[];
  boardOverview: IBoardOverview[];
}
