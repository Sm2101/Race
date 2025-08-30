// Pickup images must exist in your project folder
const PICKUP_TYPES = [
  { type: "fuel", color: "yellow", image: "fuel.png" },
  { type: "shield", color: "cyan", image: "shield.png" },
  { type: "slowmo", color: "purple", image: "slowmo.png" }
];

class Pickup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    let info = PICKUP_TYPES[Math.floor(Math.random() * PICKUP_TYPES.length)];
    this.type = info.type;
    this.color = info.color;
    this.image = new Image();
    this.image.src = info.image;
  }

  draw(ctx) {
    if (!ctx) return;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += 5;
  }

  collides(car) {
    if (!car) return false;
    return (
      this.x < car.x + car.width &&
      this.x + this.width > car.x &&
      this.y < car.y + car.height &&
      this.y + this.height > car.y
    );
  }
}
