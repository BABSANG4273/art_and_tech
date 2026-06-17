function ssuStage2() {
  stage2DrawEnvironment();
  if (currentBgm !== 'stage2') {
    playStage2Bgm();
  }

  if (stage2StartTime === 0) {
    stage2StartTime = millis();
  }

  movePlayer();
  stage2PlayerLanding();
  drawPlayer();
  drawMilitaryAssistant();

  let stage2ElapsedTime = millis() - stage2StartTime;

  if (stage2ElapsedTime >= 5000 && stage2ElapsedTime < stage2ClearTime) {
    makeFallingObject();
  }

  moveFallingObject();
  drawFallingObject();
  checkFallingObjectHit();
  drawStage2Time();

  hpDrawing();
  schoolScoresDrawing();

  // L
  lSkillMove();
  lSkillDrawing();
  lSkillHitBoss();

  // Q
  hammerSkillUpdate();
  drawQImpactEffect();

  skillbarDrawing();
  skillsCooltime();
  //------------------------추가-----------------
  if (millis() - stage2StartTime >= stage2ClearTime) {
    stage2Portal();
  }
  //----------------------------------------------
}

function makeFallingObject() {
  if (frameCount % fallingObjectInterval === 0) {
    for (let i = 0; i < 5; i++) {
      fallingObjects.push({
        x: random(0, width - fallingObjectWidth),
        y: random(-300, -fallingObjectHeight),
        w: fallingObjectWidth,
        h: fallingObjectHeight,
      });
    }
  }
}

function moveFallingObject() {
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    fallingObjects[i].y += fallingObjectSpeed;

    // 화면 아래로 나가면 삭제
    if (fallingObjects[i].y > height) {
      fallingObjects.splice(i, 1);
    }
  }
}

function drawFallingObject() {
  for (let i = 0; i < fallingObjects.length; i++) {
    image(
      militaryNoticeImg,
      fallingObjects[i].x,
      fallingObjects[i].y,
      fallingObjects[i].w,
      fallingObjects[i].h,
    );
  }
}
//-----------변경(gameState)------------------
function checkFallingObjectHit() {
  let playerHitbox = getPlayerHitbox();

  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    if (checkCollision(playerHitbox, fallingObjects[i])) {
      gameState = 'military_over';
      return;
    }
  }
}
//-------------------------------------------
function drawStage2Time() {
  let remainTime = Math.ceil(
    (stage2ClearTime - (millis() - stage2StartTime)) / 1000,
  );

  remainTime = max(0, remainTime);

  push();
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text('남은 시간 : ' + remainTime, width / 2, 80);
  pop();
}

function drawMilitaryAssistant() {
  image(militaryAssistantImg, width - 180, GROUND_Y + 70 - 180, 150, 180);
}
