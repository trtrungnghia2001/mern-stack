import { create } from "zustand";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";
import { tasks } from "../data";
import type { ICreateDTO, ITask } from "../types/task.type";

interface ITaskStore {
  tasks: ITask[];
  create: (data: ICreateDTO) => Promise<ResponseSuccessType<ITask>>;
  updateById: (
    id: string,
    data: Partial<ITask> | FormData
  ) => Promise<ResponseSuccessType<ITask>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<ITask>>;
  getById: (id: string) => Promise<ResponseSuccessType<ITask>>;
  getAllByBoardId: (
    boardId: string,
    query?: string
  ) => Promise<ResponseSuccessListType<ITask>>;
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
      tasks: [...get().tasks, resp.data],
    });
    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (await instance.put<ResponseSuccessType<ITask>>(url, data))
      .data;
    set({
      tasks: get().tasks.map((item) =>
        item._id === resp.data._id
          ? {
              ...item,
              ...resp.data,
              todoCount: resp.data.todos.length,
              todoCompleted: resp.data.todos.filter((t) => t.complete).length,
              fileCount: resp.data.files.length,
            }
          : item
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
  getAllByBoardId: async (boardId, query) => {
    const url = baseUrl + `/get-all/board/` + boardId + "?" + query;
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
      await instance.post<ResponseSuccessListType<ITask>>(url, { tasks: data })
    ).data;
    return resp;
  },
}));
