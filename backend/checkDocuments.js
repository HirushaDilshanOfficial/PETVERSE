// Check if user document URLs are stored in MongoDB
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const checkUserDocuments = async () => {
  try {
    console.log("🔍 Checking user documents in MongoDB...");

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("petverse_db");
    const users = db.collection("users");

    // Find the most recent service provider with documents
    const user = await users.findOne(
      {
        role: "serviceProvider",
        "documents.nicFrontPhoto": { $exists: true },
      },
      { sort: { createdAt: -1 } }
    );

    if (user) {
      console.log("👤 Found user with documents:");
      console.log("📧 Email:", user.email);
      console.log("📝 Full Name:", user.fullName);
      console.log("📄 Document URLs:");
      console.log("  📸 NIC Front:", user.documents?.nicFrontPhoto);
      console.log("  📸 NIC Back:", user.documents?.nicBackPhoto);
      console.log("  📸 Face Photo:", user.documents?.facePhoto);
      console.log(
        "  📋 Business Docs Count:",
        user.documents?.businessDocuments?.length || 0
      );

      console.log("🎉 SUCCESS: Document URLs are properly stored in MongoDB!");
    } else {
      console.log("❌ No service provider with documents found");
    }

    await client.close();
  } catch (error) {
    console.error("❌ Error checking documents:", error.message);
  }
};

checkUserDocuments();
