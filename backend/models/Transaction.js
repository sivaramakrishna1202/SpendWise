const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ["income", "expense"] },
    description: { type: String, default: "" },
    date: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "transactions" }
);

module.exports = mongoose.model("Transaction", transactionSchema);
