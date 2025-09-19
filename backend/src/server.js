import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import { connectDB } from './Config/db.js';
import ratingsRoutes from "./Routes/RatingsRoute.js";
import rateLimiter from "./Middleware/rateLimiter.js";
import contactRoutes from "./Routes/ContactRoute.js";
import advertisementRoutes from "./Routes/AdvertisementRoute.js";

dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5001

connectDB();

// Middleware
app.use(express.json());
app.use(rateLimiter);
app.use(
  cors({
    origin: "http://localhost:5173",
  })

);

// Routes
app.use("/api/ratings", ratingsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/advertisements", advertisementRoutes);






app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });




//mongodb+srv://yuwiy2003_db_user:RScWAnIwhkID5nEP@cluster0.psfpiyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
