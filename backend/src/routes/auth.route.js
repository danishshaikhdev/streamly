import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";

// Initialize Router
const router = express.Router();

// Define Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Export Router
export default router;