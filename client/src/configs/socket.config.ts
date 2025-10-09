import { io } from "socket.io-client";
import ENV_CONFIG from "./env.config";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export const chatSocket = io(ENV_CONFIG.URL_SOKET, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
  auth: {
    authId: useAuthStore.getState().user?._id,
  },
});
