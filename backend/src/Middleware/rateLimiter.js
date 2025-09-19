import ratelimit from "../Config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Use the client's IP address as the rate limit key for better accuracy
    const identifier =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { success } = await ratelimit.limit(identifier || "default-key");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }
    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
