const messageQueueService = require("../services/MQClientService");
const CHS = require("../services/ControllerHelperService");

const NewsFeedController = {};

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

NewsFeedController.updateNews = CHS.secureController(async function (req, res, sessionUser) {
  const resultAsJsonString = await messageQueueService.callRPCQueue(
    "code42_news_queue",
    JSON.stringify({
      command: "UPDATE_NEWS",
      data: {},
      sessionUser
    })
  );

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(resultAsJsonString);
});

module.exports = NewsFeedController;
