const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/login", function (req, res, next) {
  AuthController.doLogin(req, res);
});

router.post("/refresh", function (req, res, next) {
  AuthController.doRefresh(req, res);
});

router.post("/refresh/custom-token", function (req, res, next) {
  AuthController.doRefreshWithCustomRefreshToken(req, res);
});

module.exports = router;
