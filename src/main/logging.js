'use strict';

const chalk = require('chalk')

const log = {
  warn : (msg, details='') => {
    console.log(chalk.bold.magenta("warn:"), msg)
  },
  error : (msg, details='') => {
    console.log(chalk.bold.red("error:"), msg)
  }
}

module.exports = log