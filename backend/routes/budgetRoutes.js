const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getBudgetStatus, listBudgets, createBudget, updateBudget, deleteBudget } = require("../controllers/budgetController");

const router = express.Router();
router.use(authMiddleware);

router.get("/status", getBudgetStatus);   // Must be before /:id
router.get("/", listBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
