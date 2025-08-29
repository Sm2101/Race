class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 100;
    this.speed = 5;
  }

  move(keys) {
    if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
    if (keys["ArrowRight"] && this.x + this.width < 400) this.x += this.speed;
    if (keys["ArrowUp"] && this.y > 0) this.y -= this.speed;
    if (keys["ArrowDown"] && this.y + this.height < 600) this.y += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
