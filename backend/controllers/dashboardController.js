const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const Alert = require("../models/Alert");

// GET /dashboard/summary
exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const m = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const y = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = m < 12 ? new Date(Date.UTC(y, m, 1)) : new Date(Date.UTC(y + 1, 0, 1));
    const userOid = new mongoose.Types.ObjectId(req.user.id);

    const incomeAgg = await Transaction.aggregate([
      { $match: { user_id: userOid, type: "income", date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalIncome = incomeAgg.length > 0 ? Math.round(incomeAgg[0].total * 100) / 100 : 0;

    const expenseAgg = await Transaction.aggregate([
      { $match: { user_id: userOid, type: "expense", date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = expenseAgg.length > 0 ? Math.round(expenseAgg[0].total * 100) / 100 : 0;

    const alerts = await Alert.find({
      user_id: userOid,
      triggered_at: { $ne: null },
    });

    res.json({
      month: m,
      year: y,
      total_income: totalIncome,
      total_expense: totalExpense,
      net_balance: Math.round((totalIncome - totalExpense) * 100) / 100,
      active_alerts: alerts.length,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// GET /dashboard/by-category
exports.getByCategory = async (req, res) => {
  try {
    const now = new Date();
    const m = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const y = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = m < 12 ? new Date(Date.UTC(y, m, 1)) : new Date(Date.UTC(y + 1, 0, 1));

    const results = await Transaction.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.user.id),
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      { $group: { _id: "$category_id", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const categories = [];
    for (const r of results) {
      const cat = await Category.findById(r._id);
      categories.push({
        category_id: r._id.toString(),
        category_name: cat ? cat.name : "Unknown",
        category_color: cat ? cat.color || "#737373" : "#737373",
        category_icon: cat ? cat.icon || "📁" : "📁",
        amount: Math.round(r.total * 100) / 100,
      });
    }

    res.json(categories);
  } catch (error) {
    console.error("By-category error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// GET /dashboard/over-time
exports.getOverTime = async (req, res) => {
  try {
    const days = req.query.days ? parseInt(req.query.days) : 30;
    const now = new Date();
    const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const results = await Transaction.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(req.user.id),
          type: "expense",
          date: { $gte: start },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      results.map((r) => ({
        date: r._id,
        amount: Math.round(r.total * 100) / 100,
      }))
    );
  } catch (error) {
    console.error("Over-time error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};
