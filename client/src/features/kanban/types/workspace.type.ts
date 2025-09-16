import type { IUser } from "@/features/auth/types/auth";

export interface IWorkspace {
  _id: string;
  name: string;
  description: string;
  owner: IUser;
  members: [];
}

export interface IWorkspaceCreateDTO {
  name: string;
  description: string;
}
