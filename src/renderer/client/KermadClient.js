const rpc = require('json-rpc2');
 

class KermaClient {
  constructor(app) {
    this.app = app
    this.client = rpc.Client.$create(8000, 'localhost');
  }

  startSession(filename) {
    // console.log(this.app.ui.toolbar.input.getMode())

    this.client.call('session.start', {mode: this.app.ui.toolbar.input.getMode().value, filename: filename}, (err, result) => {
      if ( err)
        return console.log(err.message)
      this.app.log.info("session: start:", result)
    })
  }

  endSession() {

  }

  
}

module.exports = KermaClient