/**--renderer/main.js---------------------------------------------------/
 *
 * Part of the kerma project
 * 
 *------------------------------------------------------------------/
 * 
 * @file main/main.js
 * @author gkarlos 
 * @module main/main
 * @description 
 *   The main/entry-point module
 *  
 *-----------------------------------------------------------------*/
var initialized = false;

module.exports = (app) => {
  var ui = app.ui
  const Split = require('split.js')

  const layout = {
    container : {
      selector : "#container",
      node : null,

      header : {
        selector : "#header",
        node: null
      }
      ,
      main : {
        selector : "#main",
        node : null,
        split : null,
  
        left  : {
          selector : "#left",
          node: null,
          split: null,
  
          top : {
            selector : "#left-top",
            node : null
          },
          bottom : {
            selector : "#left-bottom",
            node : null
          }
        },
  
        right : {
          selector : "#right",
          node: null,
        },
      }
      ,
      footer : {
        selector : "#footer",
        node : null
      }
    }
  }

  function init() {
    if ( initialized)
      console.log('[info]', 'layout.init() called on an initialized layout. This is no-op')
    else {
      layout.header.node           = document.querySelector(layout.header.selector)
      layout.main.node             = document.querySelector(layout.main.selector)
      layout.main.left.node        = document.querySelector(layout.main.left.selector)
      layout.main.left.top.node    = document.querySelector(layout.main.left.top.selector)
      layout.main.left.bottom.node = document.querySelector(layout.main.left.bottom.selector)
      layout.main.right.node       = document.querySelector(layout.main.right.selector)
      layout.footer.node           = document.querySelector(layout.footer.selector)

      layout.main.split = Split(['#left', '#right'], { 
        sizes: [50, 50], 
        onDrag: () => ui.emit('ui:resize')
      })

      layout.main.left.split = Split(['#left-top', '#left-bottom'], {
        direction: 'vertical', 
        sizes: [50, 50],
        cursor: 'row-resize', 
        snapOffset : 0,
        expandToMin: true,
        dragInterval: 15,
        onDrag: () => {
          ui.emit('ui:resize')
        }
      });

      initialized = true;

      console.log('[info] ui: layout initialized')

      return layout;
    }      
  }

  return {
    init : init
  }
}