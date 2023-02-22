import { Game } from "./classes/Game.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector(".canvas");

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  const game = new Game(canvas);
  game.init();

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  };

  animate();
});
