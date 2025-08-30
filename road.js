class Road {
  constructor() {
    this.lines = [];
    for (let i = 0; i < 20; i++) {
      this.lines.push({ x: 195, y: i * 40 });
    }
    this.bgY = 0;
    this.bgImage = new Image();
    this.bgImage.src = "road_bg.png"; // must exist in your folder
  }

  draw(ctx) {
    if (!ctx) return;
    // Animated background
    ctx.drawImage(this.bgImage, 0, this.bgY, 400, 600);
    ctx.drawImage(this.bgImage, 0, this.bgY - 600, 400, 600);

    ctx.fillStyle = "white";
    this.lines.forEach(line => {
      ctx.fillRect(line.x, line.y, 10, 20);
    });
  }

  update(speed) {
    this.bgY += speed;
    if (this.bgY >= 600) this.bgY = 0;
    this.lines.forEach(line => {
      line.y += speed;
      if (line.y > 600) line.y -= 600;
    });
  }
}
