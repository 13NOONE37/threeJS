const canvas = document.querySelector('.myCanvas');
const ctx = canvas.getContext('2d');

const setCanvasDimension = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const paint = () => {
  //   ctx.fillStyle = 'red';
  //   ctx.fillRect(100, 100, 100, 100);

  //   ctx.fillStyle = 'white';
  //   ctx.font = '20px Arial monospace';
  //   ctx.fillText('oliwer', 355, 355, 500);

  //   ctx.arc(400, 400, 160, 110, Math.PI * 2);
  //   ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  //   ctx.strokeRect(400, 400, 400, 400);

  //   ctx.beginPath();
  //   ctx.moveTo(100, 100);
  //   ctx.lineTo(100, 500);
  //   ctx.lineTo(500, 300);
  //   ctx.fill();

  //emote
  //   ctx.beginPath();
  //   ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
  //   ctx.moveTo(110, 75);
  //   ctx.arc(75, 75, 35, 0, Math.PI, false);
  //   ctx.moveTo(65, 65);
  //   ctx.arc(60, 65, 5, 0, Math.PI * 2, true);
  //   ctx.moveTo(95, 65);
  //   ctx.arc(90, 65, 5, 0, Math.PI * 2, true);
  //   ctx.stroke();

  //   ctx.beginPath();
  //   ctx.moveTo(window.innerWidth / 2, window.innerHeight / 2);
  //   ctx.lineTo(100, 100);
  //   ctx.closePath();
  //   ctx.stroke();

  // Quadratric curves example
  //   ctx.beginPath();
  //   ctx.moveTo(75, 25);
  //   ctx.quadraticCurveTo(25, 25, 25, 62.5);
  //   ctx.quadraticCurveTo(25, 100, 50, 100);
  //   ctx.quadraticCurveTo(50, 120, 30, 125);
  //   ctx.quadraticCurveTo(60, 120, 65, 100);
  //   ctx.quadraticCurveTo(125, 100, 125, 62.5);
  //   ctx.quadraticCurveTo(125, 25, 75, 25);
  //   ctx.stroke();

  //   ctx.beginPath();
  //   ctx.moveTo(100, 100);
  //   ctx.quadraticCurveTo(3, 1235, 3, 3);
  //   ctx.quadraticCurveTo(100, 100, 200, 500);

  //   ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(75, 40);
  ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
  ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
  ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
  ctx.fill();

  for (let i = 0; i < 1000; i += 50) {
    for (let j = 0; j < 1000; j += 50) {
      ctx.fillStyle = `hsl(${
        Math.round(Math.random() * Math.random() * 100) % 360
      }, 50%, 50%)`;
      console.log(
        `hsl(${
          Math.round(Math.random() * Math.random() * 100) % 360
        }, 50%, 50%)`,
      );
      ctx.fillRect(i, j, 50, 50);
    }
  }
};

window.addEventListener('resize', () => {
  setCanvasDimension();
  paint();
});

setCanvasDimension();
paint();
