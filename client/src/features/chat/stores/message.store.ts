import { create } from "zustand";
import type { IChatMessageStore } from "../types/chat.type";
import {
  messageDeleteIdApi,
  messageRoomIdApi,
  messageSendApi,
} from "../apis/message.api";

export const useMessageStore = create<IChatMessageStore>()((set, get) => ({
  messages: [],
  getMessRoomId: async (id, query) => {
    const resp = await messageRoomIdApi(id, query);
    set({
      messages: resp.data,
    });
    return resp;
  },
  sendMess: async (data) => {
    const resp = await messageSendApi(data);
    set({
      messages: [resp.data, ...get().messages],
    });
    return resp;
  },
  deleteMessId: async (id) => {
    const resp = await messageDeleteIdApi(id);

    set({
      messages: get().messages.filter((item) => item._id !== resp.data._id),
    });
    return resp;
  },
}));
