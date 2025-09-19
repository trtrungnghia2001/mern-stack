import type { IUser } from "@/features/auth/types/auth";
import type { IMember } from "./member.type";

export interface IWorkspace {
  _id: string;
  name: string;
  description: string;
  owner: IUser;
  members: IMember[];
}

export interface IWorkspaceCreateDTO {
  name: string;
  description: string;
}
export interface IWorkspaceUpdateDTO {
  name: string;
  description: string;
}
