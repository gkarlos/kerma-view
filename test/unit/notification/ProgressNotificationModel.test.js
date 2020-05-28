const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "..", "..", "..", "src"))

const expect = require('chai').expect

const ProgressNotificationModel = require('renderer/services/notification/ProgressNotificationModel')

describe("ProgressNotificationModel", () => {
  describe("getters", () => {

    let notification = new ProgressNotificationModel({
      type : ProgressNotificationModel.Info,
      title : "title",
      message : "message",
      details : "details",
      total : 20
    })

    describe("getTotalProgress", () => {
      it("should return the right value on simple use", () => {
        expect(notification.getTotalProgress()).to.equal(20)
        let notification2 = new ProgressNotificationModel({total: Infinity})
        expect(notification2.getTotalProgress()).to.equal(Number.POSITIVE_INFINITY)
      })

      it("should not be affected by simple progress update", () => {
        let notification2 = new ProgressNotificationModel({total: 100})

        let before = notification2.getTotalProgress()
        notification2.progress(20)
        let after = notification2.getTotalProgress()

        expect(before).to.equal(after)
      })
    })

    describe("getCurrentProgress", () => {
      it("should return 0 at the start of finite progress notification", () => {
        expect(notification.getCurrentProgress()).to.equal(0)
      })

      it("should return NEGATIVE_INFINITY at the start of infinite progress notification", () => {
        let notification2 = new ProgressNotificationModel({total: Infinity})
        expect(notification2.getCurrentProgress()).to.equal(Number.NEGATIVE_INFINITY)
      })

      it("should never exceed total progress", () => {
        let notification2 = new ProgressNotificationModel({total: 100})
        notification2.progress(120)
        expect(notification2.getCurrentProgress()).to.equal(notification2.getTotalProgress())
      })
    })

    describe("getCurrentProgressInfo", () => {
      it("should return a string if one was passed last time progress was updated", () => {
        let notification2 = new ProgressNotificationModel({total:100})
        notification2.progress(10, "hello")
        expect(notification2.getCurrentProgressInfo()).to.equal("hello")
        notification2.progress(100, "hello2")
        expect(notification2.getCurrentProgressInfo()).to.equal("hello2")
      })
      it("should return undefined if no info was passed last time progress was updated", () => {
        let notification2 = new ProgressNotificationModel({total:100})
        notification2.progress(20)
        expect(notification2.getCurrentProgressInfo()).to.be.undefined
      })
    })

    describe("isInfinite", () => {
      it("should return true if total is Infinity", () => {
        let notification2 = new ProgressNotificationModel({total: Infinity})
        expect(notification2.isInfinite()).to.be.true
      })

      it("should return false if total is finite", () => {
        let notification2 = new ProgressNotificationModel()
        expect(notification2.isInfinite()).to.be.false
      })
    })

    describe("hasStarted", () => {
      it("should return false before progress() is called", () => {
        let notification2 = new ProgressNotificationModel()
        expect(notification2.hasStarted()).to.be.false
      })

      it("should return true after the first progress() call", () => {
        let notification2 = new ProgressNotificationModel()
        let notification3 = new ProgressNotificationModel({total:Infinity})
        
        notification2.progress(10);
        notification3.progress(10);
        expect(notification2.hasStarted()).to.be.true
        expect(notification3.hasStarted()).to.be.true
      })
    })
  })

  describe("progress", () => {
    it("should update finite progress correctly", () => {
      let notification2 = new ProgressNotificationModel({total:100})
      expect(notification2.getCurrentProgress()).to.equal(0)
      notification2.progress(20)
      expect(notification2.getCurrentProgress()).to.equal(20)
      notification2.progress()
      expect(notification2.getCurrentProgress()).to.equal(20)
      notification2.progress(200)
      expect(notification2.getCurrentProgress()).to.equal(100)
    })

    it("should ignore value if the notification has infinite progress", () =>  {
      let notification2 = new ProgressNotificationModel({total: Infinity})
      let before = notification2.getCurrentProgress()
      notification2.progress(10)
      notification2.progress(10)
      let after = notification2.getCurrentProgress()
      expect(before).to.equal(Number.NEGATIVE_INFINITY)
      expect(after).to.equal(Number.POSITIVE_INFINITY)
    })
  })

  describe("isCompleted", () => {
    it("should return true after complete() is called", () => {
      let notification2 = new ProgressNotificationModel()
      let notification3 = new ProgressNotificationModel({total:Infinity})
      notification2.complete()
      expect(notification2.isCompleted()).to.be.true
      notification3.complete()
      expect(notification3.isCompleted()).to.be.true
    })

    it("should return false before complete() is called on infinite progress", () => {
      let notification2 = new ProgressNotificationModel({total:Infinity})
      expect(notification2.isCompleted()).to.be.false
    })

    it("should return false before current progress equals total progress", () => {
      let notification2 = new ProgressNotificationModel()
      expect(notification2.isCompleted()).to.be.false
      notification2.progress(10)
      expect(notification2.isCompleted()).to.be.false
      notification2.progress(40)
      expect(notification2.isCompleted()).to.be.false
      notification2.progress(50)
      expect(notification2.isCompleted()).to.be.true
    })
  })

  describe("complete", () => {
    it("should complete finite progress notification", () => {
      let notification2 = new ProgressNotificationModel()
      notification2.complete()
      expect(notification2.isCompleted()).to.be.true
    })

    it("should complte infinite progress notification", () => {
      let notification2 = new ProgressNotificationModel({total:Infinity})
      notification2.complete()
      expect(notification2.isCompleted()).to.be.true
    })

    it("should be idempotent", () => {
      let notification2 = new ProgressNotificationModel()
      notification2.complete()
      expect(notification2.isCompleted()).to.be.true
      notification2.complete()
      notification2.complete()
      notification2.complete()
      notification2.complete()
      notification2.complete()
      notification2.complete()
      expect(notification2.isCompleted()).to.be.true

      let notification3 = new ProgressNotificationModel({total:Infinity})
      notification3.complete()
      expect(notification3.isCompleted()).to.be.true
      notification3.complete()
      notification3.complete()
      notification3.complete()
      notification3.complete()
      notification3.complete()
      notification3.complete()
      expect(notification3.isCompleted()).to.be.true
    })
  })
})