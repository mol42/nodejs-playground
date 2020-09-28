const jwt = require("jsonwebtoken");
const jwtKey = "code42_secret_key";

class ControllerHelperService {
  secureController(controller) {
    //---
    return function (req, res) {
      const jwtToken = req.headers["jwt-token"];
      let sessionUser;

      if (!jwtToken || jwtToken == "null" || typeof jwtToken === "undefined") {
        res.json({ error: "ERROR_401" });
        return;
      }

      try {
        sessionUser = jwt.verify(jwtToken, jwtKey);
      } catch (e) {
        // Eger JWT token oynanmis ise verilen key ile cozumlenemez
        // ve hata aldigimiz noktada hatayi kontrol ederek uygun aksiyonu aliriz
        if (e instanceof jwt.JsonWebTokenError) {
          res.json({ error: "ERROR_401" });
          return;
        }
        // otherwise, return a bad request error
        res.json({ error: "ERROR_400" });
        return;
      }

      console.log("sessionUser", sessionUser);

      controller(req, res, sessionUser);
    };
  }
}

module.exports = new ControllerHelperService();
