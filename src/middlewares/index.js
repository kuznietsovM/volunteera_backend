const jwtMiddleware = require("./jwt.middleware");
const errorMiddleware = require("./error.middleware");

module.exports = {
    jwtMiddleware,
    errorMiddleware
}