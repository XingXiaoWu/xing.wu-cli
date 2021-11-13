const chalk = require('chalk');
const figlet = require('figlet');

const warnLog = (msg) => {
    console.log(chalk.yellow(msg))
}

const errorLog = (msg) => {
    console.log(chalk.red(msg))
}

const successLog = (msg) => {
    console.log(chalk.green(msg))
}

const markLog = (msg) => {
    console.log(chalk.magenta(msg))
}

const figletLog = (msg,callback) => {
    figlet(msg,(err, result)=>{
        successLog(result);
        callback && callback();
    });
}

module.exports = {
    warnLog,
    errorLog,
    successLog,
    markLog,
    figletLog
}