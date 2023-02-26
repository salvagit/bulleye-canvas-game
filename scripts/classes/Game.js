import { Player } from "./Player.js";
import { Obstacle } from "./Obstacle.js";
import { Egg } from "./Egg.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.topMargin = 260;
    this.player = new Player(this);

    this.numberOfObstacles = 10;
    this.obstacles = [];

    this.maxEggs = 10;
    this.eggs = [];

    this.debug = false;

    this.fps = 70;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    this.eggTimer = 0;
    this.eggInterval = 500;

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

    window.addEventListener("keydown", ({ key }) => {
      if (key === 'd') {
        this.debug = !this.debug;
      }
    });
  }

  render(context, deltaTime) {
    // @todo fix grass overlay.
    // this.imageGrass.onload = () => {
    //   context.drawImage(this.imageGrass, 0, 0);
    // };

    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height);

      this.obstacles.forEach((obstacle) => obstacle.draw(context));
      this.eggs.forEach((egg) => egg.draw(context));
  
      this.player.draw(context);
      this.player.update();

      this.timer = 0;
    }
    this.timer += deltaTime;

    // add egg periodically
    if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer = 0;
      console.log(this.eggs)
    } else {
      this.eggTimer += deltaTime;
    }
  }

  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;

    const distance = Math.hypot(dy, dx);

    const sumOfRadii = a.collisionRadius + b.collisionRadius;

    return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
  }

  addEgg() {
    this.eggs.push(new Egg(this));
  }

  init() {
    let attempts = 0;

    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      const testObstacle = new Obstacle(this);
      let overlap = false;

      this.obstacles.forEach((obstacle) => {
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;

        const distance = Math.hypot(dy, dx);
        const distanceBuffer = 150;

        const sumOfRadii =
          testObstacle.collisionRadius +
          obstacle.collisionRadius +
          distanceBuffer;

        if (distance < sumOfRadii) {
          overlap = true;
        }
      });

      const margin = testObstacle.collisionRadius * 3;

      if (
        !overlap &&
        testObstacle.spriteX > 0 &&
        testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + margin &&
        testObstacle.collisionY < this.height - margin
      ) {
        this.obstacles.push(testObstacle);
      }

      attempts++;
    }
  }
}

export { Game };
