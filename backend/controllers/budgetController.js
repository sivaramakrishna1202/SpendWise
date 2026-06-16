const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const Alert = require("../models/Alert");

function budgetResponse(doc) {
  return {
    id: doc._id.toString(),
    user_id: doc.user_id.toString(),
    category_id: doc.category_id.toString(),
    month: doc.month,
    year: doc.year,
    limit_amount: Math.round(doc.limit_amount * 100) / 100,
  };
}

// GET /budgets/status
exports.getBudgetStatus = async (req, res) => {
  try {
    const now = new Date();
    const m = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const y = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const budgets = await Budget.find({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      month: m,
      year: y,
    });

    const results = [];
    for (const budget of budgets) {
      const cat = await Category.findById(budget.category_id);
      const catName = cat ? cat.name : "Unknown";
      const catColor = cat ? cat.color || "#737373" : "#737373";
      const catIcon = cat ? cat.icon || "📁" : "📁";

      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = m < 12 ? new Date(Date.UTC(y, m, 1)) : new Date(Date.UTC(y + 1, 0, 1));

      const agg = await Transaction.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(req.user.id),
            category_id: budget.category_id,
            type: "expense",
            date: { $gte: start, $lt: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const spent = agg.length > 0 ? Math.round(agg[0].total * 100) / 100 : 0;
      const limitAmt = Math.round(budget.limit_amount * 100) / 100;
      const pct = limitAmt > 0 ? Math.round(((spent / limitAmt) * 100) * 10) / 10 : 0;

      results.push({
        id: budget._id.toString(),
        category_id: budget.category_id.toString(),
        category_name: catName,
        category_color: catColor,
        category_icon: catIcon,
        month: m,
        year: y,
        limit_amount: limitAmt,
        spent_amount: spent,
        percentage: pct,
        exceeded: pct >= 100,
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Budget status error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// GET /budgets/
exports.listBudgets = async (req, res) => {
  try {
    const now = new Date();
    const query = { user_id: new mongoose.Types.ObjectId(req.user.id) };

    if (req.query.month) query.month = parseInt(req.query.month);
    if (req.query.year) query.year = parseInt(req.query.year);
    if (!req.query.month && !req.query.year) {
      query.month = now.getMonth() + 1;
      query.year = now.getFullYear();
    }

    const budgets = await Budget.find(query);
    res.json(budgets.map(budgetResponse));
  } catch (error) {
    console.error("List budgets error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// POST /budgets/
exports.createBudget = async (req, res) => {
  try {
    const { category_id, month, year, limit_amount } = req.body;

    if (!category_id || !month || !year || !limit_amount) {
      return res.status(400).json({ detail: "All fields are required" });
    }

    const existing = await Budget.findOne({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      category_id: new mongoose.Types.ObjectId(category_id),
      month,
      year,
    });
    if (existing) {
      return res.status(400).json({ detail: "Budget already exists for this category and month" });
    }

    const doc = await Budget.create({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      category_id: new mongoose.Types.ObjectId(category_id),
      month,
      year,
      limit_amount: Math.round(limit_amount * 100) / 100,
    });

    await Alert.create({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      budget_id: doc._id,
      threshold_pct: 90,
      triggered_at: null,
    });

    res.status(201).json(budgetResponse(doc));
  } catch (error) {
    console.error("Create budget error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// PUT /budgets/:id
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (!budget) {
      return res.status(404).json({ detail: "Budget not found" });
    }

    const updateData = {};
    if (req.body.category_id != null) updateData.category_id = new mongoose.Types.ObjectId(req.body.category_id);
    if (req.body.month != null) updateData.month = req.body.month;
    if (req.body.year != null) updateData.year = req.body.year;
    if (req.body.limit_amount != null) updateData.limit_amount = Math.round(req.body.limit_amount * 100) / 100;

    if (Object.keys(updateData).length > 0) {
      await Budget.updateOne({ _id: req.params.id }, { $set: updateData });
    }

    const updated = await Budget.findById(req.params.id);
    res.json(budgetResponse(updated));
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// DELETE /budgets/:id
exports.deleteBudget = async (req, res) => {
  try {
    const result = await Budget.deleteOne({
      _id: req.params.id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: "Budget not found" });
    }
    await Alert.deleteMany({ budget_id: new mongoose.Types.ObjectId(req.params.id) });
    res.status(204).send();
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};
