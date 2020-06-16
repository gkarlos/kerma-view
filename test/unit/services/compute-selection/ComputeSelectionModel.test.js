require('module-alias/register')
const expect = require('chai').expect

const CudaDim = require('@renderer/cuda/CudaDim')
const CudaGrid = require('@renderer/cuda/CudaGrid')
const CudaBlock = require('@renderer/cuda/CudaBlock')
const CudaIndex = require('@renderer/cuda/CudaIndex')
const ComputeSelectionModel = require('@renderer/services/compute-selection').ComputeSelectionModel
const ComputeSelectionMode = require('@renderer/services/compute-selection').ComputeSelectionMode


describe("renderer/services/compute-selection/ComputeSelectionModel", () => {
  describe("computed properties / getters", () => {
    
    describe("grid / getGrid()", () => {
      it("should return the right value (1)", () => {
        let grid = new CudaGrid(1024)
        let model = new ComputeSelectionModel(grid, new CudaBlock(1024))

        expect(model.grid.equals(grid)).to.be.true
        expect(model.getGrid().equals(grid)).to.be.true
      })

      it("should return the right value (2)", () => {
        let grid = new CudaGrid(new CudaDim(1024))
        let model = new ComputeSelectionModel(grid, new CudaBlock(1024))

        expect(model.grid.equals(grid)).to.be.true
        expect(model.getGrid().equals(grid)).to.be.true
      })

      it("should return the right value (2)", () => {
        let grid = new CudaGrid(new CudaDim(1024,1024))
        let model = new ComputeSelectionModel(grid, new CudaBlock(1024))
        expect(model.grid.equals(grid)).to.be.true
        expect(model.getGrid().equals(grid)).to.be.true
      })
    })

    describe("block / getBlock()", () => {
      it("should return the right value (1)", () => {
        let grid = new CudaGrid(1024)
        let block = new CudaBlock(1024)
        let model = new ComputeSelectionModel(grid, block)
        expect(model.block.equals(block)).to.be.true
        expect(model.getBlock().equals(block)).to.be.true
      })

      it("should return the right value (2)", () => {
        let grid = new CudaGrid(1024)
        let block = new CudaBlock(new CudaDim(1024))
        let model = new ComputeSelectionModel(grid, block)
        expect(model.block.equals(block)).to.be.true
        expect(model.getBlock().equals(block)).to.be.true
      })

      it("should return the right value (3)", () => {
        let grid = new CudaGrid(1024)
        let block = new CudaBlock(new CudaDim(1024))
        let model = new ComputeSelectionModel(grid, block)
        expect(model.block.equals(block)).to.be.true
        expect(model.getBlock().equals(block)).to.be.true
      })

      it("should return the right value (4)", () => {
        let grid = new CudaGrid(1024)
        let block = new CudaBlock(new CudaDim(32,32))
        let model = new ComputeSelectionModel(1024, block)
        expect(model.block.equals(block)).to.be.true
        expect(model.getBlock().equals(block)).to.be.true
      })
    })
    
    describe("mode / getMode()", () => {
      it("should return the right value after construction (1)", () => {
        let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
        expect(model.mode).to.equal(ComputeSelectionMode.Thread)
        expect(model.getMode()).to.equal(ComputeSelectionMode.Thread)
      })

      it("should return the right value after construction (2)", () => {
        let model = new ComputeSelectionModel(1024, new CudaBlock(new CudaDim(32,32)), ComputeSelectionMode.Warp)
        expect(model.mode).to.equal(ComputeSelectionMode.Warp)
      })
    })
  })

  describe("inThreadMode", () => {
    it("should be true by default", () => {
      expect(new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(1024)).inThreadMode()).to.be.true
    })

    it("should be false when warp mode set in the constructor", () => {
      expect(new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(1024), ComputeSelectionMode.Warp).inThreadMode()).to.be.false
    })
  })

  describe("hasBlockSelected", () => {
    it("should be false initially", () => {
      expect(new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(1024)).hasBlockSelected()).to.be.false
    })

    it("should be true after selectBlock()", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectBlock(new CudaIndex(10,10))
      expect(model.hasBlockSelected()).to.be.true
    })
  })

  describe("hasWarpSelected", () => {
    it("should be false initially", () => {
      expect(new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(1024)).hasWarpSelected()).to.be.false
    })
  })

  describe("hasThreadSelected", () => {
    it("should be false initially", () => {
      expect(new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(1024)).hasThreadSelected()).to.be.false
    })
  })

  describe("selectBlock", () => {
    it("the correct block should be returned after selection (1)", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectBlock(0)
      expect(model.getBlockSelection().is1D()).to.be.true
      expect(model.getBlockSelection().x).to.equal(0)
    })

    it("the correct block should be returned after selection (2)", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectBlock(new CudaIndex(10))
      expect(model.getBlockSelection().is1D()).to.be.true
      expect(model.getBlockSelection().x).to.equal(10)
    })

    it("the correct block should be returned after selection (3)", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectBlock(new CudaIndex(10,10))
      expect(model.getBlockSelection().is2D()).to.be.true
      expect(model.getBlockSelection().x).to.equal(10)
      expect(model.getBlockSelection().y).to.equal(10)
    })
  })

  describe("selectThread", () => {
    it("the correct thread should be returned after selection", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectThread(new CudaIndex(10,10))
      expect(model.getThreadSelection().is2D()).to.be.true
      expect(model.getThreadSelection().x).to.equal(10)
      expect(model.getThreadSelection().y).to.equal(10)
    })

    it("should not change the default mode", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectThread(new CudaIndex(10,10))
      expect(model.getMode()).to.equal(ComputeSelectionMode.Thread)
    })

    it("should change the mode to thread after it has been explicitely set to warp in the constructor", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)), ComputeSelectionMode.Warp)
      model.selectThread(new CudaIndex(10,10))
      expect(model.getMode()).to.equal(ComputeSelectionMode.Thread)
    })

    it("should change the mode to thread after it has been explicitely set to warp with setMode", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.setMode(ComputeSelectionMode.Warp)
      model.selectThread(new CudaIndex(10,10))
      expect(model.getMode()).to.eql(ComputeSelectionMode.Thread)
    })
  })

  describe("selectWarp", () => {
    it("the correct thread should be returned after selection", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectWarp(new CudaIndex(10))
      expect(model.getWarpSelection().is1D()).to.be.true
      expect(model.getWarpSelection().x).to.equal(10)
      expect(model.getWarpSelection().y).to.equal(0)
    })

    it("should change the default mode", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectWarp(new CudaIndex(10))
      expect(model.getMode()).to.equal(ComputeSelectionMode.Warp)
    })

    it("should change the mode to warp after it has been explicitely set to thread with setMode", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)), ComputeSelectionMode.Warp)
      model.setMode(ComputeSelectionMode.Thread)
      model.selectWarp(new CudaIndex(10))
      expect(model.getMode()).to.eql(ComputeSelectionMode.Warp)
    })
  })

  describe("selectUnit", () => {
    it("TODO")
  })

  describe("setMode", () => {
    it("should change the mode correctly (1)", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      expect(model.setMode(ComputeSelectionMode.Warp)).to.be.true
      expect(model.getMode()).to.eql(ComputeSelectionMode.Warp)
    })

    it("should change the mode correctly (2)", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)), ComputeSelectionMode.Warp)
      expect(model.setMode(ComputeSelectionMode.Thread)).to.be.true
      expect(model.getMode()).to.eql(ComputeSelectionMode.Thread)
    })

    it("should clear selection on change thread -> warp", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectThread(new CudaIndex(0,0))
      model.setMode(ComputeSelectionMode.Warp)
      expect(model.hasThreadSelected()).to.be.false
    })

    it("should clear selection on change warp -> thread", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)), ComputeSelectionMode.Warp)
      model.selectWarp(new CudaIndex(0,0))
      model.setMode(ComputeSelectionMode.Thread)
      expect(model.hasWarpSelected()).to.be.false
    })

    it("should not clear selection on no change", () => {
      let model = new ComputeSelectionModel(new CudaGrid(1024), new CudaBlock(new CudaDim(32,32)))
      model.selectThread(new CudaIndex(0,0))
      expect(model.hasThreadSelected()).to.be.true
    })
  })

  describe("getBlockSelection", () => {
    it("TODO")
  })

  describe("getWarpSelection", () => {
    it("TODO")
  })

  describe("getThreadSelection", () => {
    it("TODO")
  })

  describe("getSelection", () => {
    it("TODO")
  })

  
})