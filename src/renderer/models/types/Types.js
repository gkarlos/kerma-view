/**@ignore @typedef {import("@renderer/models/Dim")} Dim */
/**@ignore @typedef {import("@renderer/models/types/Type")} Type */

const ArrayType = require("./ArrayType")
const PtrType = require("./PtrType")

/**
 * @memberof module:types
 */
class Types {
  /** */ static Type       = require('./Type')
  /** */ static ArrayType  = require('./ArrayType')
  /** */ static StructType = require('./StructType')
  /** */ static PtrType    = require('./PtrType')
  /** */ static IntType    = require('./IntType')
  /** */ static FloatType  = require('./FloatType')

  constructor() {}

  /** */ static Int8  = new Types.IntType(8,  true)
  /** */ static Int16 = new Types.IntType(16, true)
  /** */ static Int32 = new Types.IntType(32, true)
  /** */ static Int64 = new Types.IntType(64, true)

  /** */ static UInt8  = new Types.IntType(8,  false)
  /** */ static UInt16 = new Types.IntType(16, false)
  /** */ static UInt32 = new Types.IntType(32, false)
  /** */ static UInt64 = new Types.IntType(64, false)

  /** */ static Float32 = new Types.FloatType(32)
  /** */ static Float64 = new Types.FloatType(64)
  /** */ static Float = Types.Float32
  /** */ static Double = Types.Float64

  /** */ static Boolean = new Types.IntType(1, false).addAlias("bool").addAlias("boolean")

  /** */ static DefaultPointerWidth      = Types.PtrType.DefaultWidth
  /** */ static DefaultPointerWidthBytes = Types.PtrType.DefaultWidth / 8

  /**
   * Create an unnamed struct type
   * @param {...Type} elementTypes
   * @returns {StructType}
   */
  static getStuctType(...elementTypes) {
    try {
      return new Types.StructType(elementTypes)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Create a named struct type
   * @param {String} name
   * @param {...Type} elementTypes
   * @returns {StructType}
   */
  static getNamedStructType(name, ...elementTypes) {
    try {
      return new Types.StructType(elementTypes, name)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Create an array type
   * @param {Type} elementType 
   * @param {Dim} dim
   * @returns {ArrayType}
   */
  static getArrayType(elementType, dim) {
    try {
      return new Types.ArrayType(elementType, dim)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * Create a pointer type
   * @param {Type} pointeeType 
   * @param {Number} bits 
   * @returns {PtrType}
   */
  static getPtrType(pointeeType, bits) {
    try {
      return new Types.PtrType(pointeeType, bits)
    } catch (e) {
      throw new Error(e)
    }
  }

  /**
   * 
   * @param {Type} type 
   */
  static pp(type) {
    if ( type.isBasicType())
      return type.toString()
    else {
      
    }
  }
}

module.exports = Types