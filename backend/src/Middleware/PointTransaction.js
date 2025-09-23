// middleware/PointTransaction.js

// Middleware to validate points input
export const validatePoints = (req, res, next) => {
  const { userId, pointsToAdd, pointsToUse } = req.body;

  // Check if userId is present
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  // If adding points, check value
  if (pointsToAdd !== undefined && (typeof pointsToAdd !== "number" || pointsToAdd <= 0)) {
    return res.status(400).json({ message: "pointsToAdd must be a positive number" });
  }

  // If redeeming points, check value
  if (pointsToUse !== undefined && (typeof pointsToUse !== "number" || pointsToUse <= 0)) {
    return res.status(400).json({ message: "pointsToUse must be a positive number" });
  }

  // All good → move to controller
  next();
};
