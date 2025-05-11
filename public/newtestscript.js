const canvas = document.getElementById('pendulumCanvas');
const ctx = canvas.getContext('2d');
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
  ctx.fillStyle = 'rgb(220, 220, 220)'; // Equivalent to background(220)
  ctx.fillRect(0, 0, width, height);

  if (frameCount % 1000 < 500) {
    g = 1;
  } else {
    g = -1;
  }
  console.log(g);

  for (let i = 0; i < num; i++) {
    pendulums[i].currentG = g; // Update gravity for each pendulum
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