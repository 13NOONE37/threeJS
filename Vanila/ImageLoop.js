const canvas = document.querySelector('.myCanvas');
const canvasInfo = canvas.getBoundingClientRect();

const myImage = new Image();
myImage.src = './gandalf.png';

const ctx = canvas.getContext('2d');
const setCanvasDimension = () => {
  canvas.width = 100;
  canvas.height = 100;
};

window.addEventListener('resize', () => {
  setCanvasDimension();
  paint();
});

let scanned;
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
  const pixels = [];

  console.log(pixels);
});

const paint = () => {
  myImage.addEventListener('load', () => {
    ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    scanned = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.putImageData(scanned, 0, 0);
    console.log(scanned);
  });
};

setCanvasDimension();
paint();
