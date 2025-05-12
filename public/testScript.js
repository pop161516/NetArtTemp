
//--------------------------------------------------------------------------------//
//Checking gyro API works(for pop-up)
//code sorced from Google Gemini AI
if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handlePopUpOrientation);
          } else {
            console.log('Device orientation permission not granted.');
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handlePopUpOrientation);
    }
  } else {
    console.log("Device Orientation API is not supported on this device.");
  }

//---------------------------------------------------------------------------------------------------------------------------------//
//Gyro for intro element

//bibliography: 
//https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope
// https://youtu.be/bNmhX9464t4

const introElement = document.getElementById('interactiveElement');

  function handlePopUpOrientation(event) {
    //left right
    const alpha = event.alpha; 
    //forward backward
    const beta = event.beta; 
    //
    const gamma = event.gamma;

    if (introElement) {
      introElement.style.transform = `translate(-50%, -50%) rotateX(${gamma}deg) rotateZ(${beta - 90}deg) rotateY(${alpha + 90}deg)`;
    }
  }
//--------------------------------------------------//
//killing intro element using css
introElement.addEventListener("click", disappear);

  function disappear() {
    introElement.style.display = "none";
    console.log(`intro element closed :)`)
}
//----------------------------------------------------//
//access canvas
const canvas = document.getElementById('cnv_element');
const ctx = canvas.getContext('2d');

//---------------------------------------------------------------------------------//
//sketch, inspiered by https://www.youtube.com/watch?v=OJSzIaRRxG8 

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let g = 1;
let pendulums = [];
let num = 20;
let frameCount = 0;

// gyroscope data
let alpha = 0;
let beta = 0;
let gamma = 0;

//------------ set up ------------//
function setup() {
  //making num pendulums
  for (let i = 0; i < num; i++) {
    //starting position, offset a little for variation
    let angle1 = Math.PI / 4 + i * 0.05;
    let angle2 = Math.PI;
    //instance each pendulum using a class
    pendulums[i] = new Pendulum(angle1, angle2, 150, 150);
    pendulums[i].setCanvasDimensions(width, height);
    pendulums[i].currentG = g;
  }

//------- gyro compatibility -------//
//code sorced from Google Gemini AI
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(permissionState => {
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handlePenOrientation);
      } else {
        console.warn('Permission denied for device orientation.');
        }
    })
    .catch(error => {
      console.error('Error requesting device orientation permission:', error);
    });
    } else {
    window.addEventListener('deviceorientation', handlePenOrientation);
    }
}

//------------- draw -------------//
function draw() {
  requestAnimationFrame(draw);
  ctx.fillStyle = '#000000'; 
  ctx.fillRect(0, 0, width, height);

//draw and update each pendulum using a class
  for (let i = 0; i < num; i++) {
    pendulums[i].currentG = g; 
    pendulums[i].update();
    pendulums[i].display(ctx);
  }
  frameCount++;
}

function handlePenOrientation(event) {
  beta = event.beta;

  // Map beta to a gravity value.  Adjust these constants!
  g = map(beta, -90, 90, -2, 2);  // Map beta (-90 to +90) to g (-2 to +2)

  console.log("Gravity: " + g.toFixed(2));
}

function map(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

setup();
draw();
