
//----------------------------------------------------//
//access canvas
const canvas = document.getElementById('cnv_element');
const ctx = canvas.getContext('2d');

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

    canvas.addEventListener('pointerenter', () => {
        oscillators.forEach(osc => {
            osc.gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Turn sound on
        });
    });

    canvas.addEventListener('pointerleave', () => {
        oscillators.forEach(osc => {
             osc.gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Turn sound off
        });
    });

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
      introElement.style.transform = `translate(-50%, -50%) rotateY(${-gamma}deg) rotateX(${beta - 90}deg) rotateZ(${alpha + 90}deg)`;
    }
  }
//--------------------------------------------------//
//killing intro element using css
introElement.addEventListener("click", disappear);

  function disappear() {
    introElement.style.display = "none";
    console.log(`intro element closed :)`)
}

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

// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const oscillators = []; // Array to store oscillators for each pendulum
const masterGainNode = audioContext.createGain();  //Master gain
masterGainNode.connect(audioContext.destination);
masterGainNode.gain.value = 0.1; //Quieter sound


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

    // Create an oscillator for each pendulum
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';  // You can change the waveform (sine, square, sawtooth, triangle)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Initial frequency
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start silent
    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode); // Connect to the master gain
    oscillator.start();
    oscillators.push({ oscillator, gainNode }); // Store both
  
  canvas.addEventListener('touchstart', () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('AudioContext resumed'); // For debugging
        // Now that the context is resumed, turn on the sound
        oscillators.forEach(osc => {
          osc.gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        });
      });
    } else {
        oscillators.forEach(osc => {
          osc.gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        });
    }, { passive: true }); 

  canvas.addEventListener('pointerleave', () => {
    oscillators.forEach(osc => {
      osc.gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    });
  });
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

    // Control frequency based on pendulum's y position
    const y = pendulums[i].y2; // Y position of the second bob
    const minFrequency = 200;  // Minimum frequency (adjust as needed)
    const maxFrequency = 1000; // Maximum frequency (adjust as needed)
    const frequency = map(y, 0, height, maxFrequency, minFrequency); //Higher y = lower freq
    oscillators[i].oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  }
  frameCount++;
}

//------------- gyro -------------//
//function called by gyro controles
//maps beta(back adn forth) to the gravity 
function handlePenOrientation(event) {
  beta = event.beta;
  g = map(beta, -90, 90, -2, 2);  
}

function map(value, a1, a2, g1, g2) {
  return g1 + (g2 - g1) * (value - a1) / (a2 - a1);
}

setup();
draw();
