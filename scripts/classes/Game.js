import { Player } from "./Player.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.mouse = {
      x: this.width * 0.5,
      x: this.height * 0.5,
      pressed: false
    }

    // event listeners.
    canvas.addEventListener('click', (evt) => {
      const { offsetX, offsetY } = evt;
      console.log({ offsetX, offsetY });
    }, false);
  }

  render (context) {
    this.player.draw(context);
  }
}

export { Game };