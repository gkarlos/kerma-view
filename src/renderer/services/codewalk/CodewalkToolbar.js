const Component = require('@renderer/ui/component/Component')
const App = require('@renderer/app')
const EventEmitter= require('events').EventEmitter
const Events = require('@renderer/events')


// const LOCATION_PROGRAM_TOOLBAR = `#${App.ui.toolbar.main.id}`

class CodewalkToolbar extends Component {
  /** @type {Boolean} */
  #Rendered = false
  /** @type {Boolean} */
  #Enabled = true

  /** @type {JQuery} */
  #Node
  /** @type {JQuery} */
  #Start
  /** @type {JQuery} */
  #Stop
  /** @type {JQuery} */
  #Restart
  /** @type {JQuery} */
  #StmtNext
  /** @type {JQuery} */
  #StmtPrev
  /** @type {JQuery} */
  #LoopNext
  /** @type {JQuery} */
  #LoopPrev
  /** @type {JQuery} */
  #LoopSkip
  /** @type {EventEmitter} */
  #Emitter

  /** @type {JQuery} */
  #Status
  /** @type {JQuery} */
  #StatusPulse
  /** @type {JQuery} */
  #StatusText



  constructor() {
    // let LOCATION_EDITOR_TOOLBAR = `#${App.ui.toolbar.editor.id}`
    let LOCATION_TOP_TOOLBAR = `#${App.ui.layout.header.right.id}`
    super('codenav-toolbar', LOCATION_TOP_TOOLBAR)
    this.#Emitter = new EventEmitter();
  }

  /** @type {JQuery} */
  get startbtn() { return this.#Start; }

  /** @type {JQuery} */
  get stopbtn() { return this.#Stop; }

  /** @type {JQuery} */
  get restartbtn() { return this.#Restart }

  onStart(cb) {
    (typeof (cb) == 'function') && this.#Emitter.on('start', cb);
    return this;
  }

  onStop(cb) {
    (typeof (cb) == 'function') && this.#Emitter.on('start', cb);
    return this;
  }

  onRestart(cb) {
    (typeof (cb) == 'function') && this.#Emitter.on('start', cb);
    return this;
  }

  /** @returns {Boolean} */
  isRendered() { return this.#Rendered }

  /** */
  // _createStartStopButtons(container) {
  //   // this.startStopGroup
  //   //   = $(`<div class="btn-group-xs" role="group" id="codenav-toolbar-button-group"></div>`).appendTo(container)
  //   this.start
  //     = $(`<button type="button" class="btn kv-btn" id="codenav-btn-start" title="Start">
  //           <i class="fas fa-play"></i>
  //           <span>Start</span>
  //          </button>`).appendTo(container)

  //   this.stop
  //     = $(`<button type="button" class="btn kv-btn" id="codenav-btn-stop" title="Stop">
  //           <i class="fas fa-stop"></i>
  //          </button>`).appendTo(container)
  // }

  // /** */
  // _createRestartButton(container) {
  //   this.restart = $(`<button type="button" class="btn kv-btn" id="codenav-btn-restart" title="Restart"><i class="fas fa-retweet"></i></i></button>`).appendTo(container)
  // }

  // /** */
  // _createNavButtons(container) {
  //   this.prevStmt = $(`
  //     <button type="button" class="btn kv-btn" id="codenav-btn-prev-stmt" title="Prev Statement">
  //       <i class="fas fa-arrow-up"></i>
  //     </button>`).appendTo(container)

  //   this.nextStmt = $(`
  //     <button type="button" class="btn kv-btn" id="codenav-btn-next-stmt" title="Next Statement">
  //       <i class="fas fa-arrow-down"></i>
  //     </button>`).appendTo(container)

  //   this.prevMemop = $(`
  //     <button type="button" class="btn kv-btn" id="codenav-btn-prev-rdwr" title="Prev RD/WR">
  //       <i class="fas fa-step-backward"></i>
  //     </button>`).appendTo(container)

  //   this.nextMemop = $(`
  //     <button type="button" class="btn kv-btn" id="codenav-btn-next-rdwr" title="Next RD/WR">
  //       <i class="fas fa-step-forward"></i>
  //     </button>`).appendTo(container)
  // }


  _createButtons() {
    this.#Start = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-start" title="Start"><i class="fas fa-play"></i><span>Start</span></button>`).appendTo(this.#Node)
    this.#Stop = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-stop" title="Stop"><i class="fas fa-stop"></i></button>`).appendTo(this.#Node)
    this.#Restart = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-restart" title="Restart"><i class="fas fa-retweet"></i></i></button>`).appendTo(this.#Node)
    this.#StmtPrev = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-prev-stmt" title="Previous Statement"><i class="fas fa-arrow-up"></i></button>`).appendTo(this.#Node)
    this.#StmtNext = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-next-stmt" title="Next Statement"><i class="fas fa-arrow-down"></i></button>`).appendTo(this.#Node)
    this.#LoopPrev = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-loop-next" title="Previous Iteration"><i class="fas fa-undo-alt"></i></button>`).appendTo(this.#Node)
    this.#LoopNext = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-loop-next" title="Next Iteration"><i class="fas fa-redo-alt"></i></button>`).appendTo(this.#Node)
    this.#LoopSkip = $(`<button type="button" class="btn kv-btn" id="codewalk-btn-loop-skip" title="Skip Loop"><i class="fas fa-share-square"></i></button>`).appendTo(this.#Node)
  }

  _createStatus() {
    this.#Status = $(`<div id="codewalk-status"></div>`).appendTo(this.#Node)
    this.#StatusPulse = $(`<div id="codewalk-status-pulse"></div>`).appendTo(this.#Status)
    this.#StatusText = $(`<div id="codewalk-status-text"></div>`).appendTo(this.#Status)
  }

  /**
   * @returns CodenavToolbarView
   */
  render() {
    if (this.isRendered())
      return this;
    this.#Node = $(`<div id='${this.id}'></div>`).appendTo(this.container)

    this._createButtons();
    this._createStatus();

    this.#Start.on('click', () => {
      this._startwalk()
      App.emit(Events.CODEWALK_START);
    })

    this.#Stop.on('click', () => {
      this._stopwalk()
      App.emit(Events.CODEWALK_STOP);
    })


    this.#Rendered = true
    this._initialize()
    return this
  }


  onStart(callback) { this.#Start.on('click', cb) }
  onStop(callback) { this.#Stop.on('click', cb)}


  _initialize() {
    if ( this.#Enabled) {
      this.#Start.removeAttr("disabled")
      this.#Stop.attr("disabled", "disabled")
      this.#Restart.attr("disabled", "disabled")
      this.#StmtPrev.attr("disabled", "disabled")
      this.#StmtNext.attr("disabled", "disabled")
      this.#LoopPrev.attr("disabled", "disabled")
      this.#LoopNext.attr("disabled", "disabled")
      this.#LoopSkip.attr("disabled", "disabled")
    }
  }

  _startwalk() {
    if ( this.#Enabled) {
      this.#StatusPulse.stop()
      this.#StatusPulse.show()
      this.#StatusPulse.removeClass("stop")
      this.#StatusPulse.addClass("start")
      this.#StatusText.stop()
      this.#StatusText.text("codewalk started").fadeIn('slow').animate({opacity:1},3000).fadeOut('slow');

      this.#Start.attr("disabled", "disabled")
      this.#Stop.removeAttr("disabled")
      this.#Restart.removeAttr("disabled")
      this.#StmtPrev.removeAttr("disabled")
      this.#StmtNext.removeAttr("disabled")
      this.#LoopPrev.removeAttr("disabled")
      this.#LoopNext.removeAttr("disabled")
      this.#LoopSkip.removeAttr("disabled")
    }
  }

  _stopwalk() {
    if ( this.#Enabled) {
      this.#StatusPulse.stop()
      this.#StatusPulse.removeClass("start")
      this.#StatusPulse.addClass("stop")
      this.#StatusText.stop()
      this.#StatusText.text("codewalk stopped").fadeIn('slow').animate({opacity:1},3000).fadeOut('slow');
      this.#StatusPulse.animate({opacity:1},3000).fadeOut('slow')
      this._initialize()

      this.#Start.removeAttr("disabled")
      this.#Stop.attr("disabled", "disabled")
      this.#Restart.attr("disabled", "disabled")
      this.#StmtPrev.attr("disabled", "disabled")
      this.#StmtNext.attr("disabled", "disabled")
      this.#LoopPrev.attr("disabled", "disabled")
      this.#LoopNext.attr("disabled", "disabled")
      this.#LoopSkip.attr("disabled", "disabled")
    }
  }

  enable() {
    if ( !this.#Enabled) {
      this.#Start.removeAttr("disabled")
      this.#Stop.attr("disabled", "disabled")
      this.#Restart.attr("disabled", "disabled")
      this.#StmtPrev.attr("disabled", "disabled")
      this.#StmtNext.attr("disabled", "disabled")
      this.#LoopPrev.attr("disabled", "disabled")
      this.#LoopNext.attr("disabled", "disabled")
      this.#LoopSkip.attr("disabled", "disabled")
      this.#Enabled = true
    }
    return this
  }

  disable() {
    if ( this.#Enabled) {
      this.#Start.attr("disabled", "disabled")
      this.#Stop.attr("disabled", "disabled")
      this.#Restart.attr("disabled", "disabled")
      this.#StmtPrev.attr("disabled", "disabled")
      this.#StmtNext.attr("disabled", "disabled")
      this.#LoopPrev.attr("disabled", "disabled")
      this.#LoopNext.attr("disabled", "disabled")
      this.#LoopSkip.attr("disabled", "disabled")
      this.#Enabled = false
    }
    return this
  }

}

module.exports = CodewalkToolbar