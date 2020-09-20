"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("news_entries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: Sequelize.STRING,
      smallImage: { type: Sequelize.STRING, field: "small_image" },
      content: Sequelize.TEXT,
      date: Sequelize.INTEGER, // YYYYMMDD
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("news_entries");
  },
};
