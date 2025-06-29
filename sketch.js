let game;
let tower;
let enemies = [];
let lastEnemy = 0;
let lastDamageToTower = 0;

let rateEnemiesCreation;
let rateEnemiesAugmentation;
let reduceValue;

let gameStarted = false;
let isPaused = false;
let difficulty;
let song;
let winButton;

let raindrops = [];

let pauseButton = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};



function preload(){
  song = loadSound('song.mp4', onSoundLoaded, onSoundError);
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
   // Initialisation des objets nécessaires au jeu dans preload()
  game = new Game();
  //song = loadSound('song.mp4', onSoundLoaded, onSoundError);
  
  let xTower = windowWidth / 2;
  let yTower = windowHeight / 2;

  tower = new Tower(xTower, yTower); // Initialiser la tourelle

  // Initialiser d'autres éléments nécessaires
  pauseButton = {
    x: windowWidth - 60,
    y: 20,
    w: 40,
    h: 20
  };

  // Créer les gouttes de pluie et les afficher
  createRaindrops();
  displayRaindrops();
   
  keyPressed();

  
  // Lancer la boucle de jeu quand tout est prêt
  noLoop(); // Empêche draw() de tourner automatiquement
}

function draw() {
  if (!gameStarted) return; 
  
  background(0);

  // Réduire le taux d'apparition des ennemis
  reduceEnemiesRate();

  // Créer les gouttes de pluie et les afficher
  createRaindrops();
  displayRaindrops();
  
  if (gameStarted) {
    createEnnemies(); // Créer des ennemis si le jeu a commencé
  }
  
  tower.show();
  tower.update(enemies);
  checkCollision();  
  
  for (let enemy of enemies) {
    enemy.move(tower.posX, tower.posY);
    checkCollisionWithTower(enemy, tower);
    enemy.spawn();
  }
  
  drawPauseButton();
  checkTowerHealing();
  tower.showPv(40, 40, 20);
  game.ennemisRestant();
   if (isMobile()) {
    console.log("Appareil mobile !");
    reduceValue = reduceValue * 0.5;
     let w = windowWidth - 10;
    document.getElementById('updateLvl').style.width = w + "px";

  }

}

function easyMode(){
  console.log('Setting up Easy Mode...');
  // Initialisation des paramètres
  rateEnemiesCreation = 1500; 
  rateEnemiesAugmentation = millis() + 10000; 
  game.getPalierUpdateLvl();
  reduceValue = 50; 
  tower.healRate = 3000;
  game.killsRequired = 33;
}

function mediumMode(){
  console.log('Setting up Medium Mode...');
  // Initialisation des paramètres
  rateEnemiesCreation = 1500; 
  rateEnemiesAugmentation = millis() + 10000; 
  game.getPalierUpdateLvl();
  reduceValue = 100; 
  tower.healRate = 5000;
  game.killsRequired = 103;
}


function hardMode() {
  rateEnemiesCreation = 3000; 
  rateEnemiesAugmentation = millis() + 10000; 
  game.getPalierUpdateLvl();
  reduceValue = 300; 
  tower.healRate = 10000;
  game.killsRequired = 163;
}

function infinityMode() {
  rateEnemiesCreation = 2000; 
  rateEnemiesAugmentation = millis() + 10000; 
  game.getPalierUpdateLvl();
  reduceValue = 150; 
  tower.healRate = 5000;
  game.killsRequired = 10000000000000000000;
}

function isMobile() {
  const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return userAgentCheck; // Ne compte plus la largeur de l'écran
}


