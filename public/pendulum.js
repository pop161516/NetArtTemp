//Code inspiered by https://www.youtube.com/watch?v=OJSzIaRRxG8 

function Pendulum(angle1, angle2, length1, length2) {
  this.x0 = null; 
  this.y0 = null; 
  this.angle1 = angle1;
  this.angle2 = angle2;
  this.angleV1 = 0;
  this.angleV2 = 0;
  this.angleA1 = 0;
  this.angleA2 = 0;
  this.m1 = 1;
  this.m2 = 1;
  this.length1 = length1;
  this.length2 = length2;
}

Pendulum.prototype.setCanvasDimensions = function(width, height) {
  this.x0 = width / 2;
  this.y0 = height / 2;
};

Pendulum.prototype.update = function() {

  const g = this.currentG;
  const sin = Math.sin;
  const cos = Math.cos;

  this.x1 = this.x0 + this.length1 * sin(this.angle1);
  this.y1 = this.y0 + this.length1 * cos(this.angle1);
  this.x2 = this.x1 + this.length2 * sin(this.angle2);
  this.y2 = this.y1 + this.length2 * cos(this.angle2);

  this.angleA1 =
    (-g * (2 * this.m1 + this.m2) * sin(this.angle1) -
      this.m2 * g * sin(this.angle1 - 2 * this.angle2) -
      2 *
        sin(this.angle1 - this.angle2) *
        this.m2 *
        (this.angleV2 * this.angleV2 * this.length2 +
          this.angleV1 * this.angleV1 * this.length1 * cos(this.angle1 - this.angle2))) /
    (this.length1 *
      (2 * this.m1 +
        this.m2 -
        this.m2 * cos(2 * this.angle1 - 2 * this.angle2)));

  this.angleA2 =
    (2 *
      sin(this.angle1 - this.angle2) *
      (this.angleV1 * this.angleV1 * this.length1 * (this.m1 + this.m2) +
        g * (this.m1 + this.m2) * cos(this.angle1) +
        this.angleV2 *
          this.angleV2 *
          this.length2 *
          this.m2 *
          cos(this.angle1 - this.angle2))) /
    (this.length2 *
      (2 * this.m1 +
        this.m2 -
        this.m2 * cos(2 * this.angle1 - 2 * this.angle2)));

  this.angleV1 += this.angleA1;
  this.angleV2 += this.angleA2;

  const maxAngularVelocity = 0.245; // Adjust this value as needed
  this.angleV1 = Math.max(-maxAngularVelocity, Math.min(this.angleV1, maxAngularVelocity));
  this.angleV2 = Math.max(-maxAngularVelocity, Math.min(this.angleV2, maxAngularVelocity));


  this.angle1 += this.angleV1;
  this.angle2 += this.angleV2;

  // this.angleV1 *= 0.99;
  // this.angleV2 *= 0.99;


};

Pendulum.prototype.display = function(ctx) {
  // ctx.beginPath();
  // ctx.moveTo(this.x0, this.y0);
  // ctx.lineTo(this.x1, this.y1);
  // ctx.stroke();

  // ctx.beginPath();
  // ctx.moveTo(this.x1, this.y1);
  // ctx.lineTo(this.x2, this.y2);
  // ctx.stroke();

  // Calculate the linear velocity of the second bob
  const v1x = this.angleV1 * this.length1 * Math.cos(this.angle1);
  const v1y = -this.angleV1 * this.length1 * Math.sin(this.angle1);
  const v2x = v1x + this.angleV2 * this.length2 * Math.cos(this.angle2);
  const v2y = v1y - this.angleV2 * this.length2 * Math.sin(this.angle2);
  const velocitySquared = v2x * v2x + v2y * v2y;
  const velocity = Math.sqrt(velocitySquared);

  // Map velocity to a yellow color component (0-255)
  // You might need to adjust the scaling factor to get the desired range
  const maxVelocity = 20; // Adjust this based on the typical velocity range
  let colourComponent = Math.min(255, Math.max(0, Math.round((velocity / maxVelocity) * 255)));

  // Set the fill color (red and green are full, blue is zero)
  ctx.fillStyle = `rgb(${colourComponent}, ${colourComponent}, 0)`;

  ctx.beginPath();
  ctx.arc(this.x2, this.y2, 10, 0, 2 * Math.PI);
  ctx.fill();
};