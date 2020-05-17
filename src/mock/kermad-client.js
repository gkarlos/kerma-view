var rpc = require('json-rpc2');
 
var client = rpc.Client.$create(8000, 'localhost');
 
// Call add function on the server

function start(filename) {
  client.call("session.start", filename, (err, result) => {
    if ( err)
      return console.log(err)
    console.log(result)
  })
} 

module.exports = {
  start
}
 
// client.call('add', [1, 2], function(err, result) {
//   if ( err)
//     console.log(err)
//   else
//     console.log('1 + 2 = ' + result);
// });