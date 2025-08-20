import { ORIGIN_URLS } from "#server/shared/constants/url.constant";
import cors from "cors";

const CORS_CONFIG = cors({
  origin: ORIGIN_URLS,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
});

export default CORS_CONFIG;
