/**
 * @memberof module:log
 */
class LogLevel {
  static Unknown = 0
  static Trace   = 1
  static Debug   = 2
  static Info    = 3
  static Warning = 4
  static Error   = 5
  static None    = 6

  static str = {
    Unknown : "Unknown",
    Trace   : "Trace",
    Debug   : "Debug",
    Info    : "Info",
    Warning : "Warning",
    Error   : "Error",
    None    : "None",

    short : {
      Unknown : "Unk",
      Trace   : "Trc",
      Debug   : "Dbg",
      Info    : "Inf",
      Warning : "Wrn",
      Error   : "Err",
      None    : "None",
    }
  }

  /**
   * Retrieve a log level from a string
   * @param {String} level A string describing the log level
   */
  fromString(level="") {
    if (typeof level !== 'string' || !(level instanceof String))
      return LogLevel.Unknown
  
    let str = s.toLowerCase()
  
    if ( str === LogLevel.str.Unknown.toLowerCase() || str === LogLevel.str.short.Unknown.toLowerCase())
      return LogLevel.Unknown
    if ( str === LogLevel.str.Trace.toLowerCase() || str === LogLevel.str.short.Trace.toLowerCase())
      return LogLevel.Trace
    if ( str === LogLevel.str.Debug.toLowerCase() || str === LogLevel.str.short.Debug.toLowerCase())
      return LogLevel.Debug
    if ( str === LogLevel.str.Info.toLowerCase() || str === LogLevel.str.short.Info.toLowerCase())
      return LogLevel.Info
    if ( str === LogLevel.str.Warning.toLowerCase() || str === LogLevel.str.short.Warning.toLowerCase())
      return LogLevel.Warning
    if ( str === LogLevel.str.Error.toLowerCase() || str === LogLevel.str.short.Error.toLowerCase())
      return LogLevel.Warning
    if ( str === LogLevel.str.None.toLowerCase() || str === LogLevel.str.short.None.toLowerCase())
      return LogLevel.Warning
  } 
}

module.exports = LogLevel



