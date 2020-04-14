'use strict'

const mode = {
  debug : "debug",
  delease : "release"
}

const defaults = {
  WINDOW_WIDTH: 1600,
  WINDOW_HEIGHT: 1080,
  KERMAD_EXECUTABLE: "kermad",
  MODE : mode.release
}

const VERBOSE_LEVEL = 1

module.exports = {
  defaults,
  mode,
  VERBOSE_LEVEL
}