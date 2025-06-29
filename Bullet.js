class Bullet {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.diameter = 7;
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }

  display() {
    push()
    // Draw the projectile
    fill(0, 250, 255);
    ellipse(this.x, this.y, this.diameter, this.diameter);
    pop()
  }

  isOutOfBounds() {
    // Check if projectile is outside the canvas
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}