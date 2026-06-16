const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Category = require("../models/Category");

const SECRET_KEY = process.env.SECRET_KEY || "dev_secret_key_change_in_production";
const TOKEN_EXPIRE_HOURS = 24;

function createToken(userId) {
  return jwt.sign({ sub: userId }, SECRET_KEY, {
    expiresIn: `${TOKEN_EXPIRE_HOURS}h`,
  });
}

function userResponse(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    created_at: user.created_at,
  };
}

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ detail: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ detail: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ detail: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(password.slice(0, 72), salt);

    const user = await User.create({
      email: email.toLowerCase(),
      password_hash,
      name,
      created_at: new Date(),
    });

    const token = createToken(user._id.toString());

    // Seed default categories if none exist
    const count = await Category.countDocuments({ user_id: null });
    if (count === 0) {
      await Category.insertMany([
        { user_id: null, name: "Food & Dining", icon: "🍔", color: "#525252" },
        { user_id: null, name: "Transportation", icon: "🚗", color: "#5e5e5e" },
        { user_id: null, name: "Shopping", icon: "🛍️", color: "#6b6b6b" },
        { user_id: null, name: "Entertainment", icon: "🎬", color: "#787878" },
        { user_id: null, name: "Bills & Utilities", icon: "💡", color: "#858585" },
        { user_id: null, name: "Health", icon: "🏥", color: "#929292" },
        { user_id: null, name: "Education", icon: "📚", color: "#9e9e9e" },
        { user_id: null, name: "Salary", icon: "💰", color: "#ababab" },
        { user_id: null, name: "Freelance", icon: "💻", color: "#b8b8b8" },
        { user_id: null, name: "Other", icon: "📦", color: "#c4c4c4" },
      ]);
    }

    res.status(201).json({
      access_token: token,
      token_type: "bearer",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password.slice(0, 72), user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ detail: "Invalid email or password" });
    }

    const token = createToken(user._id.toString());

    res.json({
      access_token: token,
      token_type: "bearer",
      user: userResponse(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// GET /auth/me
exports.getMe = async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    created_at: req.user.created_at,
  });
};
