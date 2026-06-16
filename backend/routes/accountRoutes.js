const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { listAccounts, createAccount, updateAccount, deleteAccount } = require("../controllers/accountController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", listAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
