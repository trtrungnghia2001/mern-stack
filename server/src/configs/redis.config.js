import { createClient } from "redis";
import ENV_CONFIG from "./env.config.js";

export const redisClient = createClient({
  socket: {
    host: ENV_CONFIG.REDIS_HOST,
    port: ENV_CONFIG.REDIS_PORT,
  },
  password: ENV_CONFIG.REDIS_PASSWORD,
});

export async function connectRedis() {
  redisClient.on("connect", function () {
    console.log("Redis:: connected");
  });
  redisClient.on("end", function () {
    console.log("Redis:: disconnected");
  });
  redisClient.on("reconnecting", function () {
    console.log("Redis:: reconnecting");
  });
  redisClient.on("error", (err) => {
    console.log(`Redis:: error`);
    console.error(`Redis error: ${err}`);
  });

  await redisClient.connect();
}
