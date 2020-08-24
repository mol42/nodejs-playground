const http = require("http");
const fs = require("fs");
const moment = require("moment");

const port = process.env.PORT || 2222;

const simpleHandler = function (req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>Hello, World!</h1>");
};

const todayDateHandler = function (req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(`<h1>Today is ${moment().format("DD/MM/YYYY HH:mm:ss")}</h1>`);
};

const myProfileHandler = function (req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(`{"name" : "Tayfun"}`);
};

const noPageFoundHandler = function (res, res) {
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.end("<h1>No page found !</h1>");
};

const indexHtmlHandler = function (req, res) {
  fs.readFile("index.html", "utf8", function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.end();
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  console.log(req.url);
  if (req.url === "/simple") {
    simpleHandler(req, res);
  } else if (req.url === "/index.html") {
    indexHtmlHandler(req, res);
  } else if (req.url === "/today") {
    todayDateHandler(req, res);
  } else if (req.url === "/my-profile") {
    myProfileHandler(req, res);
  } else {
    noPageFoundHandler(req, res);
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
