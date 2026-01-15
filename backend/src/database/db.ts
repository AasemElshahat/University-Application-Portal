import mongoose from "mongoose";
import { config } from "../config/config";

export const connectDB = async () => {
  try{
    await mongoose.connect(config.db.connectionString);
    console.log("Successfully connected to MongoDB")
  } catch (error){
    console.log("Error connecting to MongoDB:", error)
    process.exit(1);
  }
};