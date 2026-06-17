// ==========================================
// 1. 플레이어 변수 선언
// ==========================================
let rightRunImgs = [];
let leftRunImgs = [];
let runFrame = 0;
let standsImg = [];
let eSkillImgs = [];
let gicheolImg;
let kyungsuImg;
let unjeImg;
let cameraWarningImg;
let cameraAttackImg;
let rSkillEffectImg;

let skillIconImgs = {};
let cooldownImgs = {};

let playerDirection = 'right';
let isStage1BossZoneEntered = false; 

function setupPlayer() {}


// ==========================================
// 2. 플레이어 그리기 및 이동
// ==========================================
function drawPlayer() {
  runFrame = Math.floor(frameCount / 8) % 3;

  push(); // ★ 추가: 투명도 적용을 위한 블록 시작

  // ★ 피격 후 1초(1000ms) 동안은 캐릭터가 반투명하게 깜빡거림
  if (millis() - lastHitTime < 1000) {
    if (frameCount % 10 < 5) {
      tint(255, 100); // 투명도를 100으로 낮춤
    }
  }

  if (keyIsDown(68)) {
    playerDirection = 'right';
    image(rightRunImgs[runFrame], playerX, playerY, playerWidth, playerHeight);
  } else if (keyIsDown(65)) {
    playerDirection = 'left';
    image(leftRunImgs[runFrame], playerX, playerY, playerWidth, playerHeight);
  } else {
    if (playerDirection === 'right') {
      image(standsImg[0], playerX, playerY, playerWidth, playerHeight);
    } else {
      image(standsImg[1], playerX, playerY, playerWidth, playerHeight);
    }
  }

  pop(); 

  drawPlayerHitbox();
}

function movePlayer() {
  if (keyIsDown(65)) playerX -= playerSpeed;
  if (keyIsDown(68)) playerX += playerSpeed;
  
  if (gameState === 'ssu_stage1') {
    if (playerX >= bossground_X) isStage1BossZoneEntered = true;
    if (isStage1BossZoneEntered) {
      // ★ 1스테이지 보스방 밖으로 못 나가게 가두기
      playerX = constrain(playerX, bossground_X, bossground_X + bossZoneFloorWidth - playerWidth);
    } else {
      playerX = max(0, playerX); // 시작지점 왼쪽으로 못 나가게
    }
  }

  if (gameState === 'ssu_stage3') {
    if (playerX >= final_bossground_X) isFinalBossZoneEntered = true;
    if (isFinalBossZoneEntered) {
      // ★ 3스테이지 보스방 밖으로 못 나가게 가두기
      playerX = constrain(playerX, final_bossground_X, final_bossground_X + final_bossZoneFloorWidth - playerWidth);
    } else {
      playerX = max(0, playerX);
    }
  }

  playerVelocityY += playerGravity;
  playerY += playerVelocityY;

  if (keyIsDown(32) && !playerIsJumping) {
    playerVelocityY = playerJumpPower;
    playerIsJumping = true;
  }
}
// ==========================================
// 3. 지형지물 및 포탈 상호작용
// ==========================================
function getPlatformBox(x, y, w, h, type, isCenter = false) {
  let shrinkX = type === 'long' ? 35 : 25;
  let shrinkTop = type === 'long' ? 8 : 5;
  let hitH = type === 'long' ? 22 : 16;

  if (isCenter) {
    x = x - w / 2;
    y = y - h / 2;
  }
  return { x: x + shrinkX, y: y + shrinkTop, w: w - shrinkX * 2, h: hitH };
}

function stage1PlayerLanding() {
  for (let i = 0; i < longObjectsX.length; i++) {
    let obj = getPlatformBox(longObjectsX[i], longObjectsY[i], longObjectWidth, longObjectHeight, 'long');
    if (playerX + playerWidth > obj.x && playerX < obj.x + obj.w && playerY + playerHeight >= obj.y && playerY + playerHeight <= obj.y + obj.h && playerVelocityY >= 0) {
      playerY = obj.y - playerHeight;
      playerVelocityY = 0;
      playerIsJumping = false;
    }
  }

  for (let i = 0; i < shortObjectsX.length; i++) {
    let obj = getPlatformBox(shortObjectsX[i], shortObjectsY[i], shortObjectWidth, shortObjectHeight, 'short');
    if (playerX + playerWidth > obj.x && playerX < obj.x + obj.w && playerY + playerHeight >= obj.y && playerY + playerHeight <= obj.y + obj.h && playerVelocityY >= 0) {
      playerY = obj.y - playerHeight;
      playerVelocityY = 0;
      playerIsJumping = false;
    }
  }

  if (playerX + playerWidth > bossground_X && playerX < bossground_X + bossZoneFloorWidth && playerY + playerHeight >= bossground_Y + 90 && playerY + playerHeight <= bossground_Y + bossZoneFloorHeight && playerVelocityY >= 0) {
    playerY = bossground_Y + 90 - playerHeight;
    playerVelocityY = 0;
    playerIsJumping = false;
  }

  if (playerX + playerWidth < bossground_X && playerY >= GROUND_Y + 70 - playerHeight && playerVelocityY >= 0) {
    playerY = GROUND_Y + 70 - playerHeight;
    playerVelocityY = 0;
    playerIsJumping = false;
  }
}

function stage1Portal() {
  image(portalImg, stagePortalsX[0], stagePortalsY[0], stagePortalWidth, stagePortalHeight);
  if (playerX >= stagePortalsX[0] && playerX <= stagePortalsX[0] + stagePortalWidth && playerY >= stagePortalsY[0] && playerY <= stagePortalsY[0] + stagePortalHeight) {
    if (isPortalTransitioning) return;
    isPortalTransitioning = true;
    stopAllBgm();
    currentBgm = '';
    playPortalSound();
    setTimeout(() => {
      playerX = 100;
      playerY = GROUND_Y + 70 - playerHeight;
      playerVelocityY = 0;
      playerIsJumping = false;
      stage2StartTime = 0;
      fallingObjects = [];
      gameState = 'ssu_stage2';
      playStage2Bgm();
      isPortalTransitioning = false;
    }, 500);
  }
}

function stage2Portal() {
  image(portalImg, stagePortalsX[1], stagePortalsY[1], stagePortalWidth, stagePortalHeight);
  if (playerX >= stagePortalsX[1] && playerX <= stagePortalsX[1] + stagePortalWidth && playerY >= stagePortalsY[1] && playerY <= stagePortalsY[1] + stagePortalHeight) {
    if (isPortalTransitioning) return;
    isPortalTransitioning = true;
    playPortalSound();
    stopAllBgm();
    currentBgm = '';
    setTimeout(() => {
      playerX = 100;
      playerY = GROUND_Y + 70 - playerHeight;
      playerVelocityY = 0;
      playerIsJumping = false;
      gameState = 'ssu_stage3';
      isPortalTransitioning = false;
    }, 500);
  }
}

function stage2PlayerLanding() {
  if (playerY >= GROUND_Y + 70 - playerHeight && playerVelocityY >= 0) {
    playerY = GROUND_Y + 70 - playerHeight;
    playerVelocityY = 0;
    playerIsJumping = false;
  }
}

function stage3PlayerLanding() {
  for (let i = 0; i < final_longObjectsX.length; i++) {
    let obj = getPlatformBox(final_longObjectsX[i], final_longObjectsY[i], longObjectWidth, longObjectHeight, 'long');
    if (playerX + playerWidth > obj.x && playerX < obj.x + obj.w && playerY + playerHeight >= obj.y && playerY + playerHeight <= obj.y + obj.h && playerVelocityY >= 0) {
      playerY = obj.y - playerHeight;
      playerVelocityY = 0;
      playerIsJumping = false;
    }
  }

  for (let i = 0; i < final_shortObjectsX.length; i++) {
    let obj = getPlatformBox(final_shortObjectsX[i], final_shortObjectsY[i], shortObjectWidth, shortObjectHeight, 'short', true);
    if (playerX + playerWidth > obj.x && playerX < obj.x + obj.w && playerY + playerHeight >= obj.y && playerY + playerHeight <= obj.y + obj.h && playerVelocityY >= 0) {
      playerY = obj.y - playerHeight;
      playerVelocityY = 0;
      playerIsJumping = false;
    }
  }

  if (playerY >= GROUND_Y + 70 - playerHeight && playerVelocityY >= 0) {
    playerY = GROUND_Y + 70 - playerHeight;
    playerVelocityY = 0;
    playerIsJumping = false;
  }
}

// ==========================================
// 4. 히트박스 판정
// ==========================================
function getPlayerHitbox() {
  return { x: playerX + hitboxShiftX, y: playerY + hitboxShiftY, w: hitboxWidth, h: hitboxHeight };
}

function drawPlayerHitbox() {
  let hb = getPlayerHitbox();
  push();
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  rect(hb.x, hb.y, hb.w, hb.h);
  pop();
}

function checkCollision(rect1, rect2) {
  return (rect1.x < rect2.x + rect2.w && rect1.x + rect1.w > rect2.x && rect1.y < rect2.y + rect2.h && rect1.y + rect1.h > rect2.y);
}

// ==========================================
// 5. 이미지 프렐로드 (★ 컴퓨터 실제 한글 이름과 똑같이 복구했습니다!)
// ==========================================
function preloadPlayer() {
  rightRunImgs[0] = loadImage('student/Rrun1.png');
  rightRunImgs[1] = loadImage('student/Rrun2.png');
  rightRunImgs[2] = loadImage('student/Rrun3.png');

  leftRunImgs[0] = loadImage('student/Lrun1.png');
  leftRunImgs[1] = loadImage('student/Lrun2.png');
  leftRunImgs[2] = loadImage('student/Lrun3.png');

  standsImg[0] = loadImage('student/right_stand.png');
  standsImg[1] = loadImage('student/left_stand.png');

  qSkillImg = loadImage('student/Qskill1.png');
  lSkillImg = loadImage('student/skill_L.png');

  eSkillImgs[0] = loadImage('student/Eskill1.png');
  eSkillImgs[1] = loadImage('student/Eskill2.png');
  eSkillImgs[2] = loadImage('student/Eskill3.png');
  eSkillImgs[3] = loadImage('student/Eskill4.png');

  gicheolImg = loadImage('정기철교수님/정기철보스_기본모션.png');
  kyungsuImg = loadImage('오경수교수님/오경수보스_기본모션.png');
  
  ksProjImg1 = loadImage('오경수교수님/오경수보스_그래픽스_1단계_옵젝2.png');
  ksProjImg2 = loadImage('오경수교수님/오경수보스_그래픽스_2단계_옵젝3.png');
  ksProjImg3 = loadImage('오경수교수님/오경수보스_그래픽스_3단계_옵젝1.png');
  ksMobSmallImg = loadImage('오경수교수님/오경수보스_백준몬스터.png');
  ksMobBigImg = loadImage('오경수교수님/오경수보스_백준몬스터.png');

  gcSkill2Img = loadImage('정기철교수님/정기철보스_스킬_데이터나선환1.png');
  gcSkill1Img = loadImage('정기철교수님/정기철보스_스킬_과제폭탄.png');
  gcSkill1ChargeImg = loadImage('정기철교수님/정기철보스_스킬_과제폭탄.png');
  
  gcSkill1ExplosionImg = loadImage('정기철교수님/정기철보스_스킬_과제폭탄_걍터짐.png');
  unjeImg = loadImage('이운재총장님/이운재총장님기본.png');
  finalBossProjImg = loadImage('이운재총장님/이운재말.png');
  laserMovingImg = loadImage('이운재총장님/모기움직임.png');
  laserArrivedImg = loadImage('이운재총장님/모기멈춤.png');

  cameraWarningImg = loadImage('이운재총장님/글미포즈흐림.png');
  cameraAttackImg = loadImage('이운재총장님/글미포즈공격.png');

  skillIconImgs['L'] = loadImage('skill/L스킬.png');
  skillIconImgs['E'] = loadImage('skill/E스킬.png');
  skillIconImgs['Q'] = loadImage('skill/Q스킬.png');
  skillIconImgs['R'] = loadImage('skill/R스킬.png');

  cooldownImgs[1] = loadImage('skill/1초.png');
  cooldownImgs[2] = loadImage('skill/2초.png');
  cooldownImgs[3] = loadImage('skill/3초.png');
  cooldownImgs[4] = loadImage('skill/4초.png');
  cooldownImgs[5] = loadImage('skill/5초.png');
  cooldownImgs[6] = loadImage('skill/6초.png');
  cooldownImgs[7] = loadImage('skill/7초.png');
  cooldownImgs[8] = loadImage('skill/8초.png');

  rSkillEffectImg = loadImage('student/R.png');
}