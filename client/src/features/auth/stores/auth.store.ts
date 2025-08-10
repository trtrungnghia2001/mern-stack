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
import ENV_CONFIG from "@/shared/configs/env.config";
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
          try {
            const response = await signupApi(data);
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        signin: async (data) => {
          try {
            const response = await signinApi(data);
            if (response.status === 200 && response.data) {
              set({
                user: response.data.user,
                accessToken: response.data.access_token,
                isAuthenticated: true,
              });
            }
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        signout: async () => {
          try {
            const response = await signoutApi();
            if (response.status === 200) {
              set({ user: null, accessToken: null, isAuthenticated: false });
            }
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        forgotPassword: async (data) => {
          try {
            const response = await forgotPasswordApi(data);
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        resetPassword: async (data) => {
          try {
            const response = await resetPasswordApi(data);
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        signinWithSocialMedia: (social) => {
          try {
            const url =
              ENV_CONFIG.URL_SERVER + `/api/v1/auth/passport/` + social;
            window.open(url, "_target");
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        signinWithSocialMediaSuccess: async () => {
          try {
            const response = await signinWithSocialMediaSuccessApi();
            if (response.status === 200 && response.data) {
              set({
                user: response.data.user,
                accessToken: response.data.access_token,
                isAuthenticated: true,
              });
            }

            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        updateMe: async (data) => {
          try {
            const response = await updateMe(data);
            if (response.status === 200 && response.data) {
              set({ user: response.data });
            }
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        getMe: async () => {
          try {
            const response = await getMeApi();
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        changePassword: async (data) => {
          try {
            const response = await changePasswordApi(data);
            return response;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
      }),
      {
        name: "auth",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
