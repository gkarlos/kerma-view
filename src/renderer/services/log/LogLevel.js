/**
 * @memberof module:log
 */
class LogLevel {
  static str = {
    Unknown : "Unknown",
    Trace   : "Trace",
    Debug   : "Debug",
    Info    : "Info",
    Warning : "Warning",
    Error   : "Error",
    Critical : "Critical",
    None    : "None",

    short : {
      Unknown : "Unk",
      Trace   : "Trc",
      Debug   : "Dbg",
      Info    : "Inf",
      Warning : "Wrn",
      Error   : "Err",
      Critical : "Crit",
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
      return LogLevel.Error
    if ( str === LogLevel.str.None.toLowerCase() || str === LogLevel.str.short.None.toLowerCase())
      return LogLevel.None
  } 
}

/** */
LogLevel.Unknown = 0

/** */
LogLevel.Trace   = 1

/** */
LogLevel.Debug   = 2

/** */
LogLevel.Info    = 3

/** */
LogLevel.Warning = 4

/** */
LogLevel.Error   = 5

/** */
LogLevel.Critical = 6

/** */
LogLevel.None    = 7

module.exports = LogLevel



