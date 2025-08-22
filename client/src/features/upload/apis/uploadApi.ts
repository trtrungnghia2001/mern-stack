import instance from "@/configs/axios.config";
import type { ResponseSuccessType } from "@/shared/types/response";
import type { IUploadFile } from "../types/upload.type";

const baseUrl = `/api/v1/upload`;

export async function getMediaImageApi() {
  const url = baseUrl + `/media/image`;
  return (await instance.get<ResponseSuccessType<IUploadFile[]>>(url)).data;
}

export async function getMediaVideoApi() {
  const url = baseUrl + `/media/video`;
  return (await instance.get<ResponseSuccessType<IUploadFile[]>>(url)).data;
}

export async function uploadSingleFileApi(data: FormData) {
  const url = baseUrl + `/single`;
  return (await instance.post<ResponseSuccessType<IUploadFile>>(url, data))
    .data;
}
export async function uploadArrayFileApi(data: FormData) {
  const url = baseUrl + `/array`;
  return (await instance.post<ResponseSuccessType<IUploadFile[]>>(url, data))
    .data;
}
