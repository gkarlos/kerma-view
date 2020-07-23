/**
 * @memberof module:editor
 */
class EditorTab {
  /** @type {String} */
  #name
  /** @type {String} */
  #icon
  /** @type {String} */
  #title

  /**
   * 
   * @param {String} name 
   * @param {String} [icon]
   * @param {String} [title]
   */
  constructor(name, icon, title) {
    this.#name = name
    this.#icon = icon
    this.#title = title? title : name
  }

  /** @type {String} */
  get name() { return this.#name }

  /** @type {String} */
  get icon() { return this.#icon }

  /** @type {String} */
  get title() { return this.#title }

  /**
   * @param {EditorTab}
   * @returns {Boolean}
   */
  equals(other) {
    return (other instanceof EditorTab)
      && this.#name  === other.name
      && this.#icon  === other.icon
      && this.#title === other.title
  }
}

module.exports = EditorTab