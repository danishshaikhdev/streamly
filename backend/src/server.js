import express from 'express';
import "dotenv/config.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from './lib/db.js';

// Initialize Express App
const app = express();

// Define Port
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth/", authRoutes);

// Start Server and Connect to Database
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});