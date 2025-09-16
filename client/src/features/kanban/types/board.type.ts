import type { IWorkspace } from "./workspace.type";

export interface ICreateDTO {
  name: string;
  bgColor: number;
  workspace: string;
}

export interface IBoard {
  _id: string;
  name: string;
  bgColor: number;
  position: number;
  workspace: IWorkspace;

  favorite: boolean;

  createdAt: string;
  updatedAt: string;
}
