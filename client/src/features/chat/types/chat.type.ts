import type { IUser } from "@/features/auth/types/auth";
import type { IUploadFile } from "@/features/upload/types/upload.type";

export interface IChatMessage {
  _id: string;
  room: IChatRoom | string;
  sender: IUser;
  message: string;
  files: IUploadFile[];
  createdAt: string;
  updatedAt: string;
  readBy?: IUser[];
}

export interface IChatRoom {
  _id: string;
  name?: string;
  avatar?: string;
  description?: string;
  type: string; // từ ROOM_TYPE
  members: { user: IUser; role: string }[];
  lastMessage?: string; // hoặc full message object nếu populate
  createdAt: string;
  updatedAt: string;
}
