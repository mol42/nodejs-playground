const http = require("http");
const fs = require("fs");

const port = process.env.PORT;

const server = http.createServer((req, res) => {
  
  if (req.url === "/simple/hello-world") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Hello, World!</h1>");
  } else if (req.url === "/index.html") {
    fs.readFile("index.html", "utf8", function (err, data) {
      if (err) {
        res.statusCode = 500;
        res.end();
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    });
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Sorry No page found</h1>");
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
