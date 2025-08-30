class UI {
  constructor() {
    this.scoreElement = document.getElementById("score");
    this.highScoreElement = document.getElementById("highScore");
    this.fuelBar = document.getElementById("fuelBar");
    this.restartBtn = document.getElementById("restartBtn");
    this.chooseCarBtn = document.getElementById("chooseCarBtn");
    this.carSelection = document.getElementById("carSelection");
    this.score = 0;
    this.highScore = Number(localStorage.getItem('highScore')) || 0;
    this.updateHighScore();
    this.crashSound = new Audio('crash.mp3');
    this.pickupSound = new Audio('pickup.mp3');
    this.bgMusic = document.getElementById("bgMusic");
  }

  // ... other methods ...

  showCarSelection(callback) {
    if (!this.carSelection) return;
    this.carSelection.style.display = "block";
    let options = this.carSelection.querySelectorAll('.carOption');
    options.forEach(btn => {
      btn.onclick = () => {
        callback(btn.dataset.car);
        this.carSelection.style.display = "none";
      };
    });
  }
}
