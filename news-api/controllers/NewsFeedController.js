const Sequelize = require("sequelize");
const DBManager = require("../db/DBManager");
const MNC = require("../db/ModelNameConstants");
const moment = require("moment");

const NewsFeedController = {};
const Op = Sequelize.Op;

function getFormattedDateOf7DaysBefore() {
  const nowMoment = moment();
  return nowMoment.subtract(7, "days").format("YYYYMMDD");
}

NewsFeedController.fetchAllNewsEntries = async function (req, res) {
  try {
    const NewsEntryModel = DBManager.getModelCache().getModel(MNC.NewsEntryModel);
    const newsEntries = await NewsEntryModel.findAll();
    res.json(newsEntries);
  } catch (err) {
    console.log(err);
    res.json({ error: "error" });
  }
};

NewsFeedController.fetchLast7Days = async function (req, res) {
  try {
    const NewsEntryModel = DBManager.getModelCache().getModel(MNC.NewsEntryModel);
    const formatted7DaysBefore = getFormattedDateOf7DaysBefore();
    const newsEntries = await NewsEntryModel.findAll({
      where: {
        date: {
          [Op.gte]: Number(formatted7DaysBefore),
        },
      },
    });
    res.json(newsEntries);
  } catch (err) {
    res.json({ error: "error" });
  }
};

module.exports = NewsFeedController;
