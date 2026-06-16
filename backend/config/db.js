const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let mongoURL = process.env.MONGODB_URL || "mongodb://localhost:27017/spendwise";
    // Ensure the database name is specified in the connection string
    if (mongoURL.includes("mongodb.net/") && !mongoURL.includes("mongodb.net/spendwise")) {
      mongoURL = mongoURL.replace("mongodb.net/", "mongodb.net/spendwise");
    }
    await mongoose.connect(mongoURL);
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
