let fileInput = document.getElementById('file-input');
let brightness = document.getElementById('brightness');
let contrast = document.getElementById('contrast');
let transparent = document.getElementById('transparent');
let saveButton = document.getElementById('save-button');
let canvas;
let ctx;
let imageData;
let pixels;
let brightnessValue = parseInt(brightness.value, 10);

fileInput.addEventListener('change', function(ev) {
        console.log(ev.target.files);
        if(ev.target.files) {
            let file = ev.target.files[0];
            let reader  = new FileReader();

            reader.onloadend = function (e) {
                let image = new Image();
                image.src = e.target.result;
                image.onload = function(ev) {
                    console.log("Loading the image.");    
                    
                    drawImage(image);          
                }
            }

            reader.readAsDataURL(file);
        }
});

function drawImage(image) {
    canvas = document.getElementById('canvas');  

     // Set the canvas the same width and height of the image
    canvas.width = image.width;
    canvas.height = image.height;

    //To get started with image pixels, need to get the 2D context of the canvas with the getContext() method:
    ctx = canvas.getContext('2d'); 

    ctx.drawImage(image,0,0); 
}

function getImageData() {
    //Get ImageData object that stores array of the pixels:
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //Get a pixel array. It is stored inside imageData.data object:
    pixels = imageData.data; 
    console.log(pixels);    
}

/*
After that, can change the pixel values and apply them. The RBGA color model describes each pixel of the canvas. It means that each pixel is a set of 4 numbers, where the first number describes the red color intensity, the second number is the green color, the third number describes the blue color, and the fourth number is the alpha parameter that describes the pixel transparency. The alpha parameter is a number between 0 (completely transparent) and 255 (completely opaque).
*/

// Update the canvas with the new data
function updatedPixelsValues() {
    //Once  altered the pixels of the imageData object,  need to put the updated pixels values on the canvas with the putImageData() method of the context object:
    ctx.putImageData(imageData, 0, 0);
}


brightness.addEventListener('change', function (pixels, brightnessValue) {
    
    getImageData();
 console.log("pixels"); 
    console.log(pixels); 


    //If users change the brightness value - formula to change the initial pixel values:
    // RED = Truncate(RED + Brightness);
    // GREEN = Truncate(GREEN + Brightness);
    // BLUE = Truncate(BLUE + Brightness);

    for (let i = 0; i < pixels.length; i+= 4) {
    pixels[i] += 255 * (brightnessValue / 100);
    pixels[i+1] += 255 * (brightnessValue / 100);
    pixels[i+2] += 255 * (brightnessValue / 100);
    }

    updatedPixelsValues();
    console.log("pixels"); 
    console.log(pixels); 
});






contrast.addEventListener('change', function (value) {
   // updatedPixelsValues();
    //If users change the contrast value - formulas to change the pixel values:
    Factor = 259*(255 + Contrast)/(255*(259 - Contrast));
    RED = Truncate(Factor * (RED - 128) + 128);
    GREEN = Truncate(Factor * (GREEN - 128) + 128);
    BLUE = Truncate(Factor * (BLUE - 128) + 128);
    //Truncate keeps the values in the valid range, from 0 to +255. If a value goes below 0, it will be truncated to zero; if a value goes beyond 255, it will be truncated to 255.

   // updatedPixelsValues();
});

transparent.addEventListener('change', function (value) {
   // updatedPixelsValues();
    //If users change the transparency of the image - formula to change the initial pixel values:
    ALPHA = ALPHA * Transparent; 
    
    //updatedPixelsValues();
});