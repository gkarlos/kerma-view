const rand = require("@renderer/util/random").getRandomInt

const Colors = () => {
  let colors = {
    darkseagreen: "#8fbc8f",
    dodgerblue: "#1e90ff",
    darkorange: "#ff8c00",
    gold: "#ffd700",
    lightsalmon: "#ffa07a",
    lightskyblue: "#87cefa",
    mediumorchid: "#ba55d3",
    mediumspringgreen: "#00fa9a",
    plum: "#dda0dd",
    yellowgreen: "#9acd32"
  }

  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }

  let curr = rand(0,10)

  function next() {
    return colors[curr++ % Object.keys(colors).length];
  }
}

module.exports = Colors;