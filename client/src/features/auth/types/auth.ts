import type { ResponseSuccessType } from "@/shared/types/response";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  gender: string;
  avatar: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  work: string;
  education: string;
  bio: string;
  link_website: string;
}

// Interfaces được đổi tên thành DTO (Data Transfer Object)
export interface ISignupDTO {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface ISigninDTO {
  email: string;
  password: string;
}

export interface IForgotPasswordDTO {
  email: string;
}

export interface IResetPasswordDTO {
  token: string;
  password: string;
  confirm_password: string;
}

export interface IChangePasswordDTO {
  password: string;
  confirm_password: string;
}

export interface IUpdateMeDTO {
  name: string;
  gender?: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  birthday?: string;
  work?: string;
  education?: string;
  bio?: string;
  link_website?: string;
}

export interface IAuthStore {
  // --- State ---
  user: null | IUser;
  accessToken: null | string;
  isAuthenticated: boolean;

  // --- Actions ---
  signup: (data: ISignupDTO) => Promise<ResponseSuccessType<IUser>>;
  signin: (
    data: ISigninDTO
  ) => Promise<ResponseSuccessType<ISigninResponseState>>;
  signout: () => Promise<ResponseSuccessType>;
  forgotPassword: (data: IForgotPasswordDTO) => Promise<ResponseSuccessType>;
  resetPassword: (data: IResetPasswordDTO) => Promise<ResponseSuccessType>;
  signinWithSocialMedia: (social: SocialMediaType) => void;
  signinWithSocialMediaSuccess: () => Promise<
    ResponseSuccessType<ISigninResponseState>
  >;
  updateMe: (
    data: IUpdateMeDTO | FormData
  ) => Promise<ResponseSuccessType<IUser>>;
  getMe: () => Promise<ResponseSuccessType<IUser>>;
  changePassword: (data: IChangePasswordDTO) => Promise<ResponseSuccessType>;
}

export interface ISigninResponseState {
  access_token: string;
  user: IUser;
}

export type SocialMediaType = "google" | "github";
