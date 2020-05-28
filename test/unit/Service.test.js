const path = require('path')
require('app-module-path').addPath(path.join(__dirname, "..", "..", "src"))

const expect = require('chai').expect

const Service = require('renderer/services').Service

describe("Service", () => {
  describe("Constructor", () => {
    it("should throw without name", () => {
      expect(() => new Service()).to.throw
    })

    it("should not throw with name", () => {
      expect(() => new Service("HelloService")).to.not.throw
    })
  })

  describe("State Machine", () => {
    it("init :: Disabled, Not Online, Not Started, Not Stopped", () => {
      expect(new Service("AbcService").isDisabled()).to.be.true
      expect(new Service("AbcService").isEnabled()).to.be.false
      expect(new Service("AbcService").hasStarted()).to.be.false
      expect(new Service("AbcService").hasStopped()).to.be.false
    })

    it("init,start :: Enabled, Started, Not Stopped", () => {
      let service = new Service("AService")
      service.start()
      expect(service.isEnabled()).to.be.true
      expect(service.isDisabled()).to.be.false
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.false
    })

    it("init,stop :: Disabled, Not Started, Stopped", () => {
      let service = new Service("AService")
      service.stop()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.false
      expect(service.hasStopped()).to.be.true
    })

    it("init,enable :: Enable, Not Started, Not Stopped", () => {
      let service = new Service("AService")
      service.enable()
      expect(service.isEnabled()).to.be.true
      expect(service.isDisabled()).to.be.false
      expect(service.hasStarted()).to.be.false
      expect(service.hasStopped()).to.be.false
    })

    it("init,disable :: Disabled, Not Started, Not Stopped", () => {
      let service = new Service("AService")
      service.disable()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.false
      expect(service.hasStopped()).to.be.false
    })

    it("init,enable,disable :: Disabled, Not Started, Not Stopped", () => {
      let service = new Service("AService")
      service.enable().disable()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.false
      expect(service.hasStopped()).to.be.false
    })

    it("init,enable,start :: Enabled, Started, Not Stopped", () => {
      let service = new Service("AService")
      service.enable().start()
      expect(service.isEnabled()).to.be.true
      expect(service.isDisabled()).to.be.false
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.false
    })

    it("init,start,enable :: Enabled, Started, Not Stopped", () => {
      let service = new Service("AService")
      service.start().enable()
      expect(service.isEnabled()).to.be.true
      expect(service.isDisabled()).to.be.false
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.false
    })
    
    it("init,start,disable :: Disabled, Started, Not Stopped", () => {
      let service = new Service("AService")
      service.start().disable()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.false
    })

    it("init,start,disable,enable :: Enabled, Started, Not Stopped", () => {
      let service = new Service("AService")
      service.start().disable().enable()
      expect(service.isEnabled()).to.be.true
      expect(service.isDisabled()).to.be.false
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.false
    })

    
    it("init,start,disable,enable,stop :: Disabled, Started, Stopped", () => {
      let service = new Service("AService")
      service.start().disable().enable().stop()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.true
    })

    it("init,start,disable,enable,stop,enable :: Disabled, Started, Stopped", () => {
      let service = new Service("AService")
      service.start().disable().enable().stop().enable()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.true
    })

    it("init,start,disable,enable,stop,start :: Disabled, Started, Stopped", () => {
      let service = new Service("AService")
      service.start().disable().enable().stop().start()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.true
    })

    it("init,start,disable,enable,stop,disable :: Disabled, Started, Stopped", () => {
      let service = new Service("AService")
      service.start().disable().enable().stop().disable()
      expect(service.isEnabled()).to.be.false
      expect(service.isDisabled()).to.be.true
      expect(service.hasStarted()).to.be.true
      expect(service.hasStopped()).to.be.true
    })
  })
})