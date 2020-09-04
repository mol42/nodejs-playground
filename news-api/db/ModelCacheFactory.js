const NewsEntryModel = require("../models/newsentrymodel");
const MNC = require("./ModelNameConstants");

class ModelCacheFactory {
  constructor(sequelize) {
    this.modelCache = {};
    this.sequelize = sequelize;
  }

  init(sequelize, Sequelize) {
    this.sequelize = sequelize;
    this.DataTypes = Sequelize;
    this.initModels();
    return this;
  }

  initModels() {
    const sequelize = this.sequelize;
    const DataTypes = this.DataTypes;

    this.modelCache[MNC.NewsEntryModel] = NewsEntryModel(sequelize, DataTypes);
  }

  getModel(modelName) {
    return this.modelCache[modelName];
  }
}

module.exports = ModelCacheFactory;
