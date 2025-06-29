class Game {
  constructor() {
    this.xp = 0;
    this.lvl = 1;
    this.nbEnnemiesKilled = 0;
    this.palierUpdateLvl = 6;
    this.lvlMessage = ""; // message d'augmentation de niveau
    this.LvlMessageTimer = 0;
    this.killsRequired = 30;
  }
  
  ennemisRestant(){
    //text
   push();
   fill(255, 100, 100);
   textSize(20); 
   text(this.killsRequired - this.nbEnnemiesKilled  + " ennemis restants" ,20  ,windowHeight - 20);
   pop();
  }
  
  checkWin(){
    if( this.nbEnnemiesKilled > this.killsRequired){
      document.getElementById('win').style.display = 'flex';
      noLoop();
    }
  }
  getPalierUpdateLvl(){ return this.palierUpdateLvl; }
  setPalierUpdateLvl(_p){ this.palierUpdateLvl = _p}

  addKill() {
    this.nbEnnemiesKilled += 1;
    this.checkWin();
  }

  getNbEnnemiesKilled() {
    return this.nbEnnemiesKilled;
  }

  updateXp(_xp) {
    this.xp += _xp;
    this.shouldLvlGetUpdate();
  }

  getXp() {
    return this.xp;
  }

  updateLvl() {
    this.lvl += 1;
    this.lvlMessage = `Niveau ${this.lvl} atteint !`;

    // Afficher la div "updateLvl" avec le message de niveau
    const updateLvlDiv = document.getElementById("updateLvl");
    updateLvlDiv.hidden = false; // Rendre la div visible
  }

  getLvl() {
    return this.lvl;
  }

  shouldLvlGetUpdate() {
    if (this.xp >= this.palierUpdateLvl) {
      this.updateLvl();
      this.xp = 0;
      
      switch(this.lvl){
        case 5 : this.palierUpdateLvl +=  + 7;
          break;
        case 10 : this.palierUpdateLvl +=  + 15;
          break;
        case 15 : this.palierUpdateLvl +=  + 20;
          break;
        case 20 : this.palierUpdateLvl +=  + 30;
          break;
        default : this.palierUpdateLvl +=  + 2;
          break;
      }
    }
  }


  // Fonction pour afficher le message si le timer n'est pas expiré
  displayLvlMessage() {
    if (millis() - this.LvlMessageTimer < 2000) { // Affiche pendant 2 secondes
      textSize(32);
      textAlign(CENTER, CENTER);
      fill(250);
      text(this.lvlMessage, windowWidth / 2, windowHeight / 2 - 200);
    }
  }
}
