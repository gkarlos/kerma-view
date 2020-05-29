'use-strict'
require('v8-compile-cache')
require('module-alias/register')

const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "../"))


const App    = require('./app')
const Events = require('./events')

const app = new App()

app.start()

// app.on(Events.INPUT_FILE_SELECTED, (filename) => app.client.startSession(filename))

// app.on(Events.UI_READY, () => app.notifier.info("App is ready") )
// app.on(Events.UI_READY, () => setTimeout( ()=> app.notifier.info("App is ready 2")), 2000)

// const ProgressNotification = require('./notification/ProgressNotification')

// let notification = new ProgressNotification("Hello", "world", ProgressNotification.Success)

// notification.onProgress((oldProgress, newProgress) => {
//   console.log("hook1: ", oldProgress, newProgress)
// })

// notification.onProgress((oldProgress, newProgress) => {
//   console.log("hook2: ", oldProgress, newProgress)
// })

// notification.onComplete(() => console.log("DONE"))

// console.log(notification)

// setTimeout(() => notification.progress(50, "Increase by 15"), 1000)

// setTimeout(() => notification.progress(50, "Increase by 15"), 2000)