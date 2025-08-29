class Obstacle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 100;
    this.speed = speed;
  }

  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed;
  }

  collides(car) {
    return (
      this.x < car.x + car.width &&
      this.x + this.width > car.x &&
      this.y < car.y + car.height &&
      this.y + this.height > car.y
    );
  }
}
