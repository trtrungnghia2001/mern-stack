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

export interface IAuthStore {
  // --- State ---
  user: null | IUser;
  accessToken: null | string;
  isAuthenticated: boolean;

  // --- Actions ---
  signup: (data: ISignupDTO) => Promise<ResponseSuccessType<IUser> | undefined>;
  signin: (
    data: ISigninDTO
  ) => Promise<ResponseSuccessType<ISigninResponseData> | undefined>;
  signout: () => Promise<ResponseSuccessType | undefined>;
  forgotPassword: (
    data: IForgotPasswordDTO
  ) => Promise<ResponseSuccessType | undefined>;
  resetPassword: (
    data: IResetPasswordDTO
  ) => Promise<ResponseSuccessType | undefined>;
  signinWithSocialMedia: (social: SocialMediaType) => void;
  signinWithSocialMediaSuccess: () => Promise<
    ResponseSuccessType<ISigninResponseData> | undefined
  >;
  updateMe: (
    data: Partial<IUser>
  ) => Promise<ResponseSuccessType<IUser> | undefined>;
  getMe: () => Promise<ResponseSuccessType<IUser> | undefined>;
  changePassword: (
    data: IChangePasswordDTO
  ) => Promise<ResponseSuccessType | undefined>;
}

export interface ISigninResponseData {
  access_token: string;
  user: IUser;
}

export type SocialMediaType = "google" | "github";
