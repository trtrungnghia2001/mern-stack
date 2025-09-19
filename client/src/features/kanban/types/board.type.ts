import type { IWorkspace } from "./workspace.type";

export interface IBoardCreateDTO {
  name: string;
  description: string;
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
