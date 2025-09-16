import type { IUser } from "@/features/auth/types/auth";

export interface ICreateDTO {
  name: string;
  column: string;
  board: string;
}
export interface ITask {
  _id: string;
  name: string;
  position: number;
  bgUrl: string;

  column: string;
  board: string;
  complete: boolean;
  startDate: string;
  endDate: string;

  description: string;
  files: IFile[];
  todos: ITodo[];

  createdAt: string;
  updatedAt: string;

  todoCount: number;
  fileCount: number;
  todoCompleted: number;
}
//
export interface ITodo {
  _id: string;
  name: string;
  complete: boolean;
  assignee: IUser;

  createdAt: string;
  updatedAt: string;
}
export interface ITodoCreate {
  name: string;
  complete: boolean;
}

export interface IFile {
  asset_id: string;
  url: string;
  created_at: string;
  resource_type: string;
}
