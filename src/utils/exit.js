const {errorLog} = require("./log");

const exit = (msg) => {
    errorLog(msg);
    process.exit(1);
}

module.exports = exit;