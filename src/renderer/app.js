const app = require('electron').remote.app

app.ui = require('./ui/ui')(app)

module.exports = app