const app    = require('electron').app
const config = require('../common/config.js')
const cl     = require('../util/cl')

function dumpPerformanceStats() {
  if ( !app.args)
    return;
    
  if ( app.args.options && app.args.options.printStatistics) {
    let stats = {
      memory : process.getHeapStatistics(),
      cpu : process.getCPUUsage(),
      iocounters : process.getIOCounters(),
    }

    if ( config.inDebugMode())
      cl.debug("Performance Stats:", stats)
    else 
      cl.info("Performance Stats:", stats)
  }
}

module.exports = {
  dumpPerformanceStats
}