import mongoose from "mongoose";
import User from "./src/Models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const addAdminToDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@petverse.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists:", existingAdmin.fullName);
      console.log("   Email:", existingAdmin.email);
      console.log("   Role:", existingAdmin.role);
    } else {
      // Create admin user in database with Firebase UID from earlier
      const adminData = {
        fullName: "Admin User",
        email: "admin@petverse.com",
        phoneNumber: "0771111111",
        firebaseUid: "29jRO6UIQwQ6ziYnvltMIxjt1112", // From earlier creation
        role: "admin",
        isActive: true,
      };

      const newAdmin = new User(adminData);
      await newAdmin.save();

      console.log("✅ Admin user created successfully!");
      console.log("   Email: admin@petverse.com");
      console.log("   Password: admin123");
      console.log("   Role: admin");
    }

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

addAdminToDatabase();
