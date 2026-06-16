const mongoose = require("mongoose");
const Category = require("../models/Category");

function categoryResponse(doc) {
  return {
    id: doc._id.toString(),
    user_id: doc.user_id ? doc.user_id.toString() : null,
    name: doc.name,
    icon: doc.icon || "📁",
    color: doc.color || "#737373",
  };
}

// GET /categories/
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [
        { user_id: null },
        { user_id: new mongoose.Types.ObjectId(req.user.id) },
      ],
    });
    res.json(categories.map(categoryResponse));
  } catch (error) {
    console.error("List categories error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// POST /categories/
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ detail: "Name is required" });
    }

    const doc = await Category.create({
      user_id: new mongoose.Types.ObjectId(req.user.id),
      name,
      icon: icon || "📁",
      color: color || "#6366f1",
    });

    res.status(201).json(categoryResponse(doc));
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// PUT /categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ detail: "Category not found" });
    }
    if (category.user_id && category.user_id.toString() !== req.user.id) {
      return res.status(403).json({ detail: "Cannot edit this category" });
    }
    if (!category.user_id) {
      return res.status(403).json({ detail: "Cannot edit system categories" });
    }

    const updateData = {};
    if (req.body.name != null) updateData.name = req.body.name;
    if (req.body.icon != null) updateData.icon = req.body.icon;
    if (req.body.color != null) updateData.color = req.body.color;

    if (Object.keys(updateData).length > 0) {
      await Category.updateOne({ _id: req.params.id }, { $set: updateData });
    }

    const updated = await Category.findById(req.params.id);
    res.json(categoryResponse(updated));
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};

// DELETE /categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ detail: "Category not found" });
    }
    if (!category.user_id) {
      return res.status(403).json({ detail: "Cannot delete system categories" });
    }
    if (category.user_id.toString() !== req.user.id) {
      return res.status(403).json({ detail: "Cannot delete this category" });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ detail: "Server error" });
  }
};
