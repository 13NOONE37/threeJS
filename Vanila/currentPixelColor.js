const canvas = document.querySelector('.myCanvas');
const canvasInfo = canvas.getBoundingClientRect();

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
  console.log(posX, posY);
  let r = scanned.data[(posX + posY * scanned.width) * 4];
  let g = scanned.data[(posX + posY * scanned.width) * 4 + 1];
  let b = scanned.data[(posX + posY * scanned.width) * 4 + 2];
  let a = scanned.data[(posX + posY * scanned.width) * 4 + 3];

  document.querySelector('body').style.background = `rgba(${r},${g},${b},${a})`;
});

const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'hsl(10,50%,30%)');
gradient.addColorStop(0.13131313131313133, 'hsl(40,50%,30%)');
gradient.addColorStop(0.21212121212121213, 'hsl(90,50%,30%)');
gradient.addColorStop(0.30303030303030304, 'hsl(150,50%,30%)');
gradient.addColorStop(0.51010101010101, 'hsl(180,50%,30%)');
gradient.addColorStop(0.7171717171717171, 'hsl(220,50%,30%)');
gradient.addColorStop(1, 'hsl(120,50%,30%)');

const paint = () => {
  // ctx.fillStyle = '#fff';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  scanned = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < scanned.height; y += 4) {
    for (let x = 0; x < scanned.width; x += 4) {
      let index = (x + y * scanned.width) * 4; //first value of pixel so red; np.  x=1; y=1; dodajemy i  mnożymy razy szerokość np. 100 otrzymujemy 200 i mnożymy razy 4 aby otrzymać index pierwszego pixela czyli dostajemy 800
      // scanned.data[index] = 255; //red
      // scanned.data[index + 1] = 255; //green
      // scanned.data[index + 2] = 255; //blue
      // scanned.data[index + 3] = 255; //alpha
    }
  }

  ctx.clearRect(0, 0, 50, 50);
  ctx.putImageData(scanned, 0, 0);
};

setCanvasDimension();
paint();
