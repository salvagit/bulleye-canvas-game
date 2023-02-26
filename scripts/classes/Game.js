import { Player } from "./Player.js";
import { Obstacle } from "./Obstacle.js";
import { Egg } from "./Egg.js";
import { Enemy } from "./Enemy.js";

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.topMargin = 260;
    this.player = new Player(this);

    this.numberOfObstacles = 10;
    this.obstacles = [];

    this.debug = false;

    this.fps = 70;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    this.eggTimer = 0;
    this.eggInterval = 500;

    this.maxEggs = 3;
    this.eggs = [];

    this.maxEnemies = 3;
    this.enemies = [];

    this.gameObjects = [];

    this.hatchLings = [];
    this.lostHatchLings = 0;
    this.score = 0;
    
    this.particles = [];

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
      if (key === "d") {
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

      this.gameObjects = [
        ...this.eggs,
        ...this.obstacles,
        this.player,
        ...this.enemies,
        ...this.hatchLings,
        ...this.particles,
      ];

      // sort by vertical position.
      this.gameObjects.sort((a, b) => a.collisionY - b.collisionY);

      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update(deltaTime);
      });

      this.timer = 0;
    }
    this.timer += deltaTime;

    // add egg periodically
    if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }

    // draw status text.
    context.save();
    context.textAlign = 'left';
    context.fillText(`Score: ${this.score}`, 35, 50);
    if (this.debug) {
      context.fillText(`Lost: ${this.lostHatchLings}`, 35, 100);
    }
    context.restore();
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

  addEnemy() {
    this.enemies.push(new Enemy(this));
  }

  removeGameObjects() {
    this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion);
    this.hatchLings = this.hatchLings.filter((egg) => !egg.markedForDeletion);
    this.particles = this.particles.filter((egg) => !egg.markedForDeletion);
  }

  init() {
    for (let i = 0; i < this.maxEnemies; i++) {
      this.addEnemy();
    }

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
