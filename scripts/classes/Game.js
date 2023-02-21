import { Player } from "./Player.js";
import { Obstacle } from "./Obstacle.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);

    this.numberOfObstacles = 10;
    this.obstacles = [];

    this.mouse = {
      x: this.width * 0.5,
      x: this.height * 0.5,
      pressed: false,
    };

    // @todo: fix overlay image after requestAnimationFrame.
    this.imageGrass = new Image();
    this.imageGrass.src = "../images/overlay.png";

    // event listeners.
    canvas.addEventListener("mousedown", ({ offsetX, offsetY }) => {
      this.mouse.x = offsetX;
      this.mouse.y = offsetY;
      this.pressed = true;
    });

    canvas.addEventListener("mouseup", ({ offsetX, offsetY }) => {
      this.mouse.x = offsetX;
      this.mouse.y = offsetY;
      this.pressed = false;
    });

    canvas.addEventListener("mousemove", ({ offsetX, offsetY }) => {
      if (this.mouse.pressed) {
        this.mouse.x = offsetX;
        this.mouse.y = offsetY;
      }
    });
  }

  render(context) {
    this.imageGrass.onload = () => {
      context.drawImage(this.imageGrass, 0, 0);
    }

    this.player.draw(context);
    this.player.update();

    this.obstacles.forEach(obstacle => obstacle.draw(context));
  }

  init() {
    let attempts = 0;

    while(this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      const testObstacle = new Obstacle(this);
      let overlap = false;

      this.obstacles.forEach(obstacle => {
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;

        const distance = Math.hypot(dy, dx);

        const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;

        if (distance < sumOfRadii){
          overlap = true;
        }
      });
      
      if (!overlap) {
        this.obstacles.push(testObstacle);
      }

      attempts++;
    }
  }
}

export { Game };
