// Car images must exist in your project folder
const CAR_IMAGES = {
  red: "red_car.png",
  blue: "blue_car.png",
  green: "green_car.png"
};

class Car {
  constructor(x, y, color = "red") {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 100;
    this.speed = 5;
    this.color = color;
    this.image = new Image();
    this.image.src = CAR_IMAGES[color] || CAR_IMAGES.red;
    this.shielded = false;
    this.fuel = 1; // Range 0-1
  }

  move(keys) {
    if (keys["ArrowLeft"] && this.x > 0) this.x -= this.speed;
    if (keys["ArrowRight"] && this.x + this.width < 400) this.x += this.speed;
    if (keys["ArrowUp"] && this.y > 0) this.y -= this.speed;
    if (keys["ArrowDown"] && this.y + this.height < 600) this.y += this.speed;
  }

  draw(ctx) {
    if (!ctx) return;
    ctx.save();
    if (this.shielded) {
      ctx.shadowColor = 'cyan';
      ctx.shadowBlur = 20;
    }
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  refuel(amount) {
    this.fuel = Math.min(1, this.fuel + amount);
  }
}
