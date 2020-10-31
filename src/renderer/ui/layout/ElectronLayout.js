const BaseLayout = require('./BaseLayout')

const Split = require('split.js')

/**
 * @typedef ElectronLayoutHeader
 * @type {Object}
 * @property {String} id
 * @property {HTMLDivElement} node
 * @property {Object} left
 * @property {String} left.id
 * @property {HTMLDivElement} left.node
 * @property {Object} right
 * @property {String} right.id
 * @property {HTMLDivElement} right.node
 */

/** 
 * @typedef  {Object} ElectronLayoutBody
 * @property {String}         id
 * @property {HTMLDivElement} node
 * @property {Split}          split
 * @property {Object}         left
 * @property {String}         left.id
 * @property {HTMLDivElement} left.node
 * @property {Split}          left.split
 * @property {Object}         left.top
 * @property {String}         left.top.id
 * @property {HTMLDivElement} left.top.node
 * @property {Object}         left.bottom
 * @property {String}         left.bottom.id
 * @property {HTMLDivElement} left.bottom.node
 * @property {Object}         right
 */

/**
 * @typedef  {Object} ElectronLayoutFooter
 * @property {String} ElectronLayoutFooter.id
 * @property {HTMLDivElement} ElectronLayout.node
 */

var App;

/**
 * Defines the layout for the desktop (electron) app
 *
 * @memberof module:layout
 * @extends BaseLayout
 */
class ElectronLayout extends BaseLayout {
  /**
   * @param {string} [name] A name for this layout
   */
  constructor(name = "ElectronLayout") {
    super(name)

    /**
     * @type {Boolean}
     */
    this.rendered = false;

    /**
     * @type {String}
     */
    this.id = null

    /**
     * @type {HTMLDivElement}
     */
    this.node = null

    /**
     * @type {ElectronLayoutHeader}
     */
    this.header = {
      id: null,
      node: null,
      left: { id: null, node: null },
      right: { id: null, node: null }
    }

    /**
     * @type {ElectronLayoutBody}
     */
    this.body = {
      id: null,
      node: null,
      split: null,
      left: {
        id: null,
        node: null,
        split: null,
        top: {
          id: null,
          node: null
        },
        bottom: {
          id: null,
          node: null
        }
      },
      right: {
        id: null,
        node: null
      }
    }

    /**
     * @type {ElectronLayoutFooter}
     */
    this.footer = {
      id: null,
      node: null,
    }
  }

  /**
   * Render the layout
   */
  render() {
    if (this.rendered)
      return console.log(`[warn] Layout [${this.name}] is already rendered. This is a no-op`)

    if ( !App)
      App = require('@renderer/app')

    /// Root
    let root = document.createElement('div')
    root.name = "container"
    root.id = "container"
    root.classList.add('container-fluid')
    root.setAttribute("layout-element", "root")
    root.setAttribute("layout", this.name)
    this.node = root
    this.id = root.id

    /// Header
    let header = document.createElement('div')
    header.id = "header"
    header.classList.add('row', 'navbar')
    header.setAttribute("layout-element", "header")
    this.header.node = header
    this.header.id = header.id

    let headerLeft = document.createElement('div')
    headerLeft.id = "header-left"
    headerLeft.setAttribute("layout-element", "header.left")
    this.header.left.node = headerLeft
    this.header.left.id = headerLeft.id

    let headerRight = document.createElement('div')
    headerRight.id = "header-right"
    headerRight.setAttribute("layout-element", "header.right")
    this.header.right.node = headerRight
    this.header.right.id = headerRight.id

    header.appendChild(headerLeft)
    header.appendChild(headerRight)

    /// Footer
    let footer = document.createElement('div')
    footer.id = "footer"
    footer.classList.add("footer")
    footer.setAttribute("layout-element", "footer")
    this.footer.node = footer
    this.footer.id = footer.id

    /// Body
    let body = document.createElement('div')
    body.id = "main"
    body.classList.add("row", "main-row")
    body.setAttribute("layout-element", "body")

    this.body.node = body
    this.body.id = body.id

    let bodyLeft = document.createElement('div')
    bodyLeft.id = "left"
    bodyLeft.classList.add("h-100")
    bodyLeft.setAttribute("layout-element", "body.left")

    this.body.left.node = bodyLeft
    this.body.left.id = bodyLeft.id

    let bodyRight = document.createElement('div')
    bodyRight.id = "right"
    bodyRight.classList.add("h-100", "right", "split")
    bodyRight.setAttribute("layout-element", "body.right")
    this.body.right.node = bodyRight
    this.body.right.id = bodyRight.id

    /// Body.Left
    let bodyLeftTop = document.createElement('div')
    bodyLeftTop.id = "left-top"
    bodyLeftTop.classList.add("split", "w-100", "card")
    bodyLeftTop.setAttribute("layout-element", "body.left.top")
    this.body.left.top.node = bodyLeftTop
    this.body.left.top.id = bodyLeftTop.id

    let bodyLeftBottom = document.createElement('div')
    bodyLeftBottom.id = "left-bottom"
    bodyLeftBottom.classList.add("split")
    bodyLeftBottom.setAttribute("layout-element", "body.left.bottom")
    this.body.left.bottom.node = bodyLeftBottom
    this.body.left.bottom.id = bodyLeftBottom.id

    bodyLeft.appendChild(bodyLeftTop)
    bodyLeft.appendChild(bodyLeftBottom)
    body.appendChild(bodyLeft)
    body.appendChild(bodyRight)

    root.append(header)
    root.appendChild(body)
    root.appendChild(footer)

    document.body.appendChild(root)

    this.body.split = Split(['#left', '#right'], {
      sizes: [50, 50],
      onDrag: () => {
        console.log(App)
        App.emit(App.Events.UI_RESIZE)
      }
    })

    this.body.left.split = Split(['#left-top', '#left-bottom'], {
      direction: 'vertical',
      sizes: [50, 50],
      maxSize: 70,
      cursor: 'row-resize',
      snapOffset: 0,
      dragInterval: 5,
      onDrag: () => App.emit(App.Events.UI_RESIZE)
    });

    this.rendered = true
    // this.app.ui.emit('ui:component-ready', this)
  }
}

module.exports = ElectronLayout