class Tank extends Enemy {
  constructor(x, y) {
    super(x,y);
    this.pv = 20;
    this.xp = 5;
  }
  
  spawn(){
    push();
    fill(100, 100, 200); 
    ellipse(this.x, this.y, 50, 50); 
    pop();
    
  }
}