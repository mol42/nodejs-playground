// initialize dotenv
require("dotenv").config();

const amqp = require("amqplib/callback_api");
const moment = require("moment");
const MNC = require("./db/ModelNameConstants");
//
const Sequelize = require("sequelize");
const SequelizeFactory = require("./db/SequelizeFactory");
const ModelCacheFactory = require("./db/ModelCacheFactory");
const DBManager = require("./db/DBManager");
// INITIALIZE DB
const DbOptions = {
  MYSQL_DATABASE: "newsfeed_db",
  MYSQL_USER: "root",
  MYSQL_PASS: "r00t_1234G",
  MYSQL_HOST: "localhost"
};

const sequelizeInstance = new SequelizeFactory().init(
  DbOptions.MYSQL_DATABASE,
  DbOptions.MYSQL_USER,
  DbOptions.MYSQL_PASS,
  DbOptions.MYSQL_HOST
);
DBManager.setModelCache(new ModelCacheFactory().init(sequelizeInstance, Sequelize));
//

function getFormattedDateOf7DaysBefore() {
  const nowMoment = moment();
  return nowMoment.subtract(7, "days").format("YYYYMMDD");
}

const news_fetchAllNewsEntries = async function () {
  try {
    const NewsEntryModel = DBManager.getModelCache().getModel(MNC.NewsEntryModel);
    const newsEntries = await NewsEntryModel.findAll();
    return JSON.stringify(newsEntries);
  } catch (err) {
    console.log(err);
    return JSON.stringify({ error: "error" });
  }
};

const news_fetchLast7Days = async function () {
  try {
    const NewsEntryModel = DBManager.getModelCache().getModel(MNC.NewsEntryModel);
    const formatted7DaysBefore = getFormattedDateOf7DaysBefore();
    const newsEntries = await NewsEntryModel.findAll({
      where: {
        date: {
          [Op.gte]: Number(formatted7DaysBefore)
        }
      }
    });
    return JSON.stringify(newsEntries);
  } catch (err) {
    return JSON.stringify({ error: "error" });
  }
};

const news_updateNews = async function (data, sessionUser) {
  try {
    console.log("sessionUser", sessionUser);
    return JSON.stringify({ result: "ok" });
  } catch (err) {
    return JSON.stringify({ error: "ERROR_99999" });
  }
};
/*
 **********************************************************************
 */
amqp.connect(`amqp://localhost?heartbeat=10`, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "code42_news_queue";

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(" [x] Awaiting RPC requests");
    channel.consume(queue, async function reply(msg) {
      //-----
      const commandDataJSON = msg.content.toString();
      console.log("incoming command", commandDataJSON);
      const commandData = JSON.parse(commandDataJSON);
      const responseAsJSONString = { data: null };
      const { command, data, sessionUser } = commandData;
      //------
      if (command === "FETCH_ALL_NEWS_ENTRIES") {
        responseAsJSONString.data = await news_fetchAllNewsEntries(data);
      } else if (command === "FETCH_LAST_7_DAYS") {
        responseAsJSONString.data = await news_fetchLast7Days(data);
      } else if (command === "UPDATE_NEWS") {
        responseAsJSONString.data = await news_updateNews(data, sessionUser);
      }
      //------
      if (responseAsJSONString.data !== null) {
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(responseAsJSONString.data), {
          correlationId: msg.properties.correlationId
        });

        channel.ack(msg);
      } else {
        channel.ack(msg);
      }
    });
  });
});
