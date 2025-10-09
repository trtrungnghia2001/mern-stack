import type { IUser } from "@/features/auth/types/auth";
import type { IUploadFile } from "@/features/upload/types/upload.type";

export interface IMessage {
  _id: string;
  room: string;
  sender: IUser;
  createdAt: string | Date;

  text?: string;
  attachments?: Array<IUploadFile>;
  reactions?: Array<{
    emoji: string;
    userId: string;
  }>;
  status?: "sending" | "sent" | "delivered" | "read";
  readBy: string[];
}
