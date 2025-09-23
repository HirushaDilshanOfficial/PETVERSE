import mongoose from "mongoose";
import User from "./src/Models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const checkDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all users
    const users = await User.find({});
    console.log(`\n📊 Total users in database: ${users.length}`);

    if (users.length > 0) {
      console.log("\n👥 Users in database:");
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phoneNumber}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Firebase UID: ${user.firebaseUid}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   ID: ${user._id}`);
      });
    } else {
      console.log("❌ No users found in database");
    }

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDatabase();
