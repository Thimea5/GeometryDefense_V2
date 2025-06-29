//Fichiers avec les fonctions utilitiaires

function drawPauseButton(){
  if (isPaused) {
    push();
    fill(255);
    noStroke();
    triangle(
      pauseButton.x, pauseButton.y, // Pointe du triangle
      pauseButton.x, pauseButton.y + pauseButton.h,// Bas gauche
      pauseButton.x + 25, pauseButton.y + pauseButton.h / 2 // Centre droit
    );
    pop(); 
  } else {
    push();
    fill(255);
    rect(pauseButton.x, pauseButton.y, 10, pauseButton.h);
    rect(pauseButton.x + 15, pauseButton.y, 10, pauseButton.h);
    pop();
  }
}


// Fonction pour infliger des dégâts à la tourelle
function towerGetDamage(enemy) {
  tower.setPv(tower.getPv() - enemy.getAtk());
  lastDamageToTower = millis();
}

function checkCollision() {
  //collision balles et ennemies
  
  for (let i = tower.bullets.length - 1; i >= 0; i--) {
    let bullet = tower.bullets[i];

    if (!bullet.touchedEnemies) {
      bullet.touchedEnemies = [];
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      let enemy = enemies[j];
      let distance = dist(bullet.x, bullet.y, enemy.x, enemy.y);

      if (distance < 7 + 15 && !bullet.touchedEnemies.includes(enemy)) {
        
        bullet.touchedEnemies.push(enemy);
        enemy.setPv(enemy.getPv() - tower.getAtk());

        if (enemy.isDead()) {
          game.addKill();
          print(game.nbEnnemiesKilled);
          game.updateXp(enemy.getXp());
          enemies.splice(j, 1); // Supprimez l'ennemi de la liste

          if (!document.getElementById("updateLvl").hidden) {
            gamePaused();
          }
          print("LVL : " + game.getLvl());
        }

        if (bullet.touchedEnemies.length >= tower.getPenetration()) {
          tower.bullets.splice(i, 1);
          break; 
        }
      }
    }
  }
}




function createEnnemies() {
  let minDistance = 100; 

  
  if (millis() - lastEnemy >= rateEnemiesCreation) {
    let enemyX, enemyY, distanceToTower;

    let edge = floor(random(4)); // 0 = haut, 1 = bas, 2 = gauche, 3 = droite

    if (edge === 0) { // En haut
      enemyX = random(windowWidth); 
      enemyY = -10; 
    } else if (edge === 1) { // En bas
      enemyX = random(windowWidth); 
      enemyY = windowHeight + 10; 
    } else if (edge === 2) { // À gauche
      enemyX = -10; 
      enemyY = random(windowHeight); 
    } else { // À droite
      enemyX = windowWidth + 10; 
      enemyY = random(windowHeight); 
    }

    distanceToTower = dist(enemyX, enemyY, tower.posX, tower.posY);
    
    if (distanceToTower >= minDistance) {
      let randomEnemy = random(10);
      //print("random enemy -> " + Math.floor(randomEnemy))
      
      if (Math.floor(randomEnemy) == 1){
        print("tank spawn")
        enemies.push(new Tank(enemyX, enemyY));
      }
      else {
        enemies.push(new Enemy(enemyX, enemyY));
      }
      lastEnemy = millis(); 
    }
  }
}



function checkCollisionWithTower(enemy, tower) {
  // Vérifier les collisions entre les ennemis et la tourelle
  
  let distanceToTower = dist(enemy.x, enemy.y, tower.posX, tower.posY);
  let collisionRadius = (tower.getBaseDiameter() / 2) + (enemy.getDiameter() / 2);

  if (distanceToTower < collisionRadius) {
    towerGetDamage(enemy);
    let angle = atan2(enemy.y - tower.posY, enemy.x - tower.posX);
    
    enemy.x = tower.posX + cos(angle) * collisionRadius;
    enemy.y = tower.posY + sin(angle) * collisionRadius;

    //enemy.direction += PI; // Inverser la direction de l'ennemi
  }
}


document.getElementById('playButton').addEventListener('click', function(event) {
  
  event.preventDefault(); // Empêche le rechargement de la page
  document.getElementById('menu').style.display = 'none';
  document.getElementById('difficultyMenu').style.display = 'flex';
  document.getElementById('footer').style.display = 'none';

  
});


const difficultyButtons = document.getElementsByClassName('difficultyBtn');


Array.from(difficultyButtons).forEach(button => {
  button.addEventListener('click', function (event) {
    event.preventDefault(); 

    if (!gameStarted) {
      console.log("Choix de la difficulté cliqué");
      gameStarted = true;

      document.getElementById('difficultyMenu').style.display = 'none';
      difficulty = event.target.id;
      difficultyInit();

      print(difficulty);
      if(!song.isPlaying()){
    song.loop();
    }   
      
      loop(); // Démarre le jeu
      
    }
  });
});


document.getElementById('parametersButton').addEventListener('click', function(event) {
 
    console.log("Bouton Paramètres");
  if(!song.isPlaying()){
    song.loop();
  }
    document.getElementById('menu').style.display = 'none';
    document.getElementById('difficultyMenu').style.display = 'none';
    document.getElementById('volume').style.display = 'block';
    document.getElementById('parameters').style.display = 'block';
    document.getElementById('retour').style.display = 'block';

    slider = createSlider(0, 1, 0.5 , 0.1);
    slider.position(window.width * 0.5, window.height * 0.4 + 50);
    slider.style('width', '200px');
    song.setVolume(slider.value());
  
  // Modifie le volume
  slider.input(() => {
    song.setVolume(slider.value());
  });
    loop(); 

});

document.getElementById('retour').addEventListener('click', function(event) {
 
  console.log("Retour menu");
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('parameters').style.display = 'none';
  document.getElementById('volume').style.display = 'none';
  document.getElementById('retour').style.display = 'none';
  slider.hide();
  loop(); 

});


document.getElementById('returnMenu').addEventListener('click', function(event) {
window.location.reload();
});

document.getElementById('returnMenuWin').addEventListener('click', function(event) {
window.location.reload();
});

function gamePaused() {
  //mettre en pause la partie 
  
  isPaused = !isPaused; // Toggle the pause state

  if (isPaused) {
    noLoop(); 
  } else {
    loop(); // Restart the draw loop if unpaused
    
  }
}



function keyPressed() {
  if (key === 'Escape') {
    if(!isPaused){
      gamePaused();
    } else{
      !gamePaused();
      loop();
    }
  } 
}


function mouseClicked(){
   if (
    mouseX >= pauseButton.x &&
    mouseX <= pauseButton.x + pauseButton.w &&
    mouseY >= pauseButton.y &&
    mouseY <= pauseButton.y + pauseButton.h
  ) {
    gamePaused(); // Appelle la fonction pour changer l'état de pause
  }
}



document.addEventListener('click', (event) => {
  //gestion des click sur les amiliorations
  
  if (event.target.classList.contains('improvement')) {

    let improvement = event.target.id;
    
    switch(improvement){
      case "improveFireRate" :
        tower.setFireRate(tower.getFireRate() - 100);
        //print(tower.getFireRate());
        break;
      case "improvePenetration" :
        tower.setPenetration(tower.getPenetration() + 1);
        break;
      case "improveAtk" :
        tower.setAtk(tower.getAtk() * 1.5);
        break;
      case "addBullet" :
        tower.setNbBullet(tower.getNbBullet() +1);
        break;
    }

    hideImprovementMenu();

    gamePaused();
    loop(); 
  }
});




// Masquer le menu des améliorations après un clic
function hideImprovementMenu() {
    const updateLvlDiv = document.getElementById("updateLvl");
    updateLvlDiv.hidden = true;
}


function checkTowerHealing(){
  if ((millis() - lastDamageToTower) > tower.getHealRate() && tower.getPv() < tower.getInitialPv()) {
    //print("heal")
    tower.setPv(tower.getPv() + 0.5); 

    if (tower.getPv() > tower.getInitialPv()) {
        tower.setPv(tower.getInitialPv());
    }
}
}


function createRaindrops() {
  if (random(1) < 0.2) { 
    raindrops.push(new Raindrop());
  }
}

// Fonction pour afficher les gouttes de pluie et les mettre à jour
function displayRaindrops() {
  for (let i = raindrops.length - 1; i >= 0; i--) {
    raindrops[i].fall();
    raindrops[i].display();

    // Supprime les gouttes de pluie qui tombent en dehors du canvas
    if (raindrops[i].y > height) {
      raindrops.splice(i, 1);
    }
  }
}


function reduceEnemiesRate(){
  if (millis() >= rateEnemiesAugmentation) {
    rateEnemiesCreation -= reduceValue;  
    rateEnemiesAugmentation = millis() + 5000;  //1 s
    game.setPalierUpdateLvl(game.getPalierUpdateLvl() + 0.5);
    //print(game.getPalierUpdateLvl());
    
    // Optionnel : empêcher rateEnemiesCreation de descendre trop bas
    if (rateEnemiesCreation < 200) {
      rateEnemiesCreation = 200;
    }
  }

  //print(rateEnemiesCreation); 
}


function difficultyInit() {
  console.log('Difficulty selected:', difficulty);  // Ajout du log

  switch (difficulty) {
    case "easy":
      easyMode();
      break;
    case 'medium':
      mediumMode();
      break;
    case 'hard':
      hardMode();
      break;
    case 'infinity':
      infinityMode();
      break;
    default:
      console.error('Unknown difficulty:', difficulty);
  }
}

function onSoundLoaded() {
  console.log('Sound loaded successfully!');
  document.getElementById('loading').style.display = 'none';
  document.getElementById('menu').style.display = 'flex';
}

function onSoundError() {
  console.error('Failed to load sound!');
}

document.body.addEventListener('touchmove', function(e) {
  e.preventDefault(); // Empêche le défilement
}, { passive: false });
