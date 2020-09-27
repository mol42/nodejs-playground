const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/login", function (req, res, next) {
  AuthController.doLogin(req, res);
});

module.exports = router;
