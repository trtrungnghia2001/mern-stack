import ENV_CONFIG from "#server/configs/env.config";

export const ORIGIN_URLS = [
  `http://localhost:5173`,
  `http://localhost:4200`,
  `http://127.0.0.1:5500`,
  ENV_CONFIG.URL_CLIENT,
];
