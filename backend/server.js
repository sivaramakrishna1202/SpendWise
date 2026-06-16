const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ── CORS ────────────────────────────────────────────────
const originsRaw = process.env.ALLOWED_ORIGINS || "*";
const origins = originsRaw.split(",").map((o) => o.trim()).filter(Boolean);
const allowAll = origins.includes("*");

app.use(
  cors({
    origin: allowAll ? "*" : origins,
    credentials: !allowAll,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body Parser ─────────────────────────────────────────
app.use(express.json());

// ── Routes ──────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/auth", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);
app.use("/budgets", budgetRoutes);
app.use("/dashboard", dashboardRoutes);

// ── Health Check ────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", app: "SpendWise API" });
});

// ── Color Migration (one-time) ──────────────────────────
async function migrateCategoryColors() {
  const Category = require("./models/Category");
  const colorMap = {
    "#ef4444": "#525252", "#f97316": "#5e5e5e", "#eab308": "#6b6b6b",
    "#22c55e": "#787878", "#3b82f6": "#858585", "#8b5cf6": "#929292",
    "#ec4899": "#9e9e9e", "#10b981": "#ababab", "#06b6d4": "#b8b8b8",
    "#6b7280": "#c4c4c4", "#6366f1": "#858585",
    "#171717": "#525252", "#2e2e2e": "#5e5e5e", "#454545": "#6b6b6b",
    "#5c5c5c": "#787878", "#737373": "#858585", "#8a8a8a": "#929292",
    "#a1a1a1": "#9e9e9e", "#cfcfcf": "#b8b8b8", "#e5e5e5": "#c4c4c4",
  };
  for (const [oldColor, newColor] of Object.entries(colorMap)) {
    const result = await Category.updateMany(
      { color: oldColor },
      { $set: { color: newColor } }
    );
    if (result.modifiedCount > 0) {
      console.log(`  Migrated ${result.modifiedCount} categories: ${oldColor} -> ${newColor}`);
    }
  }
}

// ── Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await migrateCategoryColors();
  app.listen(PORT, () => {
    console.log(`🚀 SpendWise API running on port ${PORT}`);
  });
});
