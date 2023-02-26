import { Game } from "./classes/Game.js";

window.addEventListener("load", () => {
  const canvas = document.querySelector(".canvas");

  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.font = "40px Helvetica";
  ctx.textAlign = "center";

  const game = new Game(canvas);
  game.init();

  let lastTime = 0;
  const animate = (timeStamp = 0) => {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  };

  animate();
});
