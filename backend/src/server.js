import express from "express";
import serviceRoutes from "./Routes/serviceRoutes.js";
import { connectDB } from "./Config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./Middleware/rateLimiter.js"

dotenv.config();


const app = express();
const PORT=process.env.PORT || 5001

app.use(express.json()); //this middleware will parse JSON bodies
app.use(rateLimiter)

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

