/**--main/config.js-------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file main/config.js
 * @author gkarlos 
 * @module config
 * @category Main
 * @description 
 *   Configuration stuff for the main process2
 *  
 *-----------------------------------------------------------------*/
'use strict'

const settings = require("@common/config").settings



function dumpLaunchConfiguration() {
  const cl = require('./cl')

  let fn = settings.debug? cl.debug : cl.info;
  fn("Configuration: ", {
    system : {
      platform : process.platform,
      version  : process.getSystemVersion(),
      mem : {
        total : process.getSystemMemoryInfo().total,
        free :  process.getSystemMemoryInfo().free.toString() + 
                " (" + ((process.getSystemMemoryInfo().free / process.getSystemMemoryInfo().total) * 100).toFixed(1) + " %)"
      },
      screen : settings.screen.width + "x" + settings.screen.height
    },
    app : {
      args : { "Input" : app.args.input, "Options" : app.args.options },
      window : settings.screen.width + "x" + settings.screen.height
    }
  }, true)
}

module.exports = {
  dumpLaunchConfiguration
}