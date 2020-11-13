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

  const EXIT_TIMEOUT = 3000;

  let PromiseTimeout = (ms, promise) => {
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject(`[rpc][err] timeout after ${EXIT_TIMEOUT}ms`)
      }, ms)
    })
    return Promise.race([promise, timeout])
  }

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
            return reject(err)
          } else {
            if ( res.error) {
              console.log("[rpc]", IN, res.error)
              return reject(res.error)
            } else {
              res = JSON.parse(res.result)
              console.log("[rpc]", IN, res)
              return resolve(res)
            }
          }
        })
      })
    },

    /**
     * @param {boolean} exit
     * @returns {Promise<>}
     */
    StopSession: function(exit=false) {
      let params = [(exit? true : false)]
      let PromiseReq = new Promise((resolve, reject) => {
        console.log("[rpc]", OUT, "StopSession", params)
        // if ( Client.)
        Client.request('StopSession', params, (err, res) => {
          if ( err) {
            console.log("[rpc][err]", IN, err);
            reject(err);
          } else {
            console.log(res)
            res = JSON.parse(res.result);
            console.log("[rpc]", IN, res);
            resolve(res);
          }
        })
      })
      return (exit) ? PromiseTimeout(EXIT_TIMEOUT, PromiseReq)
                    : PromiseReq;
    }
  };
})()