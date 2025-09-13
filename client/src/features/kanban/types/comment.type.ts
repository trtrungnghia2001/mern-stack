import type { IUser } from "@/features/auth/types/auth";

export interface IComment {
  _id: string;
  user: IUser;
  task: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateDTO {
  comment: string;
  task: string;
}
