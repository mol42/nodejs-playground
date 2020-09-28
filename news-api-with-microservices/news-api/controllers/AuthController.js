const messageQueueService = require("../services/MQClientService");

const AuthController = {};

AuthController.doLogin = async function (req, res) {
  console.log(req.body);
  const { username, password } = req.body;
  const resultAsJsonString = await messageQueueService.callRPCQueue(
    "code42_auth_queue",
    JSON.stringify({
      command: "DO_LOGIN",
      data: { username, password }
    })
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
};

AuthController.doRefresh = async function (req, res) {
  const jwtToken = req.headers["jwt-token"];
  const resultAsJsonString = await messageQueueService.callRPCQueue(
    "code42_auth_queue",
    JSON.stringify({
      command: "DO_REFRESH",
      data: { jwtToken }
    })
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
};

AuthController.doRefreshWithCustomRefreshToken = async function (req, res) {
  const { username, customRefreshToken } = req.body;
  const resultAsJsonString = await messageQueueService.callRPCQueue(
    "code42_auth_queue",
    JSON.stringify({
      command: "DO_REFRESH_WITH_CUSTOM_TOKEN",
      data: { username, customRefreshToken }
    })
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
};

module.exports = AuthController;
