class UI {
  constructor() {
    this.scoreElement = document.getElementById("score");
    this.restartBtn = document.getElementById("restartBtn");
    this.score = 0;
    this.crashSound = new Audio('...');
  }

  updateScore(value) {
    this.score = value;
    this.scoreElement.textContent = "Score: " + this.score;
  }

  updateFuel(val) {
    const fuelBar = document.getElementById('fuelBar');
    if (fuelBar) {
      fuelBar.style.width = (val * 100) + '%';
    }
  }

  playCrashSound() {
    this.crashSound.play();
  }

  showRestart(callback) {
    this.restartBtn.style.display = "block";
    this.restartBtn.onclick = callback;
  }

  hideRestart() {
    this.restartBtn.style.display = "none";
  }

  saveHighScore(score, highScore) {
    if (score > highScore) {
      localStorage.setItem('highScore', score);
    }
  }
}
