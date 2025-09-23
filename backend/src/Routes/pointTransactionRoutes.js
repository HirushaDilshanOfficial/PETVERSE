import express from "express";
import { addPoints, redeemPoints, getPoints } from "../Controllers/pointTransaction.js";
import { validatePoints } from "../Middleware/PointTransaction.js";

const router = express.Router();

router.post("/add", validatePoints, addPoints);
router.post("/redeem", validatePoints, redeemPoints);
router.get("/:userId", getPoints);

export default router;
