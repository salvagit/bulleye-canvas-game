import { Particle } from "./Particle.js";

class Firefly extends Particle {
  update () {
    this.angle += this.va;
    this.collisionX += this.speedX;
    this.collisionY -= this.speedY;

    if (this.collisionX < 0 - this.radius) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }
  }
}

export { Firefly };