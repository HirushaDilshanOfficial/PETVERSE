import { Ratelimit } from "@upstash/ratelimit"; 
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

const redis = Redis.fromEnv();

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "20 s"), 
});

export default limiter;
