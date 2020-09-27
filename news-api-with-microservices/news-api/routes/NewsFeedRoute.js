const express = require("express");
const router = express.Router();
const NewsFeedController = require("../controllers/NewsFeedController");

// /news/all
router.get("/all", function (req, res, next) {
  NewsFeedController.fetchAllNewsEntries(req, res);
});

// /news/last7days
router.get("/last7days", function (req, res, next) {
  NewsFeedController.fetchLast7Days(req, res);
});

router.post("/update", function (req, res, next) {
  NewsFeedController.updateNews(req, res);
});

module.exports = router;
