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

    this.maxEggs = 5;
    this.eggs = [];

    this.maxEnemies = this.maxEggs;
    this.enemies = [];

    this.gameObjects = [];

    this.hatchLings = [];
    this.lostHatchLings = 0;
    this.score = 0;

    this.particles = [];

    this.winningScore = 30;
    this.maxLost = 10;

    this.gameOver = false;

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
      if (key === "r") {
        this.restart();
      }
    });
  }

  restart() {
    this.player.restart();
    this.eggs = [];
    this.enemies = [];
    this.obstacles = [];
    this.hatchLings = [];

    this.mouse = {
      x: this.width * 0.5,
      x: this.height * 0.5,
      pressed: false,
    };

    this.score = 0;
    this.lostHatchLings = 0;

    this.gameOver = false;

    this.init();
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
    if (
      this.eggTimer > this.eggInterval &&
      this.eggs.length < this.maxEggs &&
      !this.gameOver
    ) {
      this.addEgg();
      this.eggTimer = 0;
    } else {
      this.eggTimer += deltaTime;
    }

    // draw status text.
    context.save();
    context.textAlign = "left";
    context.fillText(`Score: ${this.score} / ${this.winningScore}`, 35, 50);
    if (this.debug) {
      context.fillText(`Lost: ${this.lostHatchLings} / ${this.maxLost}`, 35, 100);
    }
    context.restore();

    // win / lose message.
    if (
      this.score >= this.winningScore ||
      this.lostHatchLings >= this.maxLost
    ) {
      this.gameOver = true;

      context.save();

      context.fillStyle = "rgba(0, 0, 0, .5)";
      context.fillRect(0, 0, this.width, this.height);

      context.fillStyle = "white";
      context.textAlign = "center";

      context.shadowOffsetX = 4;
      context.shadowOffsetY = 4;
      context.shadowColor = "black";
      context.shadowBlur = 4;

      let message1 = "";
      let message2 = "";

      if (this.lostHatchLings < this.maxLost) {
        message1 = "Bullseye!!";
        message2 = "You bullied the bullies!!";
      } else {
        message1 = "Bullocks!";
        message2 = `You lost ${this.lostHatchLings} hatch lings, don't be a pushover!`;
      }

      context.font = "130px Bangers";
      context.fillText(message1, this.width / 2, this.height / 2 - 20);

      context.font = "40px Bangers";
      context.fillText(message2, this.width / 2, this.height / 2 + 30);

      context.fillText(
        `Final Score: ${this.score}, press R to butt heads again!`,
        this.width / 2,
        this.height / 2 + 80
      );

      context.restore();
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
