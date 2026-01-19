import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// Utility: Normalize role to match PostgreSQL enum
const normalizeRole = (role) => role.trim().toUpperCase();

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const userRole = normalizeRole(role); // "FARMER" or "BUYER"

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert user
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert([{ name, email, password_hash, role: userRole, phone }])
      .select()
      .single();

    if (userError)
      return res
        .status(400)
        .json({ success: false, message: userError.message });

    // Create profile depending on role
    if (userRole === "FARMER") {
      await supabase.from("farmer_profile").insert([{ user_id: newUser.id }]);
    } else if (userRole === "BUYER") {
      await supabase
        .from("buyer_profile")
        .insert([
          { user_id: newUser.id, organization_name: "", buyer_type: "HOTEL" },
        ]);
    }

    // Generate JWT for session management
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      user: newUser,
      token,
      message: "Signup successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role)
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });

    const normalizedRole = normalizeRole(role); // FARMER/BUYER

    // Get user by email
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first!",
      });

    // Check if role matches enum
    if (user.role !== normalizedRole) {
      return res
        .status(403)
        .json({ success: false, message: `You cannot login as ${role}` });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

    // Generate JWT token for session
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    res.json({ success: true, user, token, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
