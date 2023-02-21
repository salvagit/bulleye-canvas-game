import { Game } from "./classes/Game.js";
import { Player } from "./classes/Player.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector(".canvas");

  const ctx = canvas.getContext("2d");

  const image = new Image();
  image.addEventListener('load', () => ctx.drawImage(image, 0, 0));
  image.src = "./images/overlay.png";

  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "white";

  const game = new Game(canvas);

  game.render(ctx);

  console.info("game rendered.");

  const animate = () => {};
});
