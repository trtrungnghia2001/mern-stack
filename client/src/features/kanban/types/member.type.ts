import type { IUser } from "@/features/auth/types/auth";

export interface IMember {
  _id: string;
  role: string;
  user: IUser;
}

export interface IMemberDetail extends Readonly<IUser> {
  _id: string;
  createdAt: string;
}
