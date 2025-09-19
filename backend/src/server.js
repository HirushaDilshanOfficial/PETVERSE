import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory path and load env FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

import express from "express";
import cors from "cors"

import serviceRoutes from "./Routes/serviceRoutes.js";

import { connectDB } from "./Config/db.js";
import rateLimiter from "./Middleware/rateLimiter.js"


const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], 
}));

app.use(express.json()); //this middleware will parse JSON bodies
app.use(rateLimiter);
/*
app.use((req,res,next)=>{
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next(); 
});
*/
app.use("/api/services", serviceRoutes);

connectDB().then(()=>{
  app.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});
});

