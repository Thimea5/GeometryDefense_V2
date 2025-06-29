class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = color(255, 0, 0);
    this.diameter = 20;
    this.speed = 0.3; 
    this.initialPv = 3;
    this.pv = this.initialPv;
    this.atk = 0.5;
    this.xp = 1;
  }
  
  getXp(){ return this.xp;}
  
  shootedAnimation() {
    if (this.pv < this.initialPv / 3) {
      this.color = color(255, 255, 100); 
    } else if (this.pv < this.initialPv / 2) {
      this.color = color(255, 153, 51);
    } else {
      this.color = color(255, 0, 0);
    }
  }

  spawn() {
    push();
    fill(this.color);
    rect(this.x, this.y, this.diameter, this.diameter);
    pop();
  }

  move(towerX, towerY) {
    // Calculer la direction entre l'ennemi et la tour
    let angleToTower = atan2(towerY - this.y, towerX - this.x);

    // Mettre à jour les coordonnées de l'ennemi
    this.x += this.speed * cos(angleToTower);
    this.y += this.speed * sin(angleToTower);

    if (this.x < 0 || this.x > width) {
      this.x = constrain(this.x, 0, width); 
    }
    if (this.y < 0 || this.y > height) {
      this.y = constrain(this.y, 0, height);
    }
  }
  
  getPv() {
    return this.pv;
  }
  
  isDead() {
    return this.pv <= 0;
  }
  
  setPv(_pv) {
    this.pv = _pv;
    this.shootedAnimation();
  }
  
  getDiameter() {
    return this.diameter;
  }
  
  getAtk() {
    return this.atk;
  }
}
