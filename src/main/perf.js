const app      = require('electron').app
const cl       = require('@main/cl')
const settings = require('@common/settings') 

function dumpPerformanceStats() {
  if ( !app.args)
    return;
    
  if ( app.args.options && app.args.options.printStatistics) {
    let stats = {
      memory : process.getHeapStatistics(),
      cpu : process.getCPUUsage(),
      iocounters : process.getIOCounters(),
    }

    if ( settings.inDebugMode())
      cl.debug("Performance Stats:", stats)
    else 
      cl.info("Performance Stats:", stats)
  }
}

module.exports = {
  dumpPerformanceStats
}