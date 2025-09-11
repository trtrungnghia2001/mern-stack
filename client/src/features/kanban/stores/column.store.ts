import { create } from "zustand";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";
import type { IColumn, ICreateDTO, IUpdateDTO } from "../types/column.type";

interface IColumnStore {
  columns: IColumn[];
  create: (data: ICreateDTO) => Promise<ResponseSuccessType<IColumn>>;
  updateById: (
    id: string,
    data: IUpdateDTO
  ) => Promise<ResponseSuccessType<IColumn>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<IColumn>>;
  getById: (id: string) => Promise<ResponseSuccessType<IColumn>>;
  getAllByBoardId: (
    boardId: string
  ) => Promise<ResponseSuccessListType<IColumn>>;
  setColumns: (data: IColumn[]) => void;
  updatePosition: (
    data: IColumn[]
  ) => Promise<ResponseSuccessListType<IColumn>>;
}

const baseUrl = `/api/v1/kanban/column`;

export const useColumnStore = create<IColumnStore>((set, get) => ({
  columns: [],
  create: async (data) => {
    const url = baseUrl + `/create`;
    const resp = (await instance.post<ResponseSuccessType<IColumn>>(url, data))
      .data;
    set({
      columns: [...get().columns, resp.data],
    });
    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (await instance.put<ResponseSuccessType<IColumn>>(url, data))
      .data;
    set({
      columns: get().columns.map((item) =>
        item._id === resp.data._id ? { ...item, ...resp.data } : item
      ),
    });
    return resp;
  },
  deleteById: async (id) => {
    const url = baseUrl + `/delete-id/` + id;
    const resp = (await instance.delete<ResponseSuccessType<IColumn>>(url))
      .data;
    set({
      columns: get().columns.filter((item) => item._id !== resp.data._id),
    });
    return resp;
  },
  getById: async (id) => {
    const url = baseUrl + `/get-id/` + id;
    return (await instance.get<ResponseSuccessType<IColumn>>(url)).data;
  },
  getAllByBoardId: async (boardId) => {
    const url = baseUrl + `/get-all/board/` + boardId;
    const resp = (await instance.get<ResponseSuccessListType<IColumn>>(url))
      .data;
    set({
      columns: resp.data,
    });
    return resp;
  },
  setColumns: (data) => {
    set({
      columns: data,
    });
  },
  updatePosition: async (data) => {
    const url = baseUrl + `/update-position`;
    const resp = (
      await instance.post<ResponseSuccessListType<IColumn>>(url, data)
    ).data;
    return resp;
  },
}));
