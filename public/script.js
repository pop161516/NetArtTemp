document.body.style.margin   = 0
document.body.style.overflow = `hidden`

const cnv = document.getElementById (`cnv_element`)
cnv.width = innerWidth
cnv.height = innerHeight

const ctx = cnv.getContext (`2d`)

let gyroscope = new Gyroscope({ frequency: 60 });

gyroscope.addEventListener("reading", (e) => {
  console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
  console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
  console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
});
gyroscope.start();


const draw_frame = ms => {
   ctx.fillStyle = `red`
   ctx.fillRect (0, 0, innerWidth, innerHeight)

   const seconds = (ms / 1000)
   requestAnimationFrame (draw_frame)
}

draw_frame ()



onresize = () => {
   cnv.width = innerWidth
   cnv.height = innerHeight   
}