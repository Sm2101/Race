class UI {
  constructor() {
    this.scoreElement = document.getElementById("score");
    this.restartBtn = document.getElementById("restartBtn");
    this.score = 0;
  }

  updateScore(value) {
    this.score = value;
    this.scoreElement.textContent = "Score: " + this.score;
  }

updateFuel(val) {
  document.getElementById('fuelBar').style.width = (val*100)+'%';
}
  
  showRestart(callback) {
    this.restartBtn.style.display = "block";
    this.restartBtn.onclick = callback;
  }

  hideRestart() {
    this.restartBtn.style.display = "none";
  }
}
