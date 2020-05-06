/**
 * This file is used as a "pre-main" step. It uses
 * esm https://www.npmjs.com/package/esm to bridge
 * CommonJS and ESM syntax.
 * The actual entry point is main.js
 */
require = require('esm')(module)
require('./main.js')