import { create } from "zustand";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";
import { boards } from "../data";
import type { IBoard, ICreateDTO, IUpdateDTO } from "../types/board.type";

interface IBoardStore {
  boards: IBoard[];
  create: (data: ICreateDTO) => Promise<ResponseSuccessType<IBoard>>;
  updateById: (
    id: string,
    data: IUpdateDTO
  ) => Promise<ResponseSuccessType<IBoard>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<IBoard>>;
  getById: (id: string) => Promise<ResponseSuccessType<IBoard>>;
  getAll: () => Promise<ResponseSuccessListType<IBoard>>;
  setBoards: (data: IBoard[]) => void;
  updatePosition: (data: IBoard[]) => Promise<ResponseSuccessListType<IBoard>>;
}

const baseUrl = `/api/v1/kanban/task`;

export const useBoardStore = create<IBoardStore>((set, get) => ({
  boards: boards,
  create: async (data) => {
    const url = baseUrl + `/create`;
    const resp = (await instance.post<ResponseSuccessType<IBoard>>(url, data))
      .data;
    set({
      boards: [resp.data, ...get().boards],
    });
    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (await instance.put<ResponseSuccessType<IBoard>>(url, data))
      .data;
    set({
      boards: get().boards.map((item) =>
        item._id === resp.data._id ? { ...item, ...resp.data } : item
      ),
    });
    return resp;
  },
  deleteById: async (id) => {
    const url = baseUrl + `/delete-id/` + id;
    const resp = (await instance.delete<ResponseSuccessType<IBoard>>(url)).data;
    set({
      boards: get().boards.filter((item) => item._id !== resp.data._id),
    });
    return resp;
  },
  getById: async (id) => {
    const url = baseUrl + `/get-id/` + id;
    return (await instance.get<ResponseSuccessType<IBoard>>(url)).data;
  },
  getAll: async () => {
    const url = baseUrl + `/get-all/`;
    const resp = (await instance.get<ResponseSuccessListType<IBoard>>(url))
      .data;
    set({
      boards: resp.data,
    });
    return resp;
  },
  setBoards: (data) => {
    set({
      boards: data,
    });
  },
  updatePosition: async (data) => {
    const url = baseUrl + `/update-position`;
    const resp = (
      await instance.post<ResponseSuccessListType<IBoard>>(url, data)
    ).data;
    return resp;
  },
}));
