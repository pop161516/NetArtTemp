
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

