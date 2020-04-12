'use strict'

const app     = require('electron').app
const chalk   = require('chalk')
const fs      = require('fs')
const path    = require('path')
const program = require('commander')

const release = require('../common/release')
const {defaults, mode} = require('../common/config')

var exit  = {
  exit : function(code) {
    app.exit(code);
  }
}

function error(msg, more='') {
  console.log(chalk.bold.red("error:"), msg)
  if ( more.length > 0)
    console.log(more)
  return exit
}

function warn(msg, more) {
  console.log(chalk.bold.cyan("warn:"), msg)
  if ( more.length > 0)
    console.log(more)
}

function info(msg, more) {
  console.log(chalk.bold.yellow("info:"), msg)
  if ( more.length > 0)
    console.log(more)
}

function debug(msg, more) {
  console.log(chalk.bold.green("debug:"), msg)
  if ( more.length > 0)
    console.log(more)
}

function dirExists(path) { return fs.existsSync(path) && fs.lstatSync(path).isDirectory(); }
function fileExists(path) { fs.existsSync(path) && fs.lstatSync(path).isFile(); }

program
  .storeOptionsAsProperties(false)
  .name(release.name)  
  .version(release.version, '-V, --version')
  .helpOption('-h, --help', 'Display this help message')
  .option('-d, --debug', "Output debug info")
  .option('-s, --silent', "Hide all output")
  .arguments('<input>').action( (input) => {
    let abs = path.normalize(process.cwd() + '/' + input);
    if ( !fileExists(abs))
      error('Could not find file `' + abs + `'`).exit(0);
  })



function argParse (processArgs) {
  program.parse(processArgs)

  return {
    argc : Object.keys(program.opts()).length,
    argv : program.opts()
  }
}

module.exports = {
  argParse,
  error,
  warn,
  info,
  debug
}