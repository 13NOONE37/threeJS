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

let particlesArray = [];

const mouse = {
  x: null,
  y: null,
  radius: 50,
};
window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
  mouse.radius = 150;
  //   console.log(mouse.x, mouse.y);
});

const paint = () => {
  ctx.fillStyle = '#fff';
  ctx.font = '30px Verdana';
  ctx.fillText('$👽🐈', 0, 40);
  const textCoordinates = ctx.getImageData(0, 0, 200, 100);

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = 3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 40 + 5;
    }

    draw() {
      ctx.fillStyle = 'hsl(15,100%,75%)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        // this.size = 50;
        this.x -= directionX; //dzieki minusowi sie odpychaja
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 5;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 5;
        }
      }
    }
  }

  const init = () => {
    particlesArray = [];

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
      for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
        if (
          textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
        ) {
          let positionX = x;
          let positionY = y;
          particlesArray.push(new Particle(positionX * 12, positionY * 12));
        }
      }
    }
  };
  init();

  const connect = () => {
    let opacityValue = 1;

    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          opacityValue = 1 - distance / 30;
          ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].draw();
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  };
  animate();

  //   ctx.strokeStyle = 'white';
  //   ctx.strokeRect(0, 0, 200, 100);
};

setCanvasDimension();
paint();
