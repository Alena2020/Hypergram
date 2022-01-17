const fileInput = document.getElementById('file-input');
const canvas = document.getElementById('canvas'); 
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const transparentSlider = document.getElementById('transparent');
const saveButton = document.getElementById('save-button');

let image = new Image();
// To get started with image pixels, you need to get the 2D context of the canvas with the getContext() method:
let ctx = canvas.getContext('2d'); 

fileInput.addEventListener('change', function(ev) {        
        if(ev.target.files) {
            let file = ev.target.files[0];
            let reader  = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = function (e) {                
                image.src = e.target.result;
                image.onload = function() {
                    console.log("Loading the image."); 
                    // Set the canvas the same width and height of the image
                    canvas.width = image.width;
                    canvas.height = image.height;
                    
                    ctx.drawImage(image,0,0);
                    resetSliders();
                }
            }
        }
});

brightnessSlider.addEventListener('change', function () {
  changedPixelValues();
});
contrastSlider.addEventListener('change', function () {
  changedPixelValues();
});
transparentSlider.addEventListener('change', function () {
  changedPixelValues();
});

saveButton.addEventListener('click', function () {
  // get canvas data  
    let image = canvas.toDataURL();  
  
    // create temporary link  
    let tmpLink = document.createElement( 'a' );  
    tmpLink.download = 'result.png'; // set the name of the download file 
    tmpLink.href = image;  
  
    // temporarily add link to body and initiate the download  
    document.body.appendChild( tmpLink );  
    tmpLink.click();  
    document.body.removeChild( tmpLink );   
});

/*
  The RGBA color model describes each pixel of the canvas. 
  It means that each pixel is a set of 4 numbers, where the first number describes the red color intensity, 
  the second number is the green color, the third number describes the blue color, 
  and the fourth number is the alpha parameter that describes the pixel transparency. 
  The alpha parameter is a number between 0 (completely transparent) and 255 (completely opaque).

  The pixels are stored in a one-dimensional array; the first 4 numbers describe the first pixel, the second 4 numbers describe the second pixel, and so on:

  pixels[0] // the RED value of the first pixel
  pixels[1] // the GREEN value of the first pixel
  pixels[2] // the BLUE value of the first pixel
  pixels[3] // the ALPHA value of the first pixel

  pixels[4] // the RED value of the second pixel
  pixels[5] // the GREEN value of the second pixel
  pixels[6] // the BLUE value of the second pixel
  pixels[7] // the ALPHA value of the second pixel

  If users change the brightness value, use the following formula to change the initial pixel values:

  RED = Truncate(RED + Brightness)
  GREEN = Truncate(GREEN + Brightness)
  BLUE = Truncate(BLUE + Brightness)

  If users change the contrast value, use the following formulas to change the pixel values:

  Factor = 259*(255+Contrast)/(255*(259-Contrast))
  RED= Truncate(Factor * (RED - 128) + 128)
  GREEN = Truncate(Factor * (GREEN - 128) + 128)
  BLUE = Truncate(Factor * (BLUE - 128) + 128)
*/

function changedPixelValues() {
    let brightness = parseInt(brightnessSlider.value);
    let contrast = parseInt(contrastSlider.value);
    let transparent = parseFloat(transparentSlider.value);

    ctx.drawImage(image, 0, 0);
    // After that, you have to get ImageData object that stores array of the pixels:
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Now, you can get a pixel array. It is stored inside imageData.data object:
    let pixels = imageData.data;
    let factor = 259 * (255 + contrast) / (255 * (259 - contrast));

    for (let i = 3; i < pixels.length; i += 4) {
        for (let j = 1; j < 4; j++) {
            pixels[i-j] = truncate(factor * (pixels[i-j] - 128) + 128 + brightness);
        }

        pixels[i] *= transparent;
    }

    imageData.data = pixels;

    /*
      Once  altered the pixels of the imageData object,  
      need to put the updated pixels values on the canvas with 
      the putImageData() method of the context object:
     */
    ctx.putImageData(imageData, 0, 0);

    console.log("brightnessSlider.value =" + brightnessSlider.value);
    console.log("contrastSlider.value =" + contrastSlider.value); 
    console.log("transparentSlider.value =" + transparentSlider.value);   
}

/*  
  Truncate keeps the values in the valid range, from 0 to +255. 
  If a value goes below 0, it will be truncated to zero; 
  if a value goes beyond 255, it will be truncated to 255. 
*/

function truncate(value) {
    if (value < 0) {
        return 0;
    } else if (value > 255) {
        return 255;
    } else {
        return value;
    }
}

function resetSliders() {
    contrastSlider.value = 0;
    brightnessSlider.value = 0;
    transparentSlider.value = 1;

    contrastSlider.dispatchEvent(new Event("change"));
    brightnessSlider.dispatchEvent(new Event("change"));
    transparentSlider.dispatchEvent(new Event("change"));
}