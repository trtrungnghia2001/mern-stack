import { create } from "zustand";
import type { IChatRoomStore } from "../types/chat.type";
import {
  roomCreateApi,
  roomDeleteIdApi,
  roomUpdateIdApi,
} from "../apis/room.api";

export const useRoomStore = create<IChatRoomStore>()((set, get) => ({
  rooms: [],
  create: async (data) => {
    const resp = await roomCreateApi(data);
    if (resp.status === 201) {
      set({ rooms: [resp.data, ...get().rooms] });
    }
    return resp;
  },
  updateId: async (id, data) => {
    const resp = await roomUpdateIdApi(id, data);
    if (resp.status === 200) {
      set({
        rooms: get().rooms.map((item) =>
          item._id === resp.data._id ? { ...item, ...resp.data } : item
        ),
      });
    }
    return resp;
  },
  deleteId: async (id) => {
    const resp = await roomDeleteIdApi(id);
    if (resp.status === 200) {
      set({
        rooms: get().rooms.filter((item) => item._id !== resp.data._id),
      });
    }
    return resp;
  },
}));
