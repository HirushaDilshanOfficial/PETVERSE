import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("📍 Database: petverse_db");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    console.log("✅ MONGODB CONNECTED SUCCESSFULLY");
    console.log(
      `📊 Connected to database: ${mongoose.connection.db.databaseName}`
    );
  } catch (error) {
    console.error("❌ Error connecting to MONGODB:", error.message);

    if (error.message.includes("IP") || error.message.includes("whitelist")) {
      console.log("\n🔧 SOLUTION:");
      console.log("1. Go to https://cloud.mongodb.com/");
      console.log("2. Navigate to Network Access");
      console.log("3. Add your current IP address");
      console.log(
        "4. Or allow access from anywhere (0.0.0.0/0) for development\n"
      );
    }

    process.exit(1);
  }
};
