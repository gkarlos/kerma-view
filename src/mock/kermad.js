const path = require('path')

require('app-module-path').addPath(path.join(__dirname, "../"))

const rpc  = require('json-rpc2');
const ConsoleLogger  = require('../renderer/services/log/ConsoleLogger')
const host = 'localhost'
const port = 8000


const log = new ConsoleLogger()

var server = rpc.Server.$create({
  'websocket': true, // is true by default
  'headers': { // allow custom headers is empty by default
      'Access-Control-Allow-Origin': '*'
  }
});

let ongoingSession = false;

function startSession(args, opt, reply) {
  ongoingSession = true
  log.info("Started session:", args)
  reply(null, {status: "ok"})
}

function stopSession() {
  if ( !ongoingSession)
    console.log("no ongoing session")
  if ( args.exit)
    process.exit(1)
}

// function exit() {

// }

// server.expose('exit', exit)

// server.expose('session', {
//   'start' : startSession,
//   'stop' : stopSession
// }) 

// function add(args, opt, callback) {
//   console.log(args)
//   // console.log(opt)
//   // console.log(callback)
//   callback({x:2}, args[0] + args[1]);
// }

// server.expose('add', add);
server.expose('session', {
  'start': startSession
});


function start() {
  console.log("\nkermad mock | listening on:", `${host}:${port}\n`)

  server.listen(port, host);
}


start()