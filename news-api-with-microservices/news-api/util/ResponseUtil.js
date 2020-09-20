class ResponseUtil {
  sendJSON(res, jsonAsString) {
    res.statusCode = 200;
    // res.setEncoding('utf8');
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(jsonAsString);
  }

  sendHTMLString(res, htmlString) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(htmlString);
  }
}

module.exports = new ResponseUtil();
