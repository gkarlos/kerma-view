/** @module*/

//===-- util/cl.js ----------------------------------------------===//
//
// Part of the kerma project
//
//===------------------------------------------------------------===//
//
// This module includes command line utilities such us logging and 
// argument parsing. 
//
// Moreover it defines a standard arg parser for the application
//
//===------------------------------------------------------------===//
'use strict'

const app        = require('electron').app
const chalk      = require('chalk')
const path       = require('path')
const {Command}  = require('commander')

const release    = require('../common/release')
const config     = require('../common/config')
const defaults   = require('../common/config').defaults
const mode       = require('../common/config').mode
const fileExists = require('../util/fs').fileExists
const dirExists  = require('../util/fs').dirExists

var maybeExit = {
  exit: function(code) { 
    console.log("bout to exit")
    if ( config.VERBOSE_LEVEL > 0)
      console.log("Exiting...");
    app.exit(code); 
  }
}

function normalizeLogDetails(details) {
  if ( details == null)
    return "null"
  else if ( typeof details === 'object' )
    return JSON.stringify(details)
  return details
}

/**
 * Utility function that prints the details part of a log message
 */
function printLogDetails(details) {
  let lines = normalizeLogDetails(details).split('\n')
  for ( let i = 0; i < lines.length; ++i)
    console.log("  " + lines[i])
}

/** 
* Wrapper for calling log functions with a given prefix
*
* @param {prefix} - A prefix to be applied
*/
function writeWithPrefix(prefix) {
  let write = function(msg, details) {
    console.log(prefix, msg)
    if ( details !== undefined )
      printLogDetails(details)
    return maybeExit;
  }
  return write;
}

const log = {
  error : writeWithPrefix(chalk.bold.red("error:")),
  warn  : writeWithPrefix(chalk.bold.yellow("warn:")),
  info  : writeWithPrefix(chalk.bold.cyan("info:")),
  debug : writeWithPrefix(chalk.bold.green("debug:"))
}
      
const arg = {
  parse: function(args) {
    let parser = new Command();
    parser.exitOverride();
    parser.storeOptionsAsProperties(false)
      .name(release.name)  
      .version(release.version, '-V, --version')
      .helpOption('-h, --help', 'Display this help message')
      .option('-d, --debug', "Output debug info")
      .option('-s, --silent', "Hide all output")
      .arguments('<input>').action( (input) => {
        let abs = path.normalize(process.cwd() + '/' + input);
        if ( !fileExists(abs))
          log.error('Could not find file `' + abs + `'`).exit(2);
      });
      
      try {
        parser.parse(args, { from: 'electron'})
      } catch(err) {
        app.exit(0); //exit with 0 to avoid verbose output when `npm start`
      }
    
    return {
      argc: Object.keys(parser.opts()).length,
      argv: parser.opts()
    }
  }
}

module.exports = {
  log,
  arg
}