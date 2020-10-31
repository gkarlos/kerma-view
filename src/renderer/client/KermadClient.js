// const App = require('@renderer/app')
// const { createVerify } = require('crypto')
// const jayson = require('jayson')
// const IN = "<--"
// const OUT = "-->"
// class KermadClient {

//   constructor(app) {
//     this.app = app
//     this.server = App.remote.getGlobal('kermad')
//     this.client = jayson.Client.tcp({host: this.server.ip, port: this.server.port})
//   }

//   /** */
//   startSession(path, cb) {
//     let params = [path]
//     console.log(OUT, "StartSession", params)
//     this.client.request("StartSession", params, (err, res) => {
//       // this.app.Logger.info(IN, res.result);
//       cb(err, res.result)
//     })
//   }

//   endSession() {

//   }
// }

// const Client = new KermadClient(


class KermaSession {

}

const IN = "<<<"
const OUT = ">>>"

/**
 * @module Cienet
 * @category Renderer
 */
module.exports = (function(){

  const App = require('@renderer/app')
  const jayson = require('jayson')

  const Server = App.remote.getGlobal('kermad')
  const Client = jayson.Client.tcp({port: Server.port})

  console.log();

  return {
    // StartSession: function (path, cb) {
    //   let params = [path]
    //   console.log(OUT, "StartSession", params)
    //   Client.request('StartSession', params, (err, res) => {
    //     if ( err) {
    //       console.log(IN, err)
    //     } else {
    //       res = JSON.parse(res.result)
    //       console.log(IN, res);
    //     }
    //     cb(err, res);
    //   })
    // },

    /**
     * @returns {Promise<>}
     */
    StartSession: function(Dir, Source, CompileDB) {
      return new Promise((resolve, reject) => {
        let params = [Dir, Source, CompileDB]
        console.log("[rpc]", OUT, "StartSession", params)
        Client.request('StartSession', params, (err, res) => {
          if ( err) {
            console.log("[rpc]", IN, err)
            reject()
          } else {
            res = JSON.parse(res.result)
            console.log("[rpc]", IN, res)
            resolve(res)
          }
        })
      })
    }
    // StopSession: (cb) => {
    //   console.log(OUT, "StopSession")
    //   Client.request('StopSession', [], (err,res) => cb(err, res))
    // }
  };
})()