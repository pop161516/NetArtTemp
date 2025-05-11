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

  function handleOrientation(event) {
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    const myElement = document.getElementById('interactiveElement');
    if (myElement) {
      myElement.style.transform = `translate(-50%, -50%) rotateZ(${alpha}deg) rotateX(${beta}deg) rotateY(${gamma}deg)`;
    }
  }