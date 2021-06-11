const canvas = document.querySelector('.myCanvas');
const ctx = canvas.getContext('2d');

const getWidth = () => window.innerWidth;
const getHeight = () => window.innerHeight;

const setCanvasDimension = () => {
  canvas.width = getWidth();
  canvas.height = getHeight();
};

window.addEventListener('resize', () => {
  setCanvasDimension();
  paint();
});

let xPos = 0;
const paint = () => {
  //   let yPos = 0;
  //   const rectSize = getWidth() / 25;

  //   for (let i = 0; i <= 50; i++) {
  //     for (let j = 0; j <= 50; j++) {
  //       const r = Math.abs(Math.sin((Date.now() * i) / 100)) * 100;
  //       const g = Math.abs(Math.sin((Date.now() * i) / 200)) * 200;
  //       const b = Math.abs(Math.sin((Date.now() * i) / 300)) * 300;

  //       ctx.fillStyle = `rgb(${r},${g},${b})`;
  //       ctx.fillRect(xPos, yPos, rectSize, rectSize);
  //       yPos += rectSize + 2;
  //     }
  //     xPos += rectSize + 2;
  //     yPos = 0;
  //   }
  ctx.fillStyle = 'pink';
  ctx.clearRect(0, 0, getWidth(), getHeight());
  ctx.fillRect(
    Math.abs(300 + Math.sin(Date.now() * 0.001) * 500),
    10,
    200,
    200,
  );
  xPos++;
  window.requestAnimationFrame(paint);
};

setCanvasDimension();
paint();
