const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    budget_id: { type: mongoose.Schema.Types.ObjectId, ref: "Budget", required: true },
    threshold_pct: { type: Number, default: 90 },
    triggered_at: { type: Date, default: null },
  },
  { collection: "alerts" }
);

module.exports = mongoose.model("Alert", alertSchema);
