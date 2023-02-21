class Player {
  constructor(game) {
    this.game = game;
    this.collisionX = this.game.width * .5;
    this.collisionY = this.game.height * .5;
    this.collisionRadius = 30;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI *  2);

    context.save();
    context.globalAlpha = 0.5;
    context.fill();
    context.restore();

    context.stroke();
  }
}

export { Player };