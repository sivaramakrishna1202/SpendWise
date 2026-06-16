const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getSummary, getByCategory, getOverTime } = require("../controllers/dashboardController");

const router = express.Router();
router.use(authMiddleware);

router.get("/summary", getSummary);
router.get("/by-category", getByCategory);
router.get("/over-time", getOverTime);

module.exports = router;
