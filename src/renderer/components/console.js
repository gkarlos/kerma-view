module.exports = (app) => {
  console.log('Loading console instance')
  let {Terminal} = require('xterm')
  let {FitAddon} = require('xterm-addon-fit')

  let linkTermJS = document.createElement('link')
  let linkConsole = document.createElement('link')
  linkTermJS.type = 'text/css'
  linkTermJS.href = '../../../node_modules/xterm/css/xterm.css'
  linkTermJS.rel = 'stylesheet'
  linkConsole.type = 'text/css'
  linkConsole.href = './css/console.css'
  linkConsole.rel = 'stylesheet'
  document.getElementsByTagName('head')[0].appendChild(linkTermJS);
  document.getElementsByTagName('head')[0].appendChild(linkConsole);

  const fit = new FitAddon();

  app.session.console.instance = new Terminal({
    cursorBlink: true
  });

  app.session.console.instance.loadAddon(fit);
  app.session.console.loaded = true;

  app.session.console.instance.open(document.getElementById('console-area'))

  console.log(fit)
}