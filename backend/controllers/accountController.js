const mongoose = require("mongoose");
const Account = require("../models/Account");

function accountResponse(doc) {
  return {
    id: doc._id.toString(),
    user_id: doc.user_id.toString(),
    name: doc.name,
    type: doc.type,
    balance: Math.round(doc.balance * 100) / 100,
    created_at: doc.created_at.toISOString(),
  };
}

// GET /accounts/
exports.listAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user_id: new mongoose.Types.ObjectId(req.user.id) });
    res.json(accounts.map(accountResponse));
  } catch (error) {
    console.error("List accounts error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// POST /accounts/
exports.createAccount = async (req, res) => {
  try {
    const { name, type, balance } = req.body;
    if (!name || !type) {
      return res.status(400).json({ detail: "Name and type are required" });
    }

    const doc = await Account.create({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      name,
      type,
      balance: Math.round((balance || 0) * 100) / 100,
      created_at: new Date(),
    });

    res.status(201).json(accountResponse(doc));
  } catch (error) {
    console.error("Create account error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// PUT /accounts/:id
exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (!account) {
      return res.status(404).json({ detail: "Account not found" });
    }

    const updateData = {};
    if (req.body.name != null) updateData.name = req.body.name;
    if (req.body.type != null) updateData.type = req.body.type;
    if (req.body.balance != null) updateData.balance = Math.round(req.body.balance * 100) / 100;

    if (Object.keys(updateData).length > 0) {
      await Account.updateOne({ _id: req.params.id }, { $set: updateData });
    }

    const updated = await Account.findById(req.params.id);
    res.json(accountResponse(updated));
  } catch (error) {
    console.error("Update account error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// DELETE /accounts/:id
exports.deleteAccount = async (req, res) => {
  try {
    const result = await Account.deleteOne({
      _id: req.params.id,
      user_id: new mongoose.Types.ObjectId(req.user.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: "Account not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};
