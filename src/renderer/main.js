'use-strict'
const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "../"))


const App    = require('./app')
const Events = require('./events')

const app = new App()

app.start()


// app.on(Events.INPUT_FILE_SELECTED, (filename) => app.client.startSession(filename))

app.on(Events.UI_READY, () => app.notifier.info("App is ready") )
app.on(Events.UI_READY, () => setTimeout( ()=> app.notifier.info("App is ready 2")), 2000)