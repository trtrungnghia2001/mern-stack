import { create } from "zustand";
import type { IMessage } from "../types/message.type";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";

interface IMessageStore {
  messages: IMessage[];
  setMessages: (msg: IMessage[]) => void;
  sendMessage: (
    roomId: string,
    data: FormData
  ) => Promise<ResponseSuccessType<IMessage>>;
  getMessageByRoomId: (
    roomId: string,
    query?: string
  ) => Promise<ResponseSuccessListType<IMessage>>;
}

const baseUrl = `/api/v1/chat/rooms/`;

export const useMessageStore = create<IMessageStore>()((set) => ({
  messages: [],
  setMessages: (msg) => {
    set({
      messages: msg,
    });
  },
  sendMessage: async (roomId, data) => {
    const url = baseUrl + roomId + `/messages`;
    const resp = (await instance.post<ResponseSuccessType<IMessage>>(url, data))
      .data;

    return resp;
  },
  getMessageByRoomId: async (roomId, query) => {
    const url = baseUrl + roomId + `/messages?` + query;
    const resp = (await instance.get<ResponseSuccessListType<IMessage>>(url))
      .data;

    return resp;
  },
}));
