const canvas = document.querySelector('.myCanvas');

const ctx = canvas.getContext('2d');
const setCanvasDimension = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', () => {
  setCanvasDimension();
  paint();
});

let isDrawing = false;
window.addEventListener('mousedown', (e) => {
  isDrawing = true;
});
window.addEventListener('mouseup', (e) => {
  isDrawing = false;
});

let posX = 0;
let posY = 0;
canvas.addEventListener('mousemove', (e) => {
  if (e.offsetX) {
    posX = e.offsetX;
    posY = e.offsetY;
  } else if (e.layerX) {
    posX = e.layerX;
    posY = e.layerY;
  }
  ctx.moveTo(posX, posY);

  if (isDrawing) {
    // ctx.fillRect(posX, posY, 5, 5);
    // ctx.arc(posX, posY, 50, 0, 2.5 * Math.PI, false);
    // ctx.stroke();
    // ctx.fill();
    ctx.lineTo(posX, posY);
    ctx.stroke();
  }
});

const paint = () => {
  ctx.fillStyle = 'hsl(55, 70%, 40%)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.lineCap = 'square';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 10;
};

setCanvasDimension();
paint();
