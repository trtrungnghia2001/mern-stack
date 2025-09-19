import { create } from "zustand";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import instance from "@/configs/axios.config";
import type { IBoard, IBoardCreateDTO } from "../types/board.type";
import type { IMember } from "../types/member.type";

interface IBoardStore {
  boards: IBoard[];
  members: IMember[];
  create: (data: IBoardCreateDTO) => Promise<ResponseSuccessType<IBoard>>;
  updateById: (
    id: string,
    data: Partial<IBoard>
  ) => Promise<ResponseSuccessType<IBoard>>;
  deleteById: (id: string) => Promise<ResponseSuccessType<IBoard>>;
  getById: (id: string) => Promise<ResponseSuccessType<IBoard>>;
  getAll: () => Promise<ResponseSuccessListType<IBoard>>;
  setBoards: (data: IBoard[]) => void;
  updatePosition: (data: IBoard[]) => Promise<ResponseSuccessListType<IBoard>>;

  // view
  boardViews: IBoard[];
  getView: () => Promise<ResponseSuccessListType<IBoard>>;
  addBoardView: (boardId: string) => Promise<ResponseSuccessType<IBoard>>;
  //me
  getMe: () => Promise<ResponseSuccessListType<IBoard>>;

  // workspace
  getBoardsByWorkspaceId: (
    workspaceId: string
  ) => Promise<ResponseSuccessListType<IBoard>>;

  // favorite
  boardFavorites: IBoard[];
  getFavorite: () => Promise<ResponseSuccessListType<IBoard>>;
  addBoardFavorite: (boardId: string) => Promise<ResponseSuccessType<IBoard>>;
  removeBoardFavorite: (
    boardId: string
  ) => Promise<ResponseSuccessType<IBoard>>;
}

const baseUrl = `/api/v1/kanban/board`;

export const useBoardStore = create<IBoardStore>((set, get) => ({
  boards: [],
  members: [],
  create: async (data) => {
    const url = baseUrl + `/create`;
    const resp = (await instance.post<ResponseSuccessType<IBoard>>(url, data))
      .data;
    set({
      boards: [...get().boards, resp.data],
    });
    return resp;
  },
  updateById: async (id, data) => {
    const url = baseUrl + `/update-id/` + id;
    const resp = (await instance.put<ResponseSuccessType<IBoard>>(url, data))
      .data;

    // set({
    //   boards: updateBoardData(id, get().boards, resp.data),
    //   boardViews: updateBoardData(id, get().boardViews, resp.data),
    // });
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
    const resp = await (
      await instance.get<ResponseSuccessType<IBoard>>(url)
    ).data;

    const owner = {
      _id: resp.data.workspace.owner._id,
      user: resp.data.workspace.owner,
      role: "owner",
    };

    set({
      members: [owner, ...resp.data.workspace.members],
    });

    return resp;
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

  // view
  boardViews: [],
  getView: async () => {
    const url = baseUrl + `/get-view`;
    const resp = (await instance.get<ResponseSuccessListType<IBoard>>(url))
      .data;
    set({
      boardViews: resp.data,
    });
    return resp;
  },
  addBoardView: async (boardId) => {
    const url = baseUrl + `/add-view`;
    const resp = (
      await instance.post<ResponseSuccessType<IBoard>>(url, { board: boardId })
    ).data;
    set({
      boardViews: [resp.data, ...get().boardViews],
    });
    return resp;
  },

  //me
  getMe: async () => {
    const url = baseUrl + `/get-me`;
    const resp = (await instance.get<ResponseSuccessListType<IBoard>>(url))
      .data;
    set({
      boards: resp.data,
    });
    return resp;
  },

  // workspace
  getBoardsByWorkspaceId: async (workspaceId) => {
    const url = baseUrl + `/workspace/` + workspaceId;
    const resp = (await instance.get<ResponseSuccessListType<IBoard>>(url))
      .data;

    set({
      boards: resp.data,
    });

    return resp;
  },

  // favorite
  boardFavorites: [],
  getFavorite: async () => {
    const url = baseUrl + `/get-favorite`;
    const resp = (await instance.get<ResponseSuccessListType<IBoard>>(url))
      .data;
    set({
      boardFavorites: resp.data,
    });
    return resp;
  },
  addBoardFavorite: async (boardId) => {
    const url = baseUrl + `/add-favorite`;
    const resp = (
      await instance.post<ResponseSuccessType<IBoard>>(url, { board: boardId })
    ).data;

    set({
      boardFavorites: [resp.data, ...get().boardFavorites],
      boards: get().boards.map((item) =>
        item._id === boardId ? { ...item, favorite: true } : item
      ),
      boardViews: get().boardViews.map((item) =>
        item._id === boardId ? { ...item, favorite: true } : item
      ),
    });
    return resp;
  },
  removeBoardFavorite: async (boardId) => {
    const url = baseUrl + `/remove-favorite`;
    const resp = (
      await instance.post<ResponseSuccessType<IBoard>>(url, { board: boardId })
    ).data;
    set({
      boardFavorites: get().boardFavorites.filter(
        (item) => item._id !== boardId
      ),
      boards: get().boards.map((item) =>
        item._id === boardId ? { ...item, favorite: false } : item
      ),
      boardViews: get().boardViews.map((item) =>
        item._id === boardId ? { ...item, favorite: false } : item
      ),
    });
    return resp;
  },
}));
