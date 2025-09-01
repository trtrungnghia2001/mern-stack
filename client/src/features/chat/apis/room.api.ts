import instance from "@/configs/axios.config";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import type { IChatRoom } from "../types/chat.type";

const baseUrl = `/api/v1/chat/room`;

export async function roomCreateApi(data: FormData) {
  const url = baseUrl + `/create`;
  return (await instance.post<ResponseSuccessType<IChatRoom>>(url, data)).data;
}
export async function roomUpdateIdApi(id: string, data: FormData) {
  const url = baseUrl + `/update/` + id;
  return (await instance.put<ResponseSuccessType<IChatRoom>>(url, data)).data;
}
export async function roomDeleteIdApi(id: string) {
  const url = baseUrl + `/delete/` + id;
  return (await instance.delete<ResponseSuccessType<IChatRoom>>(url)).data;
}
export async function roomConversationsApi() {
  const url = baseUrl + `/conversations`;
  return (await instance.get<ResponseSuccessListType<IChatRoom>>(url)).data;
}
