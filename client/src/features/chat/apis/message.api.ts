import instance from "@/configs/axios.config";
import type {
  ResponseSuccessListType,
  ResponseSuccessType,
} from "@/shared/types/response";
import type { IChatMessage } from "../types/chat.type";

const baseUrl = `/api/v1/chat/message`;

export async function messageRoomIdApi(id: string, query: string) {
  const url = baseUrl + `/room/` + id + "?" + query;
  return (await instance.get<ResponseSuccessListType<IChatMessage>>(url)).data;
}
export async function messageSendApi(data: FormData) {
  const url = baseUrl + `/send-message`;
  return (await instance.post<ResponseSuccessType<IChatMessage>>(url, data))
    .data;
}
export async function messageDeleteIdApi(id: string) {
  const url = baseUrl + `/delete-message/` + id;
  return (await instance.delete<ResponseSuccessType<IChatMessage>>(url)).data;
}
