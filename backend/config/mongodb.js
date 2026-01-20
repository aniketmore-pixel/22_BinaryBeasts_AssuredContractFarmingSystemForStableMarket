import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export const connectMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "contracts_db"
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
