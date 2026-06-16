const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ detail: "Not authenticated" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY || "dev_secret_key_change_in_production");

    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ detail: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    };

    next();
  } catch (error) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
