const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    icon: { type: String, default: "📁" },
    color: { type: String, default: "#737373" },
  },
  { collection: "categories" }
);

module.exports = mongoose.model("Category", categorySchema);
