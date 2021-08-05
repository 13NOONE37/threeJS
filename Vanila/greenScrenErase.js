const canvas = document.querySelector('.myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const paint = (base) => {
  const image = new Image();
  image.src = base;
  image.addEventListener('load', (e) => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  });
};

const myImg = document.querySelector('.myImg');
const input = document.querySelector('.fileInput');

input.addEventListener('change', function () {
  const file = this.files[0];
  //   console.log(file);
  if (file) {
    const reader = new FileReader();

    reader.addEventListener('load', function () {
      //   console.log(this.result);
      //   myImg.setAttribute('src', this.result);
      paint(this.result);
    });
    reader.readAsDataURL(file);
  }
});

const handleEraseBG = () => {
  const scanned = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < scanned.height; y++) {
    for (let x = 0; x < scanned.width; x++) {
      const index = (x + y * scanned.width) * 4;
      if (
        scanned.data[index] < 100 &&
        scanned.data[index + 2] < 100 &&
        scanned.data[index + 1] <= 255 &&
        scanned.data[index + 1] >= 200
      ) {
        scanned.data[index + 3] = 0;
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.putImageData(scanned, 0, 0);
};

document.querySelector('.eraseButton').addEventListener('click', handleEraseBG);
