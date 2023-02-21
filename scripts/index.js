import { Game } from "./classes/Game.js";
import { Player } from "./classes/Player.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector(".canvas");

  const ctx = canvas.getContext("2d");

  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  const game = new Game(canvas);

  console.info("game rendered.");
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  };

  animate();
});
