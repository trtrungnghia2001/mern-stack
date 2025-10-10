import type { IUser } from "@/features/auth/types/auth";
import type { IMessage } from "./message.type";

export interface IRoomCreateDTO {
  name: string;
  description: string;
  type?: string;
}

export interface IRoom extends Readonly<IUser> {
  _id: string;
  name: string;
  avatar: string;
  description: string;

  type: "direct" | "group";
  members: IMember[];
  lastMessage: IMessage;
  userId?: string;
  isNew?: boolean;
  createdBy: IUser;
  updatedAt: string;
}
export interface IMember {
  user: IUser;
  role: string;
  joinedAt: string;
}
