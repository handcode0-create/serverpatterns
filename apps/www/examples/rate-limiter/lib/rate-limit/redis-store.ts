import type { RateLimitStore } from "@serverpatterns/core";

// Client minimal attendu : ioredis, node-redis ou Upstash (avec un petit adaptateur).
interface RedisLike {
  incr(key: string): Promise<number>;
  pexpire(key: string, milliseconds: number): Promise<unknown>;
  pttl(key: string): Promise<number>;
}

// Store partagé entre toutes tes instances (Vercel multi-régions, plusieurs serveurs…)
export function createRedisRateLimitStore(redis: RedisLike): RateLimitStore {
  return {
    async increment(key, windowMs) {
      const count = await redis.incr(key);
      if (count === 1) await redis.pexpire(key, windowMs);
      const ttl = await redis.pttl(key);
      return { count, resetAt: Date.now() + (ttl > 0 ? ttl : windowMs) };
    },
  };
}
