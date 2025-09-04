import type { IUser } from "@/features/auth/types/auth";
import type { IUploadFile } from "@/features/upload/types/upload.type";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";

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
  lastMessage?: IChatMessage;
  createdAt: string;
  updatedAt: string;
}

// dto
export interface IGroupDTO {
  name: string;
  avatar: string;
  description: string;
}

export interface IRoomDTO {
  name: string;
  avatar?: string;
  description?: string;
}

// store
export interface IChatRoomStore {
  rooms: IChatRoom[];
  create: (data: FormData) => Promise<ResponseSuccessType<IChatRoom>>;
  updateId: (
    id: string,
    data: FormData
  ) => Promise<ResponseSuccessType<IChatRoom>>;
  deleteId: (id: string) => Promise<ResponseSuccessType<IChatRoom>>;
}

export interface IChatMessageStore {
  messages: IChatMessage[];
  getMessRoomId: (
    id: string,
    query: string
  ) => Promise<ResponseSuccessListType<IChatMessage>>;
  sendMess: (data: FormData) => Promise<ResponseSuccessType<IChatMessage>>;
  deleteMessId: (id: string) => Promise<ResponseSuccessType<IChatMessage>>;
}
