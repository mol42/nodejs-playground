const express = require("express");
const router = express.Router();
const NewsFeedController = require("../controllers/NewsFeedController");

router.get("/all", function (req, res, next) {
  NewsFeedController.fetchAllNewsEntries(req, res);
});

router.get("/last7days", function (req, res, next) {
  NewsFeedController.fetchLast7Days(req, res);
});

module.exports = router;
