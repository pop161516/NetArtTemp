
//------------------------------------------------------------------------//
//Checking gyro API works
if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            console.log('Device orientation permission not granted.');
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  } else {
    console.log("Device Orientation API is not supported on this device.");
  }

//--------------------------------------------------------------------------------------------------------------------------------//
//Gyro for intro element
const introElement = document.getElementById('interactiveElement');

  function handleOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    if (introElement) {
      introElement.style.transform = `translate(-50%, -50%) rotateX(${alpha + 90}deg) rotateZ(${beta - 90}deg) rotateY(${gamma}deg)`;
    }
  }

//--------------------------------------------------//
//killing intro element
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
//sketch!
/*
  let g = 1; 

  let x0, y0;
  let x1, y1;
  let x2, y2;

  let length1 = 100;
  let length2 = 100;

  let m1 = 1;
  let m2 = 1;

  let angle1;
  let angle2;

  let angleV1 = 0;
  let angleV2 = 0;

  let angleA1 = 0;
  let angleA2 = 0;

  function setup() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    x0 = canvas.width / 2;
    y0 = canvas.height / 2;

    angle1 = Math.PI / 5;
    angle2 = Math.PI;
  }

  function draw() {
    ctx.fillStyle = '#FFFFFF'; // Equivalent of background(220)
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';

    x1 = x0 + length1 * Math.sin(angle1);
    y1 = y0 + length1 * Math.cos(angle1);
    x2 = x1 + length2 * Math.sin(angle2);
    y2 = y1 + length2 * Math.cos(angle2);

    angleA1 =
      (-g * (2 * m1 + m2) * Math.sin(angle1) +
       -m2 * g * Math.sin(angle1 - 2 * angle2) +
       -2 * Math.sin(angle1 - angle2) *
         m2 *
         (angleV2 * angleV2 * length2 +
          angleV1 * angleV1 * length1 * Math.cos(angle1 - angle2))) /
      (length1 * (2 * m1 + m2 - m2 * Math.cos(2 * angle1 - 2 * angle2)));
    angleA2 =
      (2 * Math.sin(angle1 - angle2) *
       (angleV1 * angleV1 * length1 * (m1 + m2) +
        g * (m1 + m2) * Math.cos(angle1) +
        angleV2 * angleV2 * length2 * m2 * Math.cos(angle1 - angle2))) /
      (length2 * (2 * m1 + m2 - m2 * Math.cos(2 * angle1 - 2 * angle2)));

    angleV1 += angleA1;
    angleV2 += angleA2;

    angle1 += angleV1;
    angle2 += angleV2;

    // Draw the first link
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    // Draw the second link
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Draw the second mass
    ctx.beginPath();
    ctx.arc(x2, y2, 10, 0, 2 * Math.PI); // Equivalent of ellipse(x2, y2, 10, 10)
    ctx.fill();

    requestAnimationFrame(draw); // Continue the animation loop
  }

  setup();
  draw(); // Start the animation

*/

//-----//
//sketch2
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let g = 1;
let pendulums = [];
let num = 10;

function setup() {
  for (let i = 0; i < num; i++) {
    let angle1 = Math.PI / 4 + i * 0.01;
    let angle2 = Math.PI;
    pendulums[i] = new Pendulum(angle1, angle2, 100, 100);
    pendulums[i].setCanvasDimensions(width, height);
    pendulums[i].currentG = g; // Initialize gravity for each pendulum
  }
}

function draw() {
  requestAnimationFrame(draw);
  ctx.fillStyle = '#FFFFFF)'; 
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000000';


//   if (frameCount % 1000 < 500) {
//     g = 1;
//   } else {
//     g = -1;
//   }
//   console.log(g);

  for (let i = 0; i < num; i++) {
    // pendulums[i].currentG = g; // Update gravity for each pendulum
    pendulums[i].update();
    pendulums[i].display(ctx);
  }

  frameCount++;
}

let frameCount = 0;
setup();
draw();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  for (let i = 0; i < num; i++) {
    pendulums[i].setCanvasDimensions(width, height);
  }
});