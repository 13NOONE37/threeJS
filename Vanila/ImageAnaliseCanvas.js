const canvas = document.querySelector('.myCanvas');
const ctx = canvas.getContext('2d');

const getWidth = () => 454;
const getHeight = () => 561;

const setCanvasDimension = () => {
  canvas.width = getWidth();
  canvas.height = getHeight();
};

window.addEventListener('resize', () => {
  setCanvasDimension();
  paint();
});

const paint = () => {
  const image1 = new Image();
  image1.src = 'deadpool.png'; //niektóre przeglądarki mogą blokować takie działanie wtedy można użyć zamienionego obrazku na base64

  image1.addEventListener('load', () => {
    ctx.drawImage(image1, 0, 0);
    const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(scannedImage);
    // canvas.toDataURL() zamieni canvas na string (base64)

    const scannedData = scannedImage.data;
    for (let i = 0; i < scannedData.length; i += 4) {
      const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
      const averageColorValue = total / 3; //wyciągamy średnią z poszególnych barw które składają się na kolor
      scannedData[i] = averageColorValue;
      scannedData[i + 1] = averageColorValue;
      scannedData[i + 2] = averageColorValue;
      //Jeśli w rgb damy takie same numery to będzie to odcień szarego;
      // Piewszy element (i) odpowieda wartości R; Drugi element G; Trzeci Element B; Czwarty Alpha
    }
    scannedImage.data = scannedData;

    ctx.putImageData(scannedImage, 0, 0);
  });
};

setCanvasDimension();
paint();
