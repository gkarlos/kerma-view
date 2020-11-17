
function timestamp() {
  return new Date().toISOString();
}

const Logger = {
  /** @type {function(...): void} */
  info : console.log.bind(console.log, `%c INFO %c[${timestamp()}]`, 'color: #33f', 'color: #a3a3a3'),
  /** @type {function(...): void} * console.log.bind(console.log, console, `%c WARN %c[${timestamp()}]`, 'color: #993', 'color: #a3a3a3'),
  /** @type {function(...): void} */
  debug : console.log.bind(console.log, `%cDEBUG%c %c[${timestamp()}]`, 'background: #eee; color: #888', "", 'color: #a3a3a3'),
  /** @type {function(...): void} */
  error : console.log.bind(console.log, `%c  ERR %c[${timestamp()}]`, 'color: #f33', 'color: #a3a3a3'),
  /** @type {function(...): void} */
  critical : console.log.bind(console.log, `%cCRITI%c %c[${timestamp()}]`, 'background: #f33; color: white', '', 'color: #a3a3a3'),
  /** @type {function(...): void} */
  trace : console.log.bind(console.log, `%cTRACE %c[${timestamp()}]`, 'color: #888', 'color: #a3a3a3')
}

Object.freeze(Logger)

module.exports = Logger