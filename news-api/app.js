const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
// DB Related
const Sequelize = require("sequelize");
const SequelizeFactory = require("./db/SequelizeFactory");
const ModelCacheFactory = require("./db/ModelCacheFactory");
const DBManager = require("./db/DBManager");
//

const newsFeedRoute = require("./routes/NewsFeedRoute");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/news", newsFeedRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.end();
});

const port = 3000;
app.set("port", port);

const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const DbOptions = {
  MYSQL_DATABASE: "newsfeed_db",
  MYSQL_USER: "root",
  MYSQL_PASS: "YOUR_MYSQL_ROOT_PASSWORD",
  MYSQL_HOST: "localhost",
};

const sequelizeInstance = new SequelizeFactory().init(
  DbOptions.MYSQL_DATABASE,
  DbOptions.MYSQL_USER,
  DbOptions.MYSQL_PASS,
  DbOptions.MYSQL_HOST
);
DBManager.setModelCache(new ModelCacheFactory().init(sequelizeInstance, Sequelize));

server.listen(port);
server.on("error", onError);
