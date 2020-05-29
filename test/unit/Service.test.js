require('module-alias/register')

const expect = require('chai').expect

const Service = require('@renderer/services').Service

// const Service = require('../../src/renderer/services').Service

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
      service.onD
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
      // expect(service.hasStarted()).to.be.true
      // expect(service.hasStopped()).to.be.true
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

  describe("Callbacks", () => {
    describe("onStart", () => {
      it("should register if valid", () => {
        let service = new Service("AService")
        expect(service.onStart(() => console.log("started"))).to.be.true
      })

      it("should not register if invalid", () => {
        let service = new Service("AService")
        expect(service.onStart(10)).to.be.false
      })

      it("should have the correct argument", () => {
        let result = false
        let service = new Service("AService")
        service.onStart((self) => result = self === service)
        service.start()
        expect(result).to.be.true
      })

      it("should fire when start() is called", () => {
        let fired = false
        let service = new Service("AService")
        service.onStart(() => fired = true)
        service.start()
        expect(fired).to.be.true
      })

      it("should not fire on any other call", () => {
        let fired = false
        let service = new Service("AService")
        service.onStart(() => fired = true)
        service.enable()
        service.disable()
        service.stop()
        expect(fired).to.be.false
      })

      it("should fire only once", () => {
        let fired = 0
        let service = new Service("AService")
        service.onStart(() => fired++)
        service.start()
        service.start()
        service.start()
        service.start()
        expect(fired).to.equal(1)
      })

      it("should not fire if start() after stop()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onStart(() => fired++)
        service.start()
        service.stop()
        service.start()
        expect(fired).to.equal(1)
      })
    })

    describe("onStop", () => {
      it("should register if valid", () => {
        let service = new Service("AService")
        expect(service.onStop(() => console.log("started"))).to.be.true
      })

      it("should not register if invalid", () => {
        let service = new Service("AService")
        expect(service.onStop(10)).to.be.false
      })

      it("should have the correct argument", () => {
        let result = false
        let service = new Service("AService")
        service.onStop((self) => result = self === service)
        service.start().stop()
        expect(result).to.be.true
      })

      it("should not fire on any other call", () => {
        let fired = false
        let service = new Service("AService")
        service.onStop(() => fired = true)
        service.start()
        service.enable()
        service.disable()
        expect(fired).to.be.false
      })

      it("should fire only once", () => {
        let fired = 0
        let service = new Service("AService")
        service.onStop(() => fired++)
        service.stop()
        service.stop()
        service.stop()
        service.stop()
        expect(fired).to.equal(1)
      })
    })

    describe("onEnable", () => {
      it("should register if valid", () => {
        let service = new Service("AService")
        expect(service.onEnable(() => console.log("started"))).to.be.true
      })

      it("should not register if invalid", () => {
        let service = new Service("AService")
        expect(service.onEnable(10)).to.be.false
      })

      it("should have the correct argument", () => {
        let result = false
        let service = new Service("AService")
        service.onEnable((self) => result = self === service)
        service.enable()
        expect(result).to.be.true
      })

      it("should fire only once", () => {
        let fired = 0
        let service = new Service("AService")
        service.onEnable(() => fired++)
        service.enable()
        service.enable()
        service.enable()
        service.enable()
        expect(fired).to.equal(1)
      })

      it("should only fire once when enable() -> start()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onEnable(() => fired++)
        service.enable()
        service.start()
        expect(fired).to.equal(1)
      })

      it("should fire when start()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onEnable(() => fired++)
        service.start()
        expect(fired).to.equal(1)
      })

      it("should not fire after stop", () => {
        let fired = 0
        let service = new Service("AService")
        service.onEnable(() => fired++)
        service.start()
               .stop()
               .enable()
        expect(fired).to.equal(1)
      })
    })

    describe("onDisable", () => {
      it("should register if valid", () => {
        let service = new Service("AService")
        expect(service.onDisable(() => console.log("started"))).to.be.true
      })
  
      it("should not register if invalid", () => {
        let service = new Service("AService")
        expect(service.onDisable(10)).to.be.false
      })
  
      it("should have the correct argument", () => {
        let result = false
        let service = new Service("AService")
        service.onDisable((self) => result = self === service)
        service.start()
        service.disable()
        expect(result).to.be.true
      })

      it("should not fire before enable()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onDisable(() => fired++)

        service.disable()
        expect(fired).to.equal(0)

        service.enable()
        service.disable()
        expect(fired).to.equal(1)
      })

      it("should fire when start() => stop()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onDisable(() => fired++)
        service.start()
        service.stop()
        expect(fired).to.equal(1)
      })

      it("should not fire on init => stop()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onDisable(() => fired++)
        service.stop()
        expect(fired).to.equal(0)
      })
      
      it("should fire on start() => disable()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onDisable(() => fired++)
        service.start()
        service.disable()
        expect(fired).to.equal(1)
      })

      it("should not fire after stop()", () => {
        let fired = 0
        let service = new Service("AService")
        service.onDisable(() => fired++)
        service.stop()
        service.disable()
        expect(fired).to.equal(0)
      })
    })

    describe("onStateChange", () => {
      // it("should register if valid", () => {
      //   let service = new Service("AService")
      //   expect(service.
      // })
  
      it("should not register if invalid", () => {
        let service = new Service("AService")
        expect(service.onDisable(10)).to.be.false
      })
  
      it("should have the correct argument", () => {
        let result = false
        let service = new Service("AService")
        service.onDisable((self) => result = self === service)
        service.start()
        service.disable()
        expect(result).to.be.true
      })
    })
  })
})