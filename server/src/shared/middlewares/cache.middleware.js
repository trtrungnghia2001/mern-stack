import { redisClient } from "#server/configs/redis.config";

export function redisCacheWithTTL(prefix = "", ttl = 60) {
  return async (req, res, next) => {
    try {
      const key = `${prefix}:${req.originalUrl}`;

      const cached = await redisClient.get(key);
      console.log({ key, cached: !!cached });

      if (cached) {
        const parsed = JSON.parse(cached);
        return res.status(parsed.status || 200).json(parsed);
      }

      // Ghi đè res.json để lưu vào Redis sau khi xử lý
      res.sendResponse = res.json;
      res.json = (body) => {
        console.log("📦 Caching response to Redis:", key);
        redisClient.setEx(key, ttl, JSON.stringify(body));
        res.sendResponse(body);
      };
      next();
    } catch (error) {
      next(error);
    }
  };
}
