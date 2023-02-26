import { Firefly } from "./Firefly.js";

class Larva {
  constructor(game, x, y) {
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.collisionRadius = 30;

    this.image = document.querySelector('.larva');

    this.spriteWidth = 150;
    this.spriteHeight = 150;

    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    this.spriteX;
    this.spriteY;

    this.speedY = 1 + Math.random();

    this.markedForDeletion = false;

    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 2);
  }

  draw(context) {
    // context.drawImage(this.image, this.spriteX, this.spriteY);
    context.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.spriteX,
      this.spriteY,
      this.width,
      this.height
    );

    if (this.game.debug) {
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.collisionRadius,
        0,
        Math.PI * 2
      );

      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();

      context.stroke();
    }
  }

  update() {
    this.collisionY -= this.speedY;
    this.spriteX = this.collisionX - this.width * .5;
    this.spriteY = this.collisionY - this.height * .5 - 50;

    // move to safety;
    if (this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
      this.game.score++;
      for (let index = 0; index < 3; index++) {
        this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'));
      }
    }
    
    // collision with objects.
    const collisionObjects = [this.game.player, ...this.game.obstacles];

    collisionObjects.forEach((object) => {
      const [collision, distance, sumOfRadii, dx, dy] =
        this.game.checkCollision(this, object);

      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;

        this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });

    // collision with enemies.
    this.game.enemies.forEach(enemy => {
      const [ collision ] = this.game.checkCollision(this, enemy);

      if (collision) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
        this.game.lostHatchLings++;
      }
    });
  }
}

export { Larva };
