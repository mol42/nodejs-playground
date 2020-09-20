const Sequelize = require("sequelize");

class SequelizeFactory {
  init(database, username, password, host) {
    this.sequelize = new Sequelize(database, username, password, {
      host,
      dialect: "mysql",
      pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });

    return this.sequelize;
  }

  getInstance() {
    return this.sequelize;
  }
}

module.exports = SequelizeFactory;
