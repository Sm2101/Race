const canvas = document.getElementById("gameCanvas");
canvas.width = 400;
canvas.height = 600;
const ctx = canvas.getContext("2d");

let car, road, ui, obstacles, pickups, keys, score, gameOver, slowmoTimer;
let carColor = "red";
let fuelDrainRate = 0.001;

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

  car.move(keys);
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
  obstacles.forEach((obs, index) => {
    obs.update();
    obs.draw(ctx);

    if (obs.collides(car) && !car.shielded) {
      gameOver = true;
      ui.showRestart(safeInit);
      ui.playCrashSound();
    } else if (obs.collides(car) && car.shielded) {
      obstacles.splice(index, 1); // Destroy obstacle
    }

    if (obs.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
      ui.updateScore(score);
    }
  });

  // Pickups
  if (Math.random() < 0.01) {
    pickups.push(new Pickup(Math.random() * 350, -50));
  }
  pickups.forEach((pickup, index) => {
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
      pickups.splice(index, 1);
    }
    if (pickup.y > canvas.height) {
      pickups.splice(index, 1);
    }
  });

  if (slowmoTimer > 0) slowmoTimer--;

  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => (keys[e.key] = true));
document.addEventListener("keyup", e => (keys[e.key] = false));

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
};
