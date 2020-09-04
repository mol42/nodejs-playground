"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NewsEntryModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewsEntryModel.init(
    {
      title: DataTypes.STRING,
      smallImage: { type: DataTypes.STRING, field: "small_image" },
      content: DataTypes.TEXT,
      date: DataTypes.INTEGER, // YYYYMMDD
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: false,
      },
    },
    {
      sequelize,
      // tablo adı buraya !
      modelName: "news_entries",
    }
  );
  return NewsEntryModel;
};
