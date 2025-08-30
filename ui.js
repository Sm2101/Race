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

  updateScore(value) {
    this.score = value;
    if (this.scoreElement) this.scoreElement.textContent = "Score: " + this.score;
    this.updateHighScore();
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('highScore', this.highScore);
    }
    if (this.highScoreElement) this.highScoreElement.textContent = "High Score: " + this.highScore;
  }

  updateFuel(val) {
    if (this.fuelBar) {
      this.fuelBar.style.background = "linear-gradient(to right, #fd0 " + (val * 100) + "%, #555 " + (val * 100) + "%)";
    }
  }

  playCrashSound() {
    if (this.crashSound) {
      this.crashSound.currentTime = 0;
      this.crashSound.play();
    }
  }

  playPickupSound() {
    if (this.pickupSound) {
      this.pickupSound.currentTime = 0;
      this.pickupSound.play();
    }
  }

  playBgMusic() {
    if (this.bgMusic && this.bgMusic.paused) {
      this.bgMusic.volume = 0.5;
      this.bgMusic.play();
    }
  }

  showRestart(callback) {
    if (this.restartBtn) {
      this.restartBtn.style.display = "block";
      this.restartBtn.onclick = callback;
    }
  }

  hideRestart() {
    if (this.restartBtn) this.restartBtn.style.display = "none";
  }

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
