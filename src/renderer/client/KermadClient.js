const rpc = require('json-rpc2');
 

class KermaClient {
  constructor(app) {
    this.app = app
    this.client = rpc.Client.$create(8000, 'localhost');
  }

  startSession(filename) {
    this.client.call('session.start', {filename: filename}, (err, result) => {
      if ( err)
        return console.log(err.message)
      console.log("[info] session.start:", result)
    })
  }

  endSession() {

  }

  
}

module.exports = KermaClient