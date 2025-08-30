const canvas = document.getElementById("gameCanvas");
canvas.width = 400;
canvas.height = 600;
const ctx = canvas.getContext("2d");

let car, road, ui, obstacles, pickups, keys, score, gameOver, slowmoTimer;
let carColor = "red";
let fuelDrainRate = 0.001;
let touchLeft = false, touchRight = false;
let gyroSteer = 0, gyroActive = false;

function safeInit() {
  try {
    init();
  } catch (e) {
    alert("Error initializing game: " + e.message);
    console.error(e);
  }
}

function init() {
  car = new Car(175, 500, carColor);
  road = new Road();
  ui = new UI();
  obstacles = [];
  pickups = [];
  keys = {};
  score = 0;
  gameOver = false;
  slowmoTimer = 0;
  touchLeft = false;
  touchRight = false;
  gyroSteer = 0;
  ui.hideRestart();
  ui.updateScore(score);
  ui.updateFuel(car.fuel);
  ui.playBgMusic();
  requestAnimationFrame(loop);
}

function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  road.update(slowmoTimer > 0 ? 2 : 5);
  road.draw(ctx);

  handleControls();

  car.draw(ctx);

  // Fuel usage
  car.fuel -= fuelDrainRate;
  if (car.fuel <= 0) {
    gameOver = true;
    ui.showRestart(safeInit);
    ui.playCrashSound();
    return;
  }
  ui.updateFuel(car.fuel);

  // Obstacles
  if (Math.random() < 0.02) {
    obstacles.push(new Obstacle(Math.random() * 350, -100, slowmoTimer > 0 ? 2 : 5));
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const obs = obstacles[i];
    obs.update();
    obs.draw(ctx);

    if (obs.collides(car) && !car.shielded) {
      gameOver = true;
      ui.showRestart(safeInit);
      ui.playCrashSound();
    } else if (obs.collides(car) && car.shielded) {
      obstacles.splice(i, 1); // Destroy obstacle
      continue;
    }

    if (obs.y > canvas.height) {
      obstacles.splice(i, 1);
      score++;
      ui.updateScore(score);
    }
  }

  // Pickups
  if (Math.random() < 0.01) {
    pickups.push(new Pickup(Math.random() * 350, -50));
  }
  for (let i = pickups.length - 1; i >= 0; i--) {
    const pickup = pickups[i];
    pickup.update();
    pickup.draw(ctx);

    if (pickup.collides(car)) {
      ui.playPickupSound();
      switch (pickup.type) {
        case "fuel":
          car.refuel(0.3);
          break;
        case "shield":
          car.shielded = true;
          setTimeout(() => car.shielded = false, 3000);
          break;
        case "slowmo":
          slowmoTimer = 180; // 3 seconds at 60fps
          break;
      }
      pickups.splice(i, 1);
      continue;
    }
    if (pickup.y > canvas.height) {
      pickups.splice(i, 1);
    }
  }

  if (slowmoTimer > 0) slowmoTimer--;

  requestAnimationFrame(loop);
}

function handleControls() {
  // Desktop/keyboard
  car.move(keys);

  // Mobile touch
  if (touchLeft) car.x = Math.max(0, car.x - car.speed);
  if (touchRight) car.x = Math.min(canvas.width - car.width, car.x + car.speed);

  // Gyroscope
  if (gyroActive) {
    // Gyro steer normalized to [-1,1]
    car.x += car.speed * gyroSteer;
    car.x = Math.max(0, Math.min(canvas.width - car.width, car.x));
  }
}

document.addEventListener("keydown", e => (keys[e.key] = true), { passive: true });
document.addEventListener("keyup", e => (keys[e.key] = false), { passive: true });

window.onload = () => {
  safeInit();

  let restartBtn = document.getElementById("restartBtn");
  if (restartBtn) restartBtn.onclick = safeInit;

  let uiobj = new UI();
  let chooseCarBtn = uiobj.chooseCarBtn;
  if (chooseCarBtn) {
    chooseCarBtn.onclick = () => {
      uiobj.showCarSelection((selectedColor) => {
        carColor = selectedColor;
        safeInit();
      });
    };
  }

  // Touch controls
  const touchLeftBtn = document.getElementById("touchLeft");
  const touchRightBtn = document.getElementById("touchRight");
  if (touchLeftBtn && touchRightBtn) {
    // Touch events (passive for performance)
    touchLeftBtn.addEventListener('touchstart', e => { touchLeft = true; }, { passive: true });
    touchLeftBtn.addEventListener('touchend', e => { touchLeft = false; }, { passive: true });
    touchRightBtn.addEventListener('touchstart', e => { touchRight = true; }, { passive: true });
    touchRightBtn.addEventListener('touchend', e => { touchRight = false; }, { passive: true });

    // Mouse fallback
    touchLeftBtn.addEventListener('mousedown', e => { touchLeft = true; });
    touchLeftBtn.addEventListener('mouseup', e => { touchLeft = false; });
    touchRightBtn.addEventListener('mousedown', e => { touchRight = true; });
    touchRightBtn.addEventListener('mouseup', e => { touchRight = false; });
  }

  // Gyroscope/Accelerometer controls
  if (window.DeviceOrientationEvent) {
    // Permission for iOS/Android Chrome
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleGyro, { passive: true });
          gyroActive = true;
        }
      }).catch(() => { gyroActive = false; });
    } else {
      window.addEventListener('deviceorientation', handleGyro, { passive: true });
      gyroActive = true;
    }
  }
};

function handleGyro(event) {
  // event.gamma (-90 to 90) -- left/right tilt
  // Normalize for our game: -1 (full left) ... +1 (full right)
  // On some Androids, gamma is reversed, so adjust as needed
  gyroSteer = 0;
  if (typeof event.gamma === "number") {
    // Clamp gamma to [-45,45] for sensitivity
    let g = Math.max(-45, Math.min(45, event.gamma));
    gyroSteer = g / 45; // -1 to 1
  }
}
