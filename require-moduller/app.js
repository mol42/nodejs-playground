// require ile default export ve import örneği
const add = require("./add");

console.log(add(3, 5));

// çoklu import örneği ( module.exports şeklinde yapılan exportlar için )
const { square, multiply } = require("./multi_export");

console.log(square(2));

// çoklu import örneği ( exports.XXX şeklinde yapılan exportlar için )
const { sayHello, sayHi } = require("./only_exports");

sayHello();
