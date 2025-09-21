import mongoose from "mongoose";

// mongoose.connect() returns a promise
// mongoose is an ODM - Object Data Modeling library for MongoDB and Node.js

// Connect to MongoDB
export const connectDB = async () => {
  try {
    // use connect method to connect to the database
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB:", error);
    // Exit process with failure - 1 means exit with failure
    process.exit(1);
  }
};
