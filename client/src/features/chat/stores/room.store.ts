import { create } from "zustand";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";
import type { IMember, IRoom, IRoomCreateDTO } from "../types/room.type";
import type { IMessage } from "../types/message.type";

interface IRoomStore {
  rooms: IRoom[];
  persons: IRoom[];
  setRooms: (rooms: IRoom[]) => void;
  setPersons: (rooms: IRoom[]) => void;
  create: (data: IRoomCreateDTO) => Promise<ResponseSuccessType<IRoom>>;
  deleteById: (roomId: string) => Promise<ResponseSuccessType<IRoom>>;
  getRooms: (query?: string) => Promise<ResponseSuccessListType<IRoom>>;
  getPersons: (query?: string) => Promise<ResponseSuccessListType<IRoom>>;
  getId: (roomId: string, type?: string) => Promise<ResponseSuccessType<IRoom>>;
  getMediasByRoomId: (
    roomId: string
  ) => Promise<ResponseSuccessListType<IMessage>>;

  //
  members: IMember[];
  addMember: (
    roomId: string,
    memberIds: string[]
  ) => Promise<ResponseSuccessType<IRoom>>;
  removeMember: (
    roomId: string,
    memberId: string
  ) => Promise<ResponseSuccessType<IRoom>>;
}

const baseUrl = `/api/v1/chat/rooms/`;

export const useRoomStore = create<IRoomStore>()((set, get) => ({
  rooms: [],
  persons: [],
  setRooms: (rooms) => {
    set({
      rooms: rooms,
    });
  },
  setPersons: (persons) => {
    set({
      persons: persons,
    });
  },
  //
  create: async (data) => {
    const url = baseUrl;
    const resp = (
      await instance.post<ResponseSuccessType<IRoom>>(url, {
        ...data,
        type: "group",
      })
    ).data;
    // set({
    //   rooms: [resp.data, ...get().rooms],
    // });
    return resp;
  },
  deleteById: async (roomId) => {
    const url = baseUrl + roomId;
    const resp = (await instance.delete<ResponseSuccessType<IRoom>>(url)).data;
    set({
      rooms: get().rooms.filter((r) => r._id !== roomId),
    });
    return resp;
  },
  getRooms: async (query = "") => {
    const url = baseUrl + `?` + query;
    const resp = (await instance.get<ResponseSuccessListType<IRoom>>(url)).data;
    set({
      rooms: resp.data,
    });
    return resp;
  },
  getPersons: async (query = "") => {
    const url = baseUrl + `?` + query;
    const resp = (await instance.get<ResponseSuccessListType<IRoom>>(url)).data;
    set({
      persons: resp.data,
    });
    return resp;
  },
  getId: async (roomId, type = "group") => {
    const url = baseUrl + roomId;
    const resp = (
      await instance.get<ResponseSuccessType<IRoom>>(url, {
        params: {
          _type: type,
        },
      })
    ).data;

    set({
      members: resp.data.members,
    });

    return resp;
  },
  getMediasByRoomId: async (roomId) => {
    const url = baseUrl + roomId + `/media`;
    const resp = (await instance.get<ResponseSuccessListType<IMessage>>(url))
      .data;

    return resp;
  },

  //
  members: [],
  addMember: async (roomId, memberIds) => {
    const url = baseUrl + roomId + `/members`;
    const resp = (
      await instance.post<ResponseSuccessType<IRoom>>(url, {
        userIds: memberIds,
      })
    ).data;

    set({
      members: resp.data.members,
    });

    return resp;
  },
  removeMember: async (roomId, memberId) => {
    const url = baseUrl + roomId + `/members/${memberId}`;
    const resp = (await instance.delete<ResponseSuccessType<IRoom>>(url)).data;

    set({
      members: get().members.filter((m) => m.user._id !== memberId),
    });

    return resp;
  },
}));
