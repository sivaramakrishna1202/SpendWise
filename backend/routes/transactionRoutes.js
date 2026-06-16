const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { exportTransactions, listTransactions, createTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");

const router = express.Router();
router.use(authMiddleware);

router.get("/export", exportTransactions);   // Must be before /:id
router.get("/", listTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
