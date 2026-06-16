const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["bank", "cash", "credit", "upi"] },
    balance: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "accounts" }
);

module.exports = mongoose.model("Account", accountSchema);
