// controllers/pointTransaction.js
import Points from "../Models/PointTransaction.js";

// Add points
export const addPoints = async (req, res) => {
  const { userId, pointsToAdd } = req.body;
  try {
    let userPoints = await Points.findOne({ userID: userId });
    if (!userPoints) {
      userPoints = new Points({ userID: userId, loyalty_points: pointsToAdd });
    } else {
      userPoints.loyalty_points += pointsToAdd;
    }
    await userPoints.save();
    res.json({ totalPoints: userPoints.loyalty_points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Redeem points
export const redeemPoints = async (req, res) => {
  const { userId, pointsToUse } = req.body;
  try {
    const userPoints = await Points.findOne({ userID: userId });
    if (!userPoints || userPoints.loyalty_points < pointsToUse) {
      return res.status(400).json({ message: "Not enough points" });
    }
    userPoints.loyalty_points -= pointsToUse;
    await userPoints.save();
    res.json({ totalPoints: userPoints.loyalty_points });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get points
export const getPoints = async (req, res) => {
  const { userId } = req.params;
  try {
    const userPoints = await Points.findOne({ userID: userId });
    res.json({ totalPoints: userPoints ? userPoints.loyalty_points : 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
