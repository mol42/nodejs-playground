const jwt = require("jsonwebtoken");
const messageQueueService = require("../services/MQClientService");

const NewsFeedController = {};
const jwtKey = "code42_secret_key";

NewsFeedController.fetchAllNewsEntries = async function (req, res) {
  const resultAsJsonString = await messageQueueService.callRPCQueue(
    "code42_news_queue",
    JSON.stringify({
      command: "FETCH_ALL_NEWS_ENTRIES",
      data: {}
    })
  );
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
};

NewsFeedController.fetchLast7Days = async function (req, res) {
  const resultAsJsonString = await messageQueueService.callRPCQueue(
    "code42_news_queue",
    JSON.stringify({
      command: "FETCH_LAST_7_DAYS",
      data: {}
    })
  );
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
};

NewsFeedController.updateNews = async function (req, res) {
  // jwtToken session kontrolu icin kullaniyoruz
  const jwtToken = req.headers["jwt-token"];
  let resultAsJsonString;
  let sessionUser;
  console.log("jwtToken", jwtToken);
  try {
    sessionUser = jwt.verify(jwtToken, jwtKey);
  } catch (e) {
    // Eger JWT token oynanmis ise verilen key ile cozumlenemez
    // ve hata aldigimiz noktada hatayi kontrol ederek uygun aksiyonu aliriz
    if (e instanceof jwt.JsonWebTokenError) {
      resultAsJsonString = JSON.stringify({ error: "ERROR_401" });
    }
    // otherwise, return a bad request error
    resultAsJsonString = JSON.stringify({ error: "ERROR_400" });
  }

  if (!resultAsJsonString) {
    console.log("calling update sessionUser", sessionUser);
    resultAsJsonString = await messageQueueService.callRPCQueue(
      "code42_news_queue",
      JSON.stringify({
        command: "UPDATE_NEWS",
        data: {},
        sessionUser
      })
    );
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
};

module.exports = NewsFeedController;
