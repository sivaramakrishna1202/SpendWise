const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const Category = require("../models/Category");
const Budget = require("../models/Budget");
const Alert = require("../models/Alert");

function txnResponse(doc) {
  return {
    id: doc._id.toString(),
    user_id: doc.user_id.toString(),
    account_id: doc.account_id.toString(),
    category_id: doc.category_id.toString(),
    amount: Math.round(doc.amount * 100) / 100,
    type: doc.type,
    description: doc.description || "",
    date: doc.date instanceof Date ? doc.date.toISOString() : String(doc.date),
    created_at: doc.created_at instanceof Date ? doc.created_at.toISOString() : String(doc.created_at),
  };
}

async function checkAndTriggerAlerts(userId, categoryId, txnDate) {
  const month = txnDate.getMonth() + 1;
  const year = txnDate.getFullYear();

  const budget = await Budget.findOne({
    user_id: new mongoose.Types.ObjectId(userId),
    category_id: new mongoose.Types.ObjectId(categoryId),
    month,
    year,
  });
  if (!budget) return;

  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = month < 12 ? new Date(Date.UTC(year, month, 1)) : new Date(Date.UTC(year + 1, 0, 1));

  const agg = await Transaction.aggregate([
    {
      $match: {
        user_id: new mongoose.Types.ObjectId(userId),
        category_id: new mongoose.Types.ObjectId(categoryId),
        type: "expense",
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const spent = agg.length > 0 ? agg[0].total : 0;

  const alerts = await Alert.find({ budget_id: budget._id });
  for (const alert of alerts) {
    const threshold = alert.threshold_pct || 90;
    if (spent >= (budget.limit_amount * threshold) / 100) {
      if (!alert.triggered_at) {
        await Alert.updateOne({ _id: alert._id }, { $set: { triggered_at: new Date() } });
      }
    }
  }

  if (alerts.length === 0) {
    const alertDoc = {
      user_id: new mongoose.Types.ObjectId(userId),
      budget_id: budget._id,
      threshold_pct: 90,
      triggered_at: null,
    };
    if (spent >= budget.limit_amount * 0.9) {
      alertDoc.triggered_at = new Date();
    }
    await Alert.create(alertDoc);
  }
}

// GET /transactions/export
exports.exportTransactions = async (req, res) => {
  try {
    const query = { user_id: new mongoose.Types.ObjectId(req.user.id) };
    if (req.query.start_date) {
      query.date = { ...query.date, $gte: new Date(req.query.start_date) };
    }
    if (req.query.end_date) {
      query.date = { ...query.date, $lte: new Date(req.query.end_date) };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }).limit(5000);

    const catIds = [...new Set(transactions.map((t) => t.category_id.toString()))];
    const catDocs = await Category.find({ _id: { $in: catIds } });
    const catMap = {};
    catDocs.forEach((c) => { catMap[c._id.toString()] = c.name; });

    const accIds = [...new Set(transactions.map((t) => t.account_id.toString()))];
    const accDocs = await Account.find({ _id: { $in: accIds } });
    const accMap = {};
    accDocs.forEach((a) => { accMap[a._id.toString()] = a.name; });

    let csv = "Date,Type,Category,Account,Amount,Description\n";
    for (const t of transactions) {
      const dateStr = t.date instanceof Date ? t.date.toISOString().split("T")[0] : t.date;
      const cat = catMap[t.category_id.toString()] || "Unknown";
      const acc = accMap[t.account_id.toString()] || "Unknown";
      const desc = (t.description || "").replace(/"/g, '""');
      csv += `${dateStr},${t.type},"${cat}","${acc}",${Math.round(t.amount * 100) / 100},"${desc}"\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
    res.send(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// GET /transactions/
exports.listTransactions = async (req, res) => {
  try {
    const query = { user_id: new mongoose.Types.ObjectId(req.user.id) };
    if (req.query.start_date) query.date = { ...query.date, $gte: new Date(req.query.start_date) };
    if (req.query.end_date) query.date = { ...query.date, $lte: new Date(req.query.end_date) };
    if (req.query.category_id) query.category_id = new mongoose.Types.ObjectId(req.query.category_id);
    if (req.query.type) query.type = req.query.type;
    if (req.query.account_id) query.account_id = new mongoose.Types.ObjectId(req.query.account_id);

    const transactions = await Transaction.find(query).sort({ date: -1 }).limit(500);
    res.json(transactions.map(txnResponse));
  } catch (error) {
    console.error("List transactions error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// POST /transactions/
exports.createTransaction = async (req, res) => {
  try {
    const { account_id, category_id, amount, type, description, date } = req.body;

    if (!account_id || !category_id || !amount || !type || !date) {
      return res.status(400).json({ detail: "Missing required fields" });
    }

    const account = await Account.findOne({
      _id: account_id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (!account) {
      return res.status(404).json({ detail: "Account not found" });
    }

    const doc = await Transaction.create({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      account_id: new mongoose.Types.ObjectId(account_id),
      category_id: new mongoose.Types.ObjectId(category_id),
      amount: Math.round(amount * 100) / 100,
      type,
      description: description || "",
      date: new Date(date),
      created_at: new Date(),
    });

    const balanceChange = type === "income" ? doc.amount : -doc.amount;
    await Account.updateOne(
      { _id: account_id },
      { $inc: { balance: Math.round(balanceChange * 100) / 100 } }
    );

    if (type === "expense") {
      await checkAndTriggerAlerts(req.user.id, category_id, new Date(date));
    }

    res.status(201).json(txnResponse(doc));
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// PUT /transactions/:id
exports.updateTransaction = async (req, res) => {
  try {
    const txn = await Transaction.findOne({
      _id: req.params.id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (!txn) {
      return res.status(404).json({ detail: "Transaction not found" });
    }

    const updateData = {};
    if (req.body.account_id != null) updateData.account_id = new mongoose.Types.ObjectId(req.body.account_id);
    if (req.body.category_id != null) updateData.category_id = new mongoose.Types.ObjectId(req.body.category_id);
    if (req.body.amount != null) updateData.amount = Math.round(req.body.amount * 100) / 100;
    if (req.body.type != null) updateData.type = req.body.type;
    if (req.body.description != null) updateData.description = req.body.description;
    if (req.body.date != null) updateData.date = new Date(req.body.date);

    if (updateData.amount != null || updateData.type != null) {
      const oldChange = txn.type === "income" ? txn.amount : -txn.amount;
      const newAmount = updateData.amount != null ? updateData.amount : txn.amount;
      const newType = updateData.type != null ? updateData.type : txn.type;
      const newChange = newType === "income" ? newAmount : -newAmount;
      const diff = newChange - oldChange;
      const targetAccount = updateData.account_id || txn.account_id;
      await Account.updateOne(
        { _id: targetAccount },
        { $inc: { balance: Math.round(diff * 100) / 100 } }
      );
    }

    if (Object.keys(updateData).length > 0) {
      await Transaction.updateOne({ _id: req.params.id }, { $set: updateData });
    }

    const updated = await Transaction.findById(req.params.id);
    res.json(txnResponse(updated));
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// DELETE /transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const txn = await Transaction.findOne({
      _id: req.params.id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (!txn) {
      return res.status(404).json({ detail: "Transaction not found" });
    }

    const balanceChange = txn.type === "income" ? txn.amount : -txn.amount;
    await Account.updateOne(
      { _id: txn.account_id },
      { $inc: { balance: Math.round(-balanceChange * 100) / 100 } }
    );

    await Transaction.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};
