class Raindrop {
  constructor() {
    this.x = random(width); // Position x aléatoire
    this.y = -5; // Position y initiale, au-dessus du canvas
    this.length = random(5, 10); // Longueur aléatoire de la goutte
    this.speed = random(0.1, 2); // Vitesse de chute
  }

  // Méthode pour faire tomber la goutte
  fall() {
    this.y += this.speed;
  }

  // Méthode pour afficher la goutte
  display() {
    push()
    stroke(150, 150, 200); 
    line(this.x, this.y, this.x, this.y + this.length); 
    pop()
  }
}