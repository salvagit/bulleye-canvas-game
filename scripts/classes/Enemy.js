class Enemy {
  constructor(game) {
    this.game = game;

    this.speedX = Math.random() * 3 + 0.5;

    this.image = document.querySelector(".toad");

    this.spriteWidth = 140;
    this.spriteHeight = 260;

    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    this.collisionRadius = 30;
    this.collisionX =
      this.game.width + this.width + Math.random() * this.game.width * 0.5;
    this.collisionY =
      this.game.topMargin +
      Math.random() * (this.game.height - this.game.topMargin);

    this.spriteX;
    this.spriteY;
  }

  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY);

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
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height + 40;

    this.collisionX -= this.speedX;

    if (this.spriteX + this.width < 0) {
      this.collisionX =
        this.game.width + this.width + Math.random() * this.game.width * 0.5;

      this.collisionY =
        this.game.topMargin +
        Math.random() * (this.game.height - this.game.topMargin);
    }

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
  }
}

export { Enemy };
