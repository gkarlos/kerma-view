require('module-alias/register')

const expect = require('chai').expect

NotificationModel = require('@renderer/services/notification/NotificationModel')
const NotificationType = require('@renderer/services/notification/NotificationType')

describe("NotificationModel", () => {
  describe("constructor", () => {
    it('should work with no options', () => {
      let notification = new NotificationModel()
      expect(notification.title).to.equal("")
      expect(notification.message).to.equal("")
      expect(notification.details).to.equal("")
      expect(notification.type).to.equal(NotificationModel.Type.Default)
    })

    it('should work with missing options', () => {
      let notification = new NotificationModel({
        title : "title",
        type : NotificationModel.Type.Error
      })
      expect(notification.title).to.equal("title")
      expect(notification.type).to.equal(NotificationModel.Type.Error)
      expect(notification.message).to.equal("")
      expect(notification.details).to.equal("")
    })

    it('should work with full options', () => {
      let notification = new NotificationModel({
        title : "title",
        type : NotificationModel.Type.Warning,
        message: "message",
        details: "some details"
      })
      expect(notification.title).to.equal("title")
      expect(notification.type).to.equal(NotificationModel.Type.Warning)
      expect(notification.message).to.equal("message")
      expect(notification.details).to.equal("some details")
    })
  })

  describe("getters", () => {
    it('should work', () => {
      let notification = new NotificationModel({
        title : "title",
        type : NotificationModel.Type.Warning,
        message: "message",
        details: "some details"
      })
      expect(notification.getTitle()).to.equal("title")
      expect(notification.getType()).to.equal(NotificationModel.Type.Warning)
      expect(notification.getMessage()).to.equal("message")
      expect(notification.getDetails()).to.equal("some details")
    })
  })

  describe("setters", () => {
    it('should work', () => {
      let notification = new NotificationModel({
        title : "title",
        type : NotificationModel.Type.Warning,
        message: "message",
        details: "some details"
      })
      expect(notification.getTitle()).to.equal("title")
      expect(notification.getType()).to.equal(NotificationModel.Type.Warning)
      expect(notification.getMessage()).to.equal("message")
      expect(notification.getDetails()).to.equal("some details")

      expect(notification.setTitle('abc').getTitle()).to.equal('abc')
      expect(notification.setType(NotificationModel.Type.Error).getType()).to.equal(NotificationModel.Type.Error)
      expect(notification.setMessage('def').getMessage()).to.equal('def')
      expect(notification.setDetails('ghi').getDetails()).to.equal('ghi')
    })
  })
})