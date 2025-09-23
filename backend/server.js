import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // <-- add this
import connectDB from "./src/Config/db.js";
import appointmentRoutes from "./src/Routes/appointmentRoutes.js";
import pointTransactionRoutes from "./src/Routes/pointTransactionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({ origin: "http://localhost:3000" }));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/appointments", appointmentRoutes);
app.use("/api/points", pointTransactionRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
