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
const {Command, 
       CommanderError} = require('commander')

const release    = require('../common/release')
const config     = require('../common/config')
const defaults   = config.defaults
const settings   = config.settings
const build      = config.build
const fileExists = require('../util/fs').fileExists
const dirExists  = require('../util/fs').dirExists
const {isNumber, 
       isString,
       isArray, 
       isObject} = require('./traits')

//
// Some cl writting settings
// 
const tags = {
  info  : { id : 0, text : "info:",   color : color.bold.cyan},
  warn  : { id : 1, text : "warn:",   color : color.bold.yellow },
  error : { id : 2, text : "error:",  color : color.bold.red },
  debug : { id : 3, text : "[debug]", color : color.bold.blackBright}
}

var maybeExit = {
  exit: function(code) { 
    if ( settings.verbose > 0)
      console.log("Exiting...");
    app.exit(code); 
  }
}

/**
 * Utility function that prints the details part of a log message
 */
function printLogDetails(details, tag) {
  if ( !details || details == null)
    return;

  let lines;

  if ( isNumber(details) || isArray(details))
    return console.log(tag.color(tag.txt), details)
  else if (isString(details))
    lines = details.split('/\r?\n/')
  else if ( isObject(details) ) {
    let jsonStr = JSON.stringify(details, null, 2)
    // if for whatever reason JSON.stringify does not decode the object
    // just pass the object itself directly and return
    if ( jsonStr.length < 3)
      return console.log(tag.color(tag.txt), details)
    lines = jsonStr.split('\n')
  } else {
    return console.log(tag.color(tag.txt), details)
  }
  
  for ( let i = 0; i < lines.length; ++i){
    console.log((tag === tags.debug? (tag.color(tag.txt) + " ") : (tag? " ".repeat(tag.txt.length + 1) : "")) + lines[i]) 
  }
}

/** 
 * Returns a write function based on the tag passed
 */
function taggedWriteFunction(tag) {
  function writeFn(msg, details, subtag=null, showTag=settings.cl.tags) {
    if ( (tag === tags.debug) && !config.inDebugMode())
      return maybeExit;

    if ( !showTag)
      write.write(msg)
    else if ( (tag === tags.debug) && subtag != null)// only consider subtag for debug 
      console.log(tag.color(tag.txt), subtag.color(subtag.txt), msg)  
    else
      console.log(tag.color(tag.txt), msg);

    if ( details)
      printLogDetails(details, tag)
    
    return maybeExit;
  }

  return writeFn;
}

function _write(tag, subtag, msg, more) {
  if ( settings.silent || (!settings.debug && tag === tags.debug))
    return;

  let fulltag = "";
  
  if ( settings.cl.tags) {
    if (tag)
      fulltag += tag.color(tag.text);
    if (subtag)
      fulltag += " " + subtag.color(subtag.text);
  }

  if ( fulltag != null)
    console.log(fulltag, msg)
  else
    console.log(msg)

  // write more
  if ( !more || more === null)
    return

  let lines = [];

  if ( isString(more))
    lines = details.split('/\r?\n/')
  else if ( isNumber(more) || isArray(more))
    lines.push(more)
    // return console.log(tag.color(tag.txt), details)
  else if ( isObject(more) ) {
    let jsonStr = JSON.stringify(more, null, 2)
    // if for whatever reason JSON.stringify does not decode the object
    // just pass the object itself directly and return
    if ( jsonStr.length < 3)
      lines.push(more)            
    else
      lines = jsonStr.split('\n')
  } else {
    lines.push(more)
  }

  // TODO can it be some else?
  
  let prefix = " ";
  
  if ( settings.cl.tags) {  
    if ( tag === tags.debug)
      prefix = tag.color(tag.text)
    else if (tag)
      prefix = " ".repeat(tag.text.length)
      
    lines.forEach( line => console.log(prefix, line))
  }
}

function error(msg, more, subtag) {
  _write(tags.error, subtag, msg, more)
  return maybeExit;
}

function warn(msg, more, subtag) {
  _write(tags.warn, subtag, msg, more)
  return maybeExit;
}

function info(msg, more, subtag) {
  _write(tags.info, subtag, msg, more)
  return maybeExit;
}

function debug(msg, more, subtag) {
  _write(tags.debug, subtag, msg, more)
  return maybeExit;
}

function write(msg) { 
  console.log(msg)
}

function verbose(level, msg) {
  if ( !settings.silent && level <= settings.verbose )
    write(msg)
}

/**
 * Construct and return a parser object
 * 
 * @param {*} parser 
 */
function createParser() {
  var parser = new Command();
  // TODO Change parser's default error message for unknown option
  parser.storeOptionsAsProperties(false)
        .exitOverride()
        .name(release.name)  
        .version(release.version, '-V, --version')
        .helpOption('-h, --help', 'Display this help message')
        .option('-d, --debug', "Output debug info", false)
        .option('-s, --silent', "Hide all output", false)
        .option('-c, --color', "Monochrome output", true)
        .option('-stat, --print-statistics', 'Print performance statistics on exit')
        .arguments('<input>').action( (input) => {
          let abs = path.normalize(process.cwd() + '/' + input);
          if ( !fileExists(abs))
            error(`Could not find file '${abs}'`).exit(0)
          parser.input = abs 
        });
  return parser;
}

/**
 * Namespace for command line arg related stuff
 */
const arg = {
  parse : {
    /**
     * Parse command line arguments from a list
     * @param {*} args 
     * @param {*} callback 
     */
    list: function(args, callback) {
      let clparser = createParser();
      let err = false
      let result = {}
      
      try {
        clparser.parse(args)
        settings.debug = clparser.opts().debug
        settings.color = clparser.opts().color
        result.noptions = Object.keys(clparser.opts()).length
        result.options  = clparser.opts()
        result.input    = clparser.input
      } catch(e) {
        err = e
      }

      if ( callback) // let callback (if one exists) to decide what to do
        return callback(err, result)
      
      if ( err) {
        defaultErrorHandler(err);
      }

      return result;
    },

    /**
     * Parse command line arguments from a string
     * @param {*} str 
     * @param {*} callback 
     */
    raw : function(str, callback) {
      this.list(str.split(' '), callback);
    },

    defaultErrorHandler : function(msg) {
      if ( msg)
        error(msg)
      app.exit(0);
    }
  }
}

module.exports = {
  tags,
  error,
  debug,
  info,
  warn,
  write,
  verbose,
  arg
}