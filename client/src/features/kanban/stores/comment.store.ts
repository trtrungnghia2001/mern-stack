import instance from "@/configs/axios.config";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import { create } from "zustand";
import type { IComment, ICreateDTO } from "../types/comment.type";

interface ICommentStore {
  comments: IComment[];
  create: (data: ICreateDTO) => Promise<ResponseSuccessType<IComment>>;
  updateById: (
    id: string,
    data: Partial<IComment>
  ) => Promise<ResponseSuccessType<IComment>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<IComment>>;
  getAllByTaskId: (
    id: string,
    query?: string
  ) => Promise<ResponseSuccessListType<IComment>>;
}

const baseUrl = `/api/v1/kanban/comment`;

export const useCommentStore = create<ICommentStore>((set, get) => ({
  comments: [],
  create: async (data) => {
    const url = baseUrl + `/create`;
    const resp = (await instance.post<ResponseSuccessType<IComment>>(url, data))
      .data;
    set({ comments: [resp.data, ...get().comments] });
    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (await instance.put<ResponseSuccessType<IComment>>(url, data))
      .data;
    set({
      comments: get().comments.map((item) =>
        item._id === id ? { ...item, ...resp.data } : item
      ),
    });
    return resp;
  },
  deleteById: async (id) => {
    const url = baseUrl + `/delete-id/` + id;
    const resp = (await instance.delete<ResponseSuccessType<IComment>>(url))
      .data;
    set({ comments: get().comments.filter((item) => item._id !== id) });
    return resp;
  },
  getAllByTaskId: async (id, query) => {
    const url = baseUrl + `/get-all/task/` + id + "?" + query;
    const resp = (await instance.get<ResponseSuccessListType<IComment>>(url))
      .data;
    set({ comments: resp.data });
    return resp;
  },
}));
