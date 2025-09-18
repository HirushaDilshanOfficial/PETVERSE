import limiter from "../Config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await limiter.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    }

    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
