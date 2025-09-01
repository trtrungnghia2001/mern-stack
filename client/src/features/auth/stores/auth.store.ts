import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  changePasswordApi,
  forgotPasswordApi,
  getMeApi,
  resetPasswordApi,
  signinApi,
  signinWithSocialMediaSuccessApi,
  signoutApi,
  signupApi,
  updateMe,
} from "../apis/authApi";
import type { IAuthStore } from "../types/auth";
import ENV_CONFIG from "@/configs/env.config";

export const useAuthStore = create<IAuthStore>()(
  devtools(
    persist(
      (set) => ({
        // --- State ---
        user: null,
        accessToken: null,
        isAuthenticated: false,

        // --- Actions ---
        signup: async (data) => {
          const response = await signupApi(data);
          return response;
        },
        signin: async (data) => {
          const response = await signinApi(data);
          if (response.status === 200 && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.access_token,
              isAuthenticated: true,
            });
          }

          return response;
        },
        signout: async () => {
          const response = await signoutApi();
          if (response.status === 200) {
            set({ user: null, accessToken: null, isAuthenticated: false });
          }
          return response;
        },
        forgotPassword: async (data) => {
          const response = await forgotPasswordApi(data);
          return response;
        },
        resetPassword: async (data) => {
          const response = await resetPasswordApi(data);
          return response;
        },
        signinWithSocialMedia: (social) => {
          const url = ENV_CONFIG.URL_SERVER + `/api/v1/auth/passport/` + social;
          window.open(url, "_target");
        },
        signinWithSocialMediaSuccess: async () => {
          const response = await signinWithSocialMediaSuccessApi();
          if (response.status === 200 && response.data) {
            set({
              user: response.data.user,
              accessToken: response.data.access_token,
              isAuthenticated: true,
            });
          }

          return response;
        },
        updateMe: async (data) => {
          const response = await updateMe(data);
          if (response.status === 200 && response.data) {
            set({ user: response.data });
          }
          return response;
        },
        getMe: async () => {
          const response = await getMeApi();
          return response;
        },
        changePassword: async (data) => {
          const response = await changePasswordApi(data);
          return response;
        },
      }),
      {
        name: "auth",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
