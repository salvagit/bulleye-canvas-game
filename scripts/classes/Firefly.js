import { Particle } from "./Particle.js";

class Firefly extends Particle {
  update () {
    this.angle += this.va;

    this.collisionX += Math.cos(this.angle) *  this.speedX;
    this.collisionY -= this.speedY;

    if (this.radius > .1) {
      this.radius -= .05;
    }

    if (this.radius < .2) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }

    if (this.collisionX < 0 - this.radius) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }
  }
}

export { Firefly };