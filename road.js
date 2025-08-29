class Road {
  constructor() {
    this.lines = [];
    for (let i = 0; i < 20; i++) {
      this.lines.push({ x: 195, y: i * 40 });
    }
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    this.lines.forEach(line => {
      ctx.fillRect(line.x, line.y, 10, 20);
    });
  }

  update(speed) {
    this.lines.forEach(line => {
      line.y += speed;
      if (line.y > 600) line.y = 0;
    });
  }
}
