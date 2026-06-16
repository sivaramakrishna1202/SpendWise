const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
    limit_amount: { type: Number, required: true, min: 0 },
  },
  { collection: "budgets" }
);

module.exports = mongoose.model("Budget", budgetSchema);
