import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

let ratelimit;

if (process.env.NODE_ENV === "production") {
  // Production: stricter limits
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 req/min per IP
  });
} else {
  // Development: no real limit
  ratelimit = {
    limit: async () => ({ success: true }),
  };
}

export default ratelimit;
