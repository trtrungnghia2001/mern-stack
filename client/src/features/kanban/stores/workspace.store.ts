import instance from "@/configs/axios.config";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import { create } from "zustand";
import type { IWorkspace, IWorkspaceCreateDTO } from "../types/workspace.type";
import type { IMember } from "../types/member.type";

const baseUrl = `/api/v1/kanban/workspace`;

interface IWorkspaceStore {
  workspaces: IWorkspace[];
  create: (
    data: IWorkspaceCreateDTO
  ) => Promise<ResponseSuccessType<IWorkspace>>;
  updateById: (
    id: string,
    data: Partial<IWorkspace>
  ) => Promise<ResponseSuccessType<IWorkspace>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<IWorkspace>>;
  getById: (id: string) => Promise<ResponseSuccessType<IWorkspace>>;
  getAll: (query?: string) => Promise<ResponseSuccessListType<IWorkspace>>;

  // member
  members: IMember[];
  addMember: (
    id: string,
    email: string
  ) => Promise<ResponseSuccessType<IMember>>;
  removeMember: (
    id: string,
    memberId: string
  ) => Promise<ResponseSuccessType<IWorkspace>>;
  updateRoleMember: (
    id: string,
    data: { memberId: string; role: string }
  ) => Promise<ResponseSuccessType<IMember>>;
}

export const useWorkspaceStore = create<IWorkspaceStore>()((set, get) => ({
  workspaces: [],
  create: async (data) => {
    const url = baseUrl + `/create`;
    const resp = (
      await instance.post<ResponseSuccessType<IWorkspace>>(url, data)
    ).data;

    set({
      workspaces: [resp.data, ...get().workspaces],
    });

    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (
      await instance.patch<ResponseSuccessType<IWorkspace>>(url, data)
    ).data;

    set({
      workspaces: get().workspaces.map((item) =>
        item._id === id ? { ...item, ...resp.data } : item
      ),
    });

    return resp;
  },
  deleteById: async (id) => {
    const url = baseUrl + `/delete-id/` + id;
    const resp = (await instance.delete<ResponseSuccessType<IWorkspace>>(url))
      .data;

    set({
      workspaces: get().workspaces.filter((item) => item._id !== id),
    });

    return resp;
  },
  getById: async (id) => {
    const url = baseUrl + `/get-id/` + id;
    const resp = (await instance.get<ResponseSuccessType<IWorkspace>>(url))
      .data;

    set({
      members: resp.data.members,
    });

    return resp;
  },
  getAll: async (query) => {
    const url = baseUrl + `/get-all?` + query;
    const resp = (await instance.get<ResponseSuccessListType<IWorkspace>>(url))
      .data;

    set({
      workspaces: resp.data,
    });

    return resp;
  },

  // member
  members: [],
  addMember: async (id, email) => {
    const url = baseUrl + `/${id}/member/add`;
    const resp = (
      await instance.post<ResponseSuccessType<IMember>>(url, { email })
    ).data;

    set({
      members: get().members.concat(resp.data),
    });

    return resp;
  },
  removeMember: async (id, memberId) => {
    const url = baseUrl + `/${id}/member/remove/` + memberId;
    const resp = (await instance.delete<ResponseSuccessType<IWorkspace>>(url))
      .data;

    set({
      members: get().members.filter((item) => item.user._id !== memberId),
    });

    return resp;
  },
  updateRoleMember: async (id, data) => {
    const url = baseUrl + `/${id}/member/update-role`;
    const resp = (await instance.put<ResponseSuccessType<IMember>>(url, data))
      .data;

    set({
      members: get().members.map((item) =>
        item.user._id === data.memberId
          ? { ...item, role: resp.data.role }
          : item
      ),
    });

    return resp;
  },
}));
