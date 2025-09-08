import { create } from "zustand";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";
import { tasks } from "../data";
import type { ICreateDTO, ITask, IUpdateDTO } from "../types/task.type";

interface ITaskStore {
  tasks: ITask[];
  create: (data: ICreateDTO) => Promise<ResponseSuccessType<ITask>>;
  updateById: (
    id: string,
    data: IUpdateDTO
  ) => Promise<ResponseSuccessType<ITask>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<ITask>>;
  getById: (id: string) => Promise<ResponseSuccessType<ITask>>;
  getAll: () => Promise<ResponseSuccessListType<ITask>>;
  setTasks: (data: ITask[]) => void;
  updatePosition: (data: ITask[]) => Promise<ResponseSuccessListType<ITask>>;
}

const baseUrl = `/api/v1/kanban/task`;

export const useTaskStore = create<ITaskStore>((set, get) => ({
  tasks: tasks,
  create: async (data) => {
    const url = baseUrl + `/create`;
    const resp = (await instance.post<ResponseSuccessType<ITask>>(url, data))
      .data;
    set({
      tasks: [resp.data, ...get().tasks],
    });
    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (await instance.put<ResponseSuccessType<ITask>>(url, data))
      .data;
    set({
      tasks: get().tasks.map((item) =>
        item._id === resp.data._id ? { ...item, ...resp.data } : item
      ),
    });
    return resp;
  },
  deleteById: async (id) => {
    const url = baseUrl + `/delete-id/` + id;
    const resp = (await instance.delete<ResponseSuccessType<ITask>>(url)).data;
    set({
      tasks: get().tasks.filter((item) => item._id !== resp.data._id),
    });
    return resp;
  },
  getById: async (id) => {
    const url = baseUrl + `/get-id/` + id;
    return (await instance.get<ResponseSuccessType<ITask>>(url)).data;
  },
  getAll: async () => {
    const url = baseUrl + `/get-all/`;
    const resp = (await instance.get<ResponseSuccessListType<ITask>>(url)).data;
    set({
      tasks: resp.data,
    });
    return resp;
  },
  setTasks: (data) => {
    set({
      tasks: data,
    });
  },
  updatePosition: async (data) => {
    const url = baseUrl + `/update-position`;
    const resp = (
      await instance.post<ResponseSuccessListType<ITask>>(url, data)
    ).data;
    return resp;
  },
}));
