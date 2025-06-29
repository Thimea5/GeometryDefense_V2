class Tower {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.aimAngle = 0;
    this.lastAimAngle = 0; // Stocke l'angle du dernier tir
    
    const scaleFactor = isMobile() ? 0.5 : 1;
    
    this.baseColor = color(255, 150, 150);
    this.baseDiameter = 210 * scaleFactor;

    this.initialPv = 1000;
    this.pv = this.initialPv;
    this.atk = 1;
    this.vitesse = 1;
    this.penetration = 1;
    this.nbBullet = 1;
    this.healRate = 5000;
    
    this.bullets = [];
    this.bulletSpeed = 7 * scaleFactor;
    this.lastShotTime = 0; 
    this.fireRate = 600; 
    
    this.mouseInfo = {'mouseX' : null, 'mouseY' : mouseY}
  }
  
  getInitialPv(){return this.initialPv;}
  getHealRate(){ return this.healRate;}
  
  getPenetration(){ return this.penetration; }
  
  setPenetration(_p) { this.penetration = _p; }
  
  getFireRate(){ return this.fireRate; }
  
  setFireRate(fr){
    this.fireRate = fr; 
    if(this.fireRate <= 200){
      document.getElementById('improveFireRate').style.display = 'none';
    }
  }
  
  getNbBullet() {return this.nbBullet;}
  
  setNbBullet(nb) { 
    this.nbBullet = nb;
    if(this.nbBullet >= 4){
      document.getElementById('addBullet').style.display = 'none';
    }
  }

  
  update(enemies) { this.aim(enemies); }
  
  shoot() {
    //
  let angleIncrement = radians(5); // Espacement entre chaque balle en angle
  let startAngle = this.aimAngle - (angleIncrement * (this.nbBullet - 1) / 2);

  // Boucle pour tirer le nombre de balles égal à nbBullet
  for (let i = 0; i < this.nbBullet; i++) {
    // Calculer l'angle de chaque balle
    let bulletAngle = startAngle + i * angleIncrement;

    let offsetX = random(-5, 5);
    let offsetY = random(-5, 5);

    let canonX = this.posX + (100 * cos(bulletAngle)) + offsetX;
    let canonY = this.posY + (100 * sin(bulletAngle)) + offsetY;

    // Créer la balle avec l'angle et le décalage calculés
    let bullet = new Bullet(canonX, canonY, bulletAngle, this.bulletSpeed);
    this.bullets.push(bullet);
  }

  // Stocker l'angle de tir pour maintenir l'orientation
  this.lastAimAngle = this.aimAngle;
}



  show(){
    const scaleFactor = isMobile() ? 0.5 : 1;
    const triangleSize = 50 * scaleFactor;
    
     // PIEDS
    push();
    fill(255);
    triangle(this.posX, this.posY, this.posX + triangleSize, this.posY + triangleSize / 2, this.posX + triangleSize / 5, this.posY + triangleSize);
    triangle(this.posX, this.posY, this.posX - triangleSize, this.posY + triangleSize / 2, this.posX - triangleSize / 5, this.posY + triangleSize);
    triangle(this.posX, this.posY, this.posX + triangleSize, this.posY - triangleSize / 2, this.posX + triangleSize / 5, this.posY - triangleSize);
    triangle(this.posX, this.posY, this.posX - triangleSize, this.posY - triangleSize / 2, this.posX - triangleSize / 5, this.posY - triangleSize);
    pop();

    //===== BASE =====
    push();
    fill(100, 120, 160);
    stroke(0)
    ellipse(this.posX, this.posY, 80, 80);
    pop();
  }

  aim(enemies) {
    if(mouseIsPressed){
      //print("testMouseIsPresse")
      this.aimAngle = atan2(mouseY - this.posY, mouseX - this.posX);
      if (millis() - this.lastShotTime >= this.fireRate) {
        this.shoot();
        this.lastShotTime = millis();
      }
    }
    else {
      //===== Permet de viser les ennemis automatiquement (le plus proche en premier)
    let closestEnemy = null;
    let shortestDist = Infinity;

    for (let enemy of enemies) {
      let distEnemy = dist(this.posX, this.posY, enemy.x, enemy.y);
      if (distEnemy < shortestDist) {
        shortestDist = distEnemy;
        closestEnemy = enemy;
      }
    }

    if (closestEnemy) {
      let xaim = closestEnemy.x - this.posX;
      let yaim = closestEnemy.y - this.posY;
      this.aimAngle = atan2(yaim, xaim);

      // Tirer et mettre à jour l'angle de visée
      if (millis() - this.lastShotTime >= this.fireRate) {
        this.shoot();
        this.lastShotTime = millis();
      }
    } else {
      // Maintenir l'angle du dernier tir si aucun ennemi
      this.aimAngle = this.lastAimAngle;
    }
    }
    // Tourner le contexte graphique
    push();
    translate(this.posX, this.posY); 
    rotate(this.aimAngle); 

    // Dessiner le canon après la rotation
    fill(255);
    rect(0, -10, 100, 20, 5); 
    rect(-20, -15, 60, 30, 5);
    fill(100, 120, 160);
    rect(80, -15, 10, 30, 5);
    pop();
    
    //Base
    push();
    noFill();
    stroke(255);
    strokeWeight(2);
    circle(this.posX, this.posY, this.baseDiameter);
    pop();

    for (let bullet of this.bullets) {
      bullet.update();
      bullet.display();
    }
  }
  
  getBaseDiameter(){ return this.baseDiameter; }
  
  getAtk(){ return this.atk; }
  
  setAtk(_atk){ this.atk = _atk; }
  
  getPv(){ return this.pv; }
  
  setPv(_pv){    
    this.pv = _pv;
    if(this.pv <= 0){
      //partie perdue : 0 hp
      this.pv = 0;
      document.getElementById('lose').style.display = 'flex';
      noLoop(); 

    }
  }
  
 showPv(x, y, h) {
  let lifePercentage = this.pv / this.initialPv; 
  let lifeWidth = 100 * lifePercentage; 

  // Fond de la barre de vie
  push();
  fill(150);
  rect(x - 2, y - 2, 104, h + 4); 
  pop();

  // Barre de vie actuelle
  push();
  fill(255, 100, 100); 
  rect(x, y, lifeWidth, h);
  pop();
   
   
   //text
   push();
   fill(255);
   textSize(12); 
   text(Math.floor(this.pv) + "/" + this.initialPv ,x +40 ,y +35);
   pop();
 }
  
}
