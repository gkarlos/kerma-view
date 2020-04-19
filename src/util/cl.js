/** /---------------------------------------------------------------/
 * @file util/cl.js
 * @fileoverview
 *  Part of the kerma project
 * @author gkarlos 
 * @module util/cl
 * @description 
 * Command line utilities such us logging and argument parsing. 
 * Moreover it defines a standard arg parser for the application
 *  
 *//**-------------------------------------------------------------*/
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
const inspect    = require('util').inspect

/**
 * Base class for command line related errors
 */
class CLError extends Error { 
  constructor(msg) { super(msg)} 
}

/** Error indicating a file wasn't found */
class FileNotFoundError extends CLError {
  /**
   * @constructor
   * @class FileNotFoundError
   * @param {*} filename - the name of the file
   */
  constructor(filename) { super(`Could not find file '${filename}'`) }
}

// /**
//  * Indicates that a file is not found
//  */
// class FileNotFoundError extends CLError { 
//   constructor(file) { super(`Could not find file '${file}'`)} 
// }


/**
 * Construct a default command-line parser
 */
const createParser = () => {
  let p = new Command()

  p.exitOverride()
   .storeOptionsAsProperties(false)
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
      throw new FileNotFoundError(abs);
     p.input = abs;
    })
  return p;
}


/**
 * Available tags for command line logging
 * @namespace
 */
const tags = {
  info  : { id : 0, text : "info:",   color : color.bold.cyan},
  warn  : { id : 1, text : "warn:",   color : color.bold.yellow },
  error : { id : 2, text : "error:",  color : color.bold.red },
  debug : { id : 3, text : "[debug]", color : color.bold.blackBright},
  cl    : { id : 4, text : "cl:",     color : color.bold }
}

/**
 * Generic console write function. 
 * 
 * Whether or not tags are printed depends on `settings.cl.tags`
 * 
 * In silent mode only `tags.debug` is printed
 * 
 * @param {*} msg - The message to print
 * @param {*} tag - (optional) A tag to prefix the message with
 * @param {*} subtag - (optional) A subtag to follow the tag. Ignored if no tag is provided
 * @param {*} more - (optional) Additional details. Will be printed on a new line
 * @param {boolean} expand - (optional) Expand internal objects if applicable
 */
function write(msg, tag=null, subtag=null, more=null, expand=false) {
  if ( (settings.silent && tag !== tags.debug) || (!settings.debug && tag === tags.debug))
    return;

  let fulltag = "";
  
  if ( settings.cl.tags && tag) {
    fulltag += tag.color(tag.text);
    if (subtag)
      fulltag += " " + subtag.color(subtag.text);
  }

  if ( fulltag.length > 0)
    console.log(fulltag, msg)
  else
    console.log(msg)

  // write more
  if ( !more || more === null)
    return

  console.group()
  expand? console.log( inspect(more, {depth: null, colors: true}))
        : console.log( inspect(more, {colors: true}))
  console.groupEnd()

  // let lines = [];
  // if ( isString(more))
  //   lines = details.split('/\r?\n/')
  // else if ( isNumber(more) || isArray(more))
  //   lines.push(more)
  // else if ( isObject(more) ) {
  //   let jsonStr = JSON.stringify(more, null, 2)
  //   // if for whatever reason JSON.stringify does not decode the object
  //   // just pass the object itself directly and return
  //   if ( jsonStr.length < 3)
  //     lines.push(more)            
  //   else
  //     lines = jsonStr.split('\n')
  // } else {
  //   lines.push(more)
  // }
  // TODO can it be some else?
  // let prefix = " ";
  // if ( settings.cl.tags) {  
  //   if ( tag === tags.debug)
  //     prefix = tag.color(tag.text)
  //   else if (tag)
  //     prefix = " ".repeat(tag.text.length)
  //   lines.forEach( line => console.log(prefix, line))
  // }
}

/**
 * Utility class returned by logging functions. 
 * It allows to chain an exit() call after the
 * call, e.g: 
 * ```js
 *  cl.error("something bad happened").exit(0);
 * ```
 * @type {object}
 * @property {function} maybeExit.exit - Exit the app with a code
 */
const maybeExit = {
  exit: function(code) { 
    if ( settings.verbose > 0)
      console.log("Exiting...");
    app.exit(code); 
  }
}




/**
 * Write an error message
 * 
 * @param {*} msg  - The error message
 * @param {*} more - (Optional) Additional details
 * @param {*} subtag - (Optional) A subtag to be appended after 'error;'
 * @example
 *  error("an error") 
 */
function error(msg, more, expand, subtag) {
  write(msg, tags.error, subtag, more, expand)
  return maybeExit;
}

/**
 * Write a warning message
 * 
 * @static
 * @param {*} msg 
 * @param {*} more 
 * @param {*} subtag 
 */
function warn(msg, more, expand, subtag) {
  write(msg, tags.warn, subtag, more, expand);
  return maybeExit;
}

/**
 * Write a debug message
 * 
 * @static
 * @param {*} msg 
 * @param {*} more 
 * @param {*} subtag 
 */
function debug(msg, more, expand, subtag) {
  write(msg, tags.debug, subtag, more, expand);
  return maybeExit;
}

/**
 * Write an info message
 * 
 * @static
 * @param {*} msg 
 * @param {*} more 
 * @param {*} subtag 
 */
function info(msg, more, expand, subtag) {
  write(msg, tags.info, subtag, more, expand);
  return maybeExit;
}

/**
 * Raw write that depends on the application's
 * verbosity level. 
 * @see {@link settings.verbose}
 * @param {*} level 
 * @param {*} msg 
 * @static
 */
function verbose(level, msg, more, expand, tag) {
  if ( level <= settings.verbose)
    write(msg, tag, null, more, expand)
}




/** @namespace */
const parse = {}

/**
 * Parse command line arguments from a list
 * @member
 * @param {*} args 
 * @param {*} callback 
 */
parse.list = function(args, callback) {
  let err, clparser = createParser(), result = {}
  
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
  
  return err? defaultErrorHandler(err) : result;
}
      

/**
 * Parse command line arguments from a string
 * @param {*} str 
 * @param {*} callback 
 */
parse.raw = function(str, callback) {
  this.list(str.split(' '), callback);
}

/**
 * Default handler when a command line argument parsing error occurs
 * 
 * @param {*} err 
 */
parse.defaultErrorHandler = function(err) {
  if ( err) {
    if ( err instanceof CLError)
      error(err.message, null, tags.cl);
    else if ( err instanceof CommanderError) {
      // commander.js logs the error without the option to 
      // override the behavior. So for now we do not print 
      // anything to avoid duplicate messages
      // https://github.com/tj/commander.js/issues/1241 
    } else {
      error(err)
    }
  }
  app.exit(0);
}
module.exports = {
  CLError,
  FileNotFoundError,
  error, warn, info, debug, verbose,
  parse,
  tags
}


// module.exports = cl