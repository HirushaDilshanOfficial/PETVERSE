import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const checkDatabaseDetails = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get database info
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`📚 Database name: ${dbName}`);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📦 Collections in database (${collections.length}):`);

    for (const collection of collections) {
      console.log(`\n📋 Collection: ${collection.name}`);

      // Get document count
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   📊 Document count: ${count}`);

      // Get sample documents
      if (count > 0) {
        const samples = await db
          .collection(collection.name)
          .find({})
          .limit(2)
          .toArray();
        console.log(`   📄 Sample documents:`);
        samples.forEach((doc, index) => {
          console.log(`      ${index + 1}. ID: ${doc._id}`);
          if (doc.fullName) console.log(`         Name: ${doc.fullName}`);
          if (doc.email) console.log(`         Email: ${doc.email}`);
          if (doc.role) console.log(`         Role: ${doc.role}`);
          if (doc.title) console.log(`         Title: ${doc.title}`);
          if (doc.price) console.log(`         Price: $${doc.price}`);
        });
      }
    }

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkDatabaseDetails();
