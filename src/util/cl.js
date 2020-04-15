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
const color      = require("cli-color")
const path       = require('path')
const {Command}  = require('commander')

const release    = require('../common/release')
const config     = require('../common/config')
const defaults   = config.defaults
const settings   = config.settings
const mode       = config.mode
const fileExists = require('../util/fs').fileExists
const dirExists  = require('../util/fs').dirExists

//
// Some cl writting settings
// 
const TAG = {
  INFO  : { id : 0, txt : "info:",   color : color.bold.cyan},
  WARN  : { id : 1, txt : "warn:",   color : color.bold.yellow },
  ERROR : { id : 2, txt : "error:",  color : color.bold.red },
  DEBUG : { id : 3, txt : "[debug]", color : color.bold.blackBright}
}

var maybeExit = {
  exit: function(code) { 
    if ( config.VERBOSE_LEVEL > 0)
      console.log("Exiting...");
    app.exit(code); 
  }
}

function normalizeLogDetails(details) {
  if ( details == null)
    return "null"
  else if ( typeof details === 'object' )
    return JSON.stringify(details, null, 2)
  return details
}

/**
 * Utility function that prints the details part of a log message
 */
function printLogDetails(details, tag) {
  
  let lines = normalizeLogDetails(details).split('\n')
  if ( tag === TAG.DEBUG) {
    for ( let i = 0; i < lines.length; ++i)
      console.log(tag.color(tag.txt) + " " + lines[i])
  } else {
    for ( let i = 0; i < lines.length; ++i)
      console.log(" ".repeat(tag.txt.length + 1) + lines[i]) 
  }
}

/** 
* Wrapper for calling log functions with a given tag
*
* @param {prefix} - A prefix to be applied
*/
function taggedWrite(tag) {
  let write = function(msg, details, showTag=settings.SHOW_DEBUG_TAGS) {
    showTag? console.log(tag.color(tag.txt), msg) : console.log(msg);
    if ( details !== undefined )
      printLogDetails(details, showTag? tag : undefined)
    return maybeExit;
  }
  return write;
}

//
// API
//

const log = {
  error : taggedWrite(TAG.ERROR),
  warn  : taggedWrite(TAG.WARN),
  info  : taggedWrite(TAG.INFO),
  debug : taggedWrite(TAG.DEBUG),
  log   : console.log
}
      
const arg = {
  parse: function(args) {
    let parser = new Command();
    let input = "";
    parser.exitOverride();
    parser.storeOptionsAsProperties(false)
      .name(release.name)  
      .version(release.version, '-V, --version')
      .helpOption('-h, --help', 'Display this help message')
      .option('-d, --debug', "Output debug info")
      .option('-s, --silent', "Hide all output")
      .option('-stat, --print-statistics', 'Print performance statistics on exit')
      .arguments('<input>').action( (input) => {
        let abs = path.normalize(process.cwd() + '/' + input);
        if ( !fileExists(abs))
          log.error('Could not find file `' + abs + `'`).exit(0);
        this.input = abs 
      });
      
      try {
        parser.parse(args)
        if ( parser.opts().debug)
          settings.MODE = mode.debug
      } catch(err) {
        app.exit(0); //exit with 0 to avoid verbose output when `npm start`
      }
    
    return {
      noptions : Object.keys(parser.opts()).length,
      options  : parser.opts(),
      input    : this.input
    }
  }
}

module.exports = {
  log,
  arg
}