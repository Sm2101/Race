const canvas = document.getElementById("gameCanvas");
canvas.width = 400;
canvas.height = 600;
const ctx = canvas.getContext("2d");

let car, road, ui;
let obstacles = [];
let keys = {};
let score = 0;
let gameOver = false;

function init() {
  car = new Car(175, 500);
  road = new Road();
  ui = new UI();
  obstacles = [];
  score = 0;
  gameOver = false;
  ui.hideRestart();
  loop();
}

function loop() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  road.update(5);
  road.draw(ctx);

  car.move(keys);
  car.draw(ctx);

  if (Math.random() < 0.02) {
    obstacles.push(new Obstacle(Math.random() * 350, -100, 5));
  }

  obstacles.forEach((obs, index) => {
    obs.update();
    obs.draw(ctx);

    if (obs.collides(car)) {
      gameOver = true;
      ui.showRestart(init);
    }

    if (obs.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
      ui.updateScore(score);
    }
  });

  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => (keys[e.key] = true));
document.addEventListener("keyup", e => (keys[e.key] = false));

init();
