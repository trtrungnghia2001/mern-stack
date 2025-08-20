import { redisClient } from "#server/configs/redis.config";

export async function clearRedisByPrefix(prefix) {
  try {
    const keys = await redisClient.keys(prefix + ":*");

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🧹 Cleared cache keys: ${keys.join(", ")}`);
    } else {
      console.log(`ℹ️ No cache keys found for prefix: ${prefix}`);
    }
  } catch (error) {
    console.error("❌ Error clearing Redis cache:", err);
  }
}
