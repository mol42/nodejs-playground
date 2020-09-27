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

module.exports = AuthController;
