let skillTF = [1, 1, 1, 1];
let skillbars = ['L', 'E', 'Q', 'R'];
let skillCooldown = [0, 0, 0, 0 ];

let lSkillsX = [];
let lSkillsY = [];
let lSkillsDir = [];
let lSkillsAngle = []; 

let lSkillSpeed = 15;
let lSkillWidth = 70;
let lSkillHeight = 70;

let lSkillImg; 

let activeQSkill = null;
let qSkillImg;
let activeESkill = null;

function skillbarDrawing() {
  let drawnCount = 0; 

  for (let i = 0; i < skillbars.length; i++) {
    // R스킬은 1, 3 스테이지에서 아직 안 썼을 때만 표시!
    let isR = skillbars[i] === 'R';
    let canShowR = false;
    if (isR) {
      if (gameState === 'ssu_stage1' && !rSkillUsedStage1) canShowR = true;
      if (gameState === 'ssu_stage3' && !rSkillUsedStage3) canShowR = true;
    }
    
    // 조건에 안 맞으면 그리지 않음 (스킬바에서 숨김)
    if (isR && !canShowR) continue; 

    push();
    let size = 100;  
    let gap = 40;    
    let xPos = (size + gap) * drawnCount + 100; 
    let yPos = 1080; 

    if (skillTF[i] === 1) {
      if (typeof skillIconImgs !== 'undefined' && skillIconImgs[skillbars[i]]) {
        image(skillIconImgs[skillbars[i]], xPos, yPos, size, size);
      } else {
        fill(0, 0, 255); rect(xPos, yPos, size, size);
      }
    } else {
      let remainFrames = skillCooldown[i] - frameCount;
      let remainSec = Math.ceil(remainFrames / 60);

      if (remainSec < 1) remainSec = 1;
      if (remainSec > 8) remainSec = 8; 

      if (typeof cooldownImgs !== 'undefined' && cooldownImgs[remainSec]) {
        image(cooldownImgs[remainSec], xPos, yPos, size, size);
      } else {
        fill(140, 0, 0); rect(xPos, yPos, size, size);
      }
    }
    pop();
    drawnCount++; 
  }
}

function keyPressed() {
  if (typeof key === 'undefined') return;

  if (key === '1' && typeof triggerKyungsuSkill === 'function') triggerKyungsuSkill(1);
  if (key === '2' && typeof triggerKyungsuSkill === 'function') triggerKyungsuSkill(2);
  if (key === '3' && typeof triggerKyungsuSkill === 'function') triggerKyungsuSkill(3);
  if (key === '4' && typeof triggerGicheolSkill === 'function') triggerGicheolSkill(1); 
  if (key === '5' && typeof triggerGicheolSkill === 'function') triggerGicheolSkill(5); 
  if (key === '6' && typeof triggerFinalBossSkill === 'function') triggerFinalBossSkill(1);
  if (key === '7' && typeof triggerFinalBossSkill === 'function') triggerFinalBossSkill(2);
  if (key === '8' && typeof triggerFinalBossSkill === 'function') triggerFinalBossSkill(3);

  // 스테이지 강제 이동 치트키
  if (key === '9') {
    if (typeof stopAllBgm === 'function') stopAllBgm();
    currentBgm = '';
    playerX = 100;
    playerY = GROUND_Y + 70 - playerHeight;
    playerVelocityY = 0;
    playerIsJumping = false;
    stage2StartTime = 0;
    fallingObjects = [];
    gameState = 'ssu_stage2';
    if (typeof playStage2Bgm === 'function') playStage2Bgm();
  }

  if (key === '0') {
    if (typeof stopAllBgm === 'function') stopAllBgm();
    currentBgm = '';
    playerX = 100;
    playerY = GROUND_Y + 70 - playerHeight;
    playerVelocityY = 0;
    playerIsJumping = false;
    gameState = 'ssu_stage3';
  }

  for (let i = 0; i < skillbars.length; i++) {
    if (key.toUpperCase() === skillbars[i]) {
      // R 스킬 발동
      if (skillbars[i] === 'R') {
        if (gameState === 'ssu_stage1' && !rSkillUsedStage1) {
          rSkillUsedStage1 = true;
          isRSkillActive = true;
          rSkillTimer = 300; 
        } else if (gameState === 'ssu_stage3' && !rSkillUsedStage3) {
          rSkillUsedStage3 = true;
          isRSkillActive = true;
          rSkillTimer = 300; 
        }
      } 
      // 일반 스킬(L, E, Q) 발동
      else if (skillTF[i] === 1) {
        skillTF[i] = 0;
        if (skillbars[i] === 'L') {
          skillCooldown[i] = frameCount + 60;
          if (playerDirection === 'right') lSkillsX.push(playerX + playerWidth);
          else lSkillsX.push(playerX - lSkillWidth);
          lSkillsY.push(playerY + playerHeight * 0.3);
          lSkillsDir.push(playerDirection);
          lSkillsAngle.push(0);
          if (typeof lSkillSound !== 'undefined' && lSkillSound) {
            lSkillSound.setVolume(0.8);
            lSkillSound.play();
          }
        } else if (skillbars[i] === 'E') {
          skillCooldown[i] = frameCount + 420;
          activeESkill = { timer: 0, dir: playerDirection, w: 80, h: 200 };
        } else if (skillbars[i] === 'Q') {
          skillCooldown[i] = frameCount + 180;
          activeQSkill = { timer: 0, maxTimer: 15, stayTimer: 10, dir: playerDirection };
        } else {
          skillCooldown[i] = frameCount + 180;
        }
      }
    }
  }
}

function skillsCooltime() {
  for (let i = 0; i < skillTF.length; i++) {
    if (frameCount >= skillCooldown[i]) skillTF[i] = 1;
  }
}

function eSkillUpdate() {
  if (activeESkill) {
    activeESkill.timer++;
    let currentDir = playerDirection;
    let shieldX = currentDir === 'right' ? playerX + playerWidth : playerX - activeESkill.w;
    let shieldY = playerY + playerHeight / 2 - activeESkill.h / 2;
    activeESkill.x = shieldX;
    activeESkill.y = shieldY;
    let stage = Math.floor(activeESkill.timer / 30);

    if (stage >= 4) {
      activeESkill = null;
      return;
    }

    push();
    if (typeof eSkillImgs !== 'undefined' && eSkillImgs.length >= 4) {
      if (currentDir === 'left') {
        translate(shieldX + activeESkill.w / 2, shieldY + activeESkill.h / 2);
        scale(-1, 1);
        imageMode(CENTER);
        image(eSkillImgs[stage], 0, 0, activeESkill.w, activeESkill.h);
      } else {
        image(eSkillImgs[stage], shieldX, shieldY, activeESkill.w, activeESkill.h);
      }
    } else {
      fill(0, 0, 255, 255 - stage * 50);
      stroke(0, 0, 255);
      strokeWeight(3);
      rect(shieldX, shieldY, activeESkill.w, activeESkill.h);
    }
    pop();
  }
}

function getESkillHitbox() {
  if (activeESkill) return { x: activeESkill.x, y: activeESkill.y, w: activeESkill.w, h: activeESkill.h };
  return null;
}

function lSkillDrawing() {
  for (let i = 0; i < lSkillsX.length; i++) {
    push();
    translate(lSkillsX[i] + lSkillWidth / 2, lSkillsY[i] + lSkillHeight / 2);
    rotate(lSkillsAngle[i]);
    imageMode(CENTER);
    if (lSkillsDir[i] === 'left') scale(-1, 1);

    if (typeof lSkillImg !== 'undefined' && lSkillImg) {
      image(lSkillImg, 0, 0, lSkillWidth, lSkillHeight);
    } else {
      fill(0, 255, 0);
      rectMode(CENTER);
      rect(0, 0, lSkillWidth, lSkillHeight);
    }
    pop();
  }
}

function lSkillMove() {
  for (let i = lSkillsX.length - 1; i >= 0; i--) {
    if (lSkillsDir[i] === 'right') {
      lSkillsX[i] += lSkillSpeed;
      lSkillsAngle[i] += 0.35;
    } else {
      lSkillsX[i] -= lSkillSpeed;
      lSkillsAngle[i] -= 0.35;
    }

    if (lSkillsX[i] > 6000 || lSkillsX[i] < -2000) {
      lSkillsX.splice(i, 1);
      lSkillsY.splice(i, 1);
      lSkillsDir.splice(i, 1);
      lSkillsAngle.splice(i, 1);
    }
  }
}

function lSkillHitBoss() {
  let isKyungsuInvincible = typeof ksMobs !== 'undefined' && ksMobs.length > 0;
  let dmgMult = (typeof isRSkillActive !== 'undefined' && isRSkillActive) ? 2 : 1; // ★ 데미지 2배 적용

  for (let i = lSkillsX.length - 1; i >= 0; i--) {
    let lSkill = { x: lSkillsX[i], y: lSkillsY[i], w: lSkillWidth, h: lSkillHeight };
    let hitSomething = false;
    
    if (typeof cppMobX !== 'undefined') {
      for (let j = 0; j < cppMobX.length; j++) {
        if (cppMobAlive[j] == false) continue;
        if (lSkill.x + lSkill.w > cppMobX[j] && lSkill.x < cppMobX[j] + cppMobWidth && lSkill.y + lSkill.h > cppMobY[j] && lSkill.y < cppMobY[j] + cppMobHeight) {
          cppMobHP[j] -= (1 * dmgMult);
          if (cppMobHP[j] <= 0) cppMobAlive[j] = false;
          hitSomething = true;
          break;
        }
      }
    }

    if (typeof jsMobX !== 'undefined') {
      for (let j = 0; j < jsMobX.length; j++) {
        if (jsMobAlive[j] == false) continue;
        if (lSkill.x + lSkill.w > jsMobX[j] && lSkill.x < jsMobX[j] + jsMobWidth && lSkill.y + lSkill.h > jsMobY[j] && lSkill.y < jsMobY[j] + jsMobHeight) {
          jsMobHP[j] -= (1 * dmgMult);
          if (jsMobHP[j] <= 0) jsMobAlive[j] = false;
          hitSomething = true;
          break;
        }
      }
    }

    if (typeof ksMobs !== 'undefined') {
      for (let j = ksMobs.length - 1; j >= 0; j--) {
        let m = ksMobs[j];
        let mobBox = { x: m.x, y: m.y, w: m.w, h: m.h };
        if (checkCollision(lSkill, mobBox)) {
          m.hp -= (10 * dmgMult); 
          if (m.hp <= 0) ksMobs.splice(j, 1); 
          hitSomething = true;
          break;
        }
      }
    }

    let gicheolBoss = { x: typeof gicheolX !== 'undefined' ? gicheolX : 0, y: typeof gicheolY !== 'undefined' ? gicheolY : 0, w: typeof gicheolWidth !== 'undefined' ? gicheolWidth : 0, h: typeof gicheolHeight !== 'undefined' ? gicheolHeight : 0 };
    let kyungsuBoss = { x: typeof kyungsuX !== 'undefined' ? kyungsuX : 0, y: typeof kyungsuY !== 'undefined' ? kyungsuY : 0, w: typeof kyungsuWidth !== 'undefined' ? kyungsuWidth : 0, h: typeof kyungsuHeight !== 'undefined' ? kyungsuHeight : 0 };
    let stage3Boss = { x: typeof finalBossX !== 'undefined' ? finalBossX : 0, y: typeof finalBossY !== 'undefined' ? finalBossY : 0, w: typeof finalBossWidth !== 'undefined' ? finalBossWidth : 0, h: typeof finalBossHeight !== 'undefined' ? finalBossHeight : 0 };

    if (gameState === 'ssu_stage1') {
      if (typeof gicheolHp !== 'undefined' && gicheolHp > 0 && checkCollision(lSkill, gicheolBoss)) {
        gicheolHp -= (10 * dmgMult); hitSomething = true;
      }
      if (!isKyungsuInvincible && typeof kyungsuHp !== 'undefined' && kyungsuHp > 0 && checkCollision(lSkill, kyungsuBoss)) {
        kyungsuHp -= (10 * dmgMult); hitSomething = true;
      }
    } else if (gameState === 'ssu_stage3' && typeof finalBossHp !== 'undefined' && finalBossHp > 0 && checkCollision(lSkill, stage3Boss)) {
      finalBossHp -= (10 * dmgMult); hitSomething = true;
    }

    if (hitSomething) {
      lSkillsX.splice(i, 1); lSkillsY.splice(i, 1); lSkillsDir.splice(i, 1); lSkillsAngle.splice(i, 1);
    }
  }
}

function hammerSkillUpdate() {
  if (activeQSkill) {
    activeQSkill.timer++;
    push();
    let pivotX = activeQSkill.dir === 'right' ? playerX + playerWidth / 2 + 20 : playerX + playerWidth / 2 - 20;
    let pivotY = playerY + playerHeight / 2 + 50;
    translate(pivotX, pivotY);

    let progress = activeQSkill.timer / activeQSkill.maxTimer;
    if (progress > 1.0) progress = 1.0;
    let easeProgress = progress * progress;

    if (activeQSkill.dir === 'left') scale(-1, 1);
    rotate(-PI / 2 + (PI / 2) * easeProgress);

    if (typeof qSkillImg !== 'undefined' && qSkillImg) {
      imageMode(CENTER);
      image(qSkillImg, 300, 0, 600, 300);
    } else {
      rectMode(CENTER);
      fill(150); stroke(0); strokeWeight(2); rect(150, 0, 300, 40);
      fill(255, 50, 50); rect(400, 0, 200, 200);
    }
    pop();

    if (activeQSkill.timer === activeQSkill.maxTimer) {
      if (typeof qSkillSound !== 'undefined' && qSkillSound) {
        qSkillSound.setVolume(0.8);
        qSkillSound.play();
      }
      screenShake = 18;
      qImpactEffect = { x: pivotX + (activeQSkill.dir === 'right' ? 300 : -300), y: pivotY, size: 30, alpha: 255 };
      qSkillHitBoss(activeQSkill.dir, pivotX, pivotY);
    }
    if (activeQSkill.timer >= activeQSkill.maxTimer + activeQSkill.stayTimer) activeQSkill = null;
  }
}

function drawQImpactEffect() {
  if (!qImpactEffect) return;
  push();
  noFill();
  stroke(255, qImpactEffect.alpha);
  strokeWeight(6);
  ellipse(qImpactEffect.x, qImpactEffect.y, qImpactEffect.size);
  stroke(255, 200, 0, qImpactEffect.alpha);
  strokeWeight(4);
  ellipse(qImpactEffect.x, qImpactEffect.y, qImpactEffect.size * 1.5);
  qImpactEffect.size += 18;
  qImpactEffect.alpha -= 18;
  if (qImpactEffect.alpha <= 0) qImpactEffect = null;
  pop();
}

function qSkillHitBoss(dir, pivotX, pivotY) {
  let hitBox = { x: dir === 'right' ? pivotX : pivotX - 600, y: pivotY - 150, w: 600, h: 300 };
  let dmgMult = (typeof isRSkillActive !== 'undefined' && isRSkillActive) ? 2 : 1; // ★ 데미지 2배 적용

  if (typeof cppMobX !== 'undefined') {
    for (let j = 0; j < cppMobX.length; j++) {
      if (cppMobAlive[j] == false) continue;
      let mobBox = { x: cppMobX[j], y: cppMobY[j], w: cppMobWidth, h: cppMobHeight };
      if (checkCollision(hitBox, mobBox)) {
        cppMobHP[j] -= (3 * dmgMult); 
        if (cppMobHP[j] <= 0) cppMobAlive[j] = false;
      }
    }
  }

  if (typeof jsMobX !== 'undefined') {
    for (let j = 0; j < jsMobX.length; j++) {
      if (jsMobAlive[j] == false) continue;
      let mobBox = { x: jsMobX[j], y: jsMobY[j], w: jsMobWidth, h: jsMobHeight };
      if (checkCollision(hitBox, mobBox)) {
        jsMobHP[j] -= (3 * dmgMult); 
        if (jsMobHP[j] <= 0) jsMobAlive[j] = false;
      }
    }
  }

  if (typeof ksMobs !== 'undefined') {
    for (let j = ksMobs.length - 1; j >= 0; j--) {
      let m = ksMobs[j];
      let mobBox = { x: m.x, y: m.y, w: m.w, h: m.h };
      if (checkCollision(hitBox, mobBox)) {
        m.hp -= (20 * dmgMult); 
        if (m.hp <= 0) ksMobs.splice(j, 1);
      }
    }
  }

  let isKyungsuInvincible = typeof ksMobs !== 'undefined' && ksMobs.length > 0;
  let gicheolBoss = { x: typeof gicheolX !== 'undefined' ? gicheolX : 0, y: typeof gicheolY !== 'undefined' ? gicheolY : 0, w: typeof gicheolWidth !== 'undefined' ? gicheolWidth : 0, h: typeof gicheolHeight !== 'undefined' ? gicheolHeight : 0 };
  let kyungsuBoss = { x: typeof kyungsuX !== 'undefined' ? kyungsuX : 0, y: typeof kyungsuY !== 'undefined' ? kyungsuY : 0, w: typeof kyungsuWidth !== 'undefined' ? kyungsuWidth : 0, h: typeof kyungsuHeight !== 'undefined' ? kyungsuHeight : 0 };
  let stage3Boss = { x: typeof finalBossX !== 'undefined' ? finalBossX : 0, y: typeof finalBossY !== 'undefined' ? finalBossY : 0, w: typeof finalBossWidth !== 'undefined' ? finalBossWidth : 0, h: typeof finalBossHeight !== 'undefined' ? finalBossHeight : 0 };

  if (gameState === 'ssu_stage1') {
    if (typeof gicheolHp !== 'undefined' && gicheolHp > 0 && checkCollision(hitBox, gicheolBoss)) gicheolHp -= (20 * dmgMult);
    if (!isKyungsuInvincible && typeof kyungsuHp !== 'undefined' && kyungsuHp > 0 && checkCollision(hitBox, kyungsuBoss)) kyungsuHp -= (20 * dmgMult);
  } else if (gameState === 'ssu_stage3' && typeof finalBossHp !== 'undefined' && finalBossHp > 0 && checkCollision(hitBox, stage3Boss)) {
    finalBossHp -= (20 * dmgMult);
  }
}

// ==========================================
// ★ R스킬 전체화면 효과 및 무적 처리 함수
// ==========================================
function rSkillUpdate() {
  if (typeof isRSkillActive !== 'undefined' && isRSkillActive) {
    rSkillTimer--;
    
    // 5초 동안 계속해서 "방금 맞았음!"으로 취급하여 무적 판정(i-frame) 부여
    lastHitTime = millis(); 

    push();
    blendMode(SCREEN); // 검은색 배경을 투명하게 날리고 UI만 남김!
    imageMode(CORNER);
    if (typeof rSkillEffectImg !== 'undefined' && rSkillEffectImg) {
      image(rSkillEffectImg, 0, 0, width, height); // 화면을 꽉 채우기
    }
    blendMode(BLEND); // 원래대로 복구
    pop();

    if (rSkillTimer <= 0) {
      isRSkillActive = false; // 5초 끝나면 종료
    }
  }
}

function playBlockSound() {
  if (typeof eSkillSound === 'undefined' || !eSkillSound) return;
  if (millis() - lastBlockSoundTime > 200) {
    eSkillSound.setVolume(0.7);
    eSkillSound.play();
    lastBlockSoundTime = millis();
  }
}