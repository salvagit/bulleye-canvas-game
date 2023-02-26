import { Particle } from "./Particle.js";

class Spark extends Particle {
  update () {
    this.angle += this.va * .5;

    this.collisionX -= Math.sin(this.angle) * this.speedX;
    this.collisionY -= Math.cos(this.angle) * this.speedY;

    if (this.radius > .1) {
      this.radius -= .05;
    }

    if (this.radius < .2) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }
  }
}

export { Spark };