const myImage = new Image();
myImage.src = './gandalf.png';
//inny sposób ładowania obrazków - bezpieczniejszy dla przeglądarek - mniej błędów;

myImage.addEventListener('load', () => {
  const canvas = document.querySelector('.myCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 840;

  const gradient1 = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height / 4,
  );
  gradient1.addColorStop(0.2, 'pink');
  gradient1.addColorStop(0.3, 'red');
  gradient1.addColorStop(0.4, 'orange');
  gradient1.addColorStop(0.5, 'yellow');
  gradient1.addColorStop(0.6, 'green');
  gradient1.addColorStop(0.7, 'turquoise');
  gradient1.addColorStop(0.8, 'violet');

  const letters = ['G', 'A', 'N', 'D', 'A', 'L', 'F'];
  let switcher = 1;
  let counter = 0;
  setInterval(() => {
    counter++;
    if (counter % 12 === 0) {
      switcher *= -1;
    }
  }, 500);

  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let particlesArray = [];
  const numberOfParticles = 5000; // liczba particlesów

  let mappedImage = [];

  const calcBright = (r, g, b) => {
    return Math.sqrt(r * r * 0.299 + g * g * 0.587 + b * b * 0.114) / 100; //tego dzielenia nie bylo
  };

  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[y * 4 * pixels.width + x * 4]; //explain https://youtu.be/UoTxOVEecbI?t=1979
      const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
      const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];

      const brightness = calcBright(red, green, blue);
      const cell = [
        (cellBrightnes = brightness),
        (cellColor = `rgb(${red}, ${green}, ${blue})`),
      ];
      row.push(cell);
    }
    mappedImage.push(row);
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 3;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.angle = 0;
      this.letter = letters[Math.floor(Math.random() * letters.length)];
      this.random = Math.random();
    }
    update() {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        this.speed = mappedImage[this.position1][this.position2][0];
      }

      let movement = 2.5 - this.speed + this.velocity;
      this.angle += this.speed / 20;
      this.size = this.speed * 2.2;

      // if (switcher === 1) {
      //   ctx.globalCompositeOperation = 'luminosity';
      // } else {
      //   ctx.globalCompositeOperation = 'soft-light';
      // }
      // if (counter % 10 === 0) {
      //   this.x = Math.random() * canvas.width;
      //   this.y = 0;
      // }

      this.y += movement;
      this.x += movement + Math.sin(this.angle) * 2; //jesli chcemy żeby poruszały się po skosie musimy dodać x
      if (this.x <= 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }
    draw() {
      ctx.beginPath();
      if (
        mappedImage[this.position1] &&
        mappedImage[this.position1][this.position2]
      ) {
        ctx.fillStyle = mappedImage[this.position1][this.position2][1];
        // ctx.strokeStyle = mappedImage[this.position1][this.position2][1];
      }

      // ctx.fillStyle = gradient1;
      // ctx.strokeRect(this.x, this.y, this.size * 2, this.size * 3);
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // ctx.font = '20px Arial';
      // if (this.random < 0.1) {
      //   ctx.fillText(this.letter, this.x, this.y);
      // } else {
      //   ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // }
      ctx.fill();
    }
  }
  const init = () => {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  };
  init();

  const animate = () => {
    // ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      // ctx.globalAlpha = particlesArray[i].speed * 0.5;
      ctx.globalAlpha = 1;
      particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
  };

  animate();
});
