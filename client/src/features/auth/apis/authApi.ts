import instance from "@/configs/axios.config";
import type { ResponseSuccessType } from "@/shared/types/response";
import ENV_CONFIG from "@/configs/env.config";
import axios from "axios";
import type {
  IChangePasswordDTO,
  IForgotPasswordDTO,
  IResetPasswordDTO,
  ISigninDTO,
  ISigninResponseData,
  ISignupDTO,
  IUpdateMeDTO,
  IUser,
} from "../types/auth";

const baseUrl = `/api/v1/auth`;

export async function signupApi(data: ISignupDTO) {
  const url = baseUrl + `/signup`;
  return (await instance.post<ResponseSuccessType<IUser>>(url, data)).data;
}
export async function signinApi(data: ISigninDTO) {
  const url = baseUrl + `/signin`;
  return (
    await instance.post<ResponseSuccessType<ISigninResponseData>>(url, data)
  ).data;
}
export async function signoutApi() {
  const url = baseUrl + `/signout`;
  return (await instance.post<ResponseSuccessType<IUser>>(url)).data;
}
export async function forgotPasswordApi(data: IForgotPasswordDTO) {
  const url = baseUrl + `/forgot-password`;
  return (await instance.post<ResponseSuccessType>(url, data)).data;
}
export async function resetPasswordApi(data: IResetPasswordDTO) {
  const url = baseUrl + `/reset-password`;
  return (await instance.post<ResponseSuccessType>(url, data)).data;
}
export async function signinWithSocialMediaSuccessApi() {
  const url = baseUrl + `/passport/signin-success`;
  return (
    await instance.get<ResponseSuccessType<ISigninResponseData>>(url, {
      withCredentials: true,
    })
  ).data;
}
export async function refreshTokenApi() {
  const url = ENV_CONFIG.URL_SERVER + baseUrl + "/refresh-token";
  const refreshToken = await axios.post(
    url,
    {},
    {
      withCredentials: true,
    }
  );
  return refreshToken;
}
export async function getMeApi() {
  const url = baseUrl + `/get-me`;
  return (await instance.get<ResponseSuccessType<IUser>>(url)).data;
}
export async function updateMe(data: IUpdateMeDTO | FormData) {
  const url = baseUrl + `/update-me`;
  return (await instance.put<ResponseSuccessType<IUser>>(url, data)).data;
}
export async function changePasswordApi(data: IChangePasswordDTO) {
  const url = baseUrl + `/change-password`;
  return (await instance.post<ResponseSuccessType>(url, data)).data;
}
