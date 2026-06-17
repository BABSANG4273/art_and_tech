// ==========================================
// 정기철 교수님 변수
// ==========================================
let gicheolLastTeleport = 0;
let gicheolPosIdx = 1;

let gcSkill1Phase = 0; 
let gcSkill1Size = 0;
let gcSkill1MaxSize = 200;
let gcSkill1ChargeTimer = 0; 
let gcSkill1X = 0, gcSkill1Y = 0;
let gcSkill1VX = 0, gcSkill1VY = 0;
let gcSkill1Gravity = 0.5; 
let gcSkill1ExplosionTimer = 0;
let gcSkill1Img;
let gcSkill1ChargeImg; // 기 모으는 준비 동작 이미지
let gcSkill1ExplosionImg; // 터질 때 폭발 이미지

// ★ 정기철 5번 스킬 (거대 투사체) 변수
let gcSkill2Phase = 0;
let gcSkill2X = 0, gcSkill2Y = 0;
let gcSkill2W = 250, gcSkill2H = 170; // 아슬아슬하게 점프로 피할 수 있는 높이와 너비
let gcSkill2Speed = 18; // 플레이어보다 빠르게 덮치는 속도
let gcSkill2Timer = 0;
let gcSkill2Img; // 나중에 투사체 이미지를 넣을 변수

// ==========================================
// 오경수 교수님 스킬 변수
// ==========================================
let ksProjImg1, ksProjImg2, ksProjImg3;
let ksMobImg; 

let ksSkill1Phase = 0; 
let ksSkill1ActiveStep = 0; 
let ksSkill1Timer = 0;
let ksSkill1WaveCount = 0;

let ksProjectiles = [];
let ksMobs = [];

// ==========================================
// 최종 보스 (이운재 총장님) 스킬 변수
// ==========================================
// 중복 방지: 변수 선언은 여기에 한 번만!
let lastSkill6Time = 0;
let cameraSkill = null; // ★ 8번 스킬(글미포즈 카메라) 변수

function bosses() {
  updateBossPatterns(); 
  updateGicheolSkills(); 
  updateKyungsuSkills(); 

  gicheolBossDrawing();
  kyungsuBossDrawing();

  drawGicheolSkills(); 
  drawKyungsuSkills(); 

  gicheolBossHpDrawing();
  kyungsuBossHpDrawing();
}

// ==============================
// 정기철 스킬 로직
// ==============================
function triggerGicheolSkill(skillNum) {
  if (gicheolHp <= 0) return; 
  
  // 1번 스킬 (기존)
  if (skillNum === 1 && gcSkill1Phase === 0) {
    gcSkill1Phase = 1; gcSkill1Size = 10; gcSkill1ChargeTimer = 240; 
  }
  
  // ★ 5번 스킬 (거대 투사체) 발동
  else if (skillNum === 5 && gcSkill2Phase === 0) {
    gcSkill2Phase = 1;
    gcSkill2Timer = 180; // 1초(60프레임) 동안 기모으기 및 경고 표시
    
    // 정기철 교수를 보스존 맨 왼쪽 끝으로 순간이동
    gicheolX = bossground_X + 50; 
    gicheolY = bossground_Y + 120 - gicheolHeight; // 바닥에 딱 맞게 착지
    gicheolPosIdx = 0; // 텔레포트 인덱스 동기화
    gicheolLastTeleport = millis(); // 텔레포트 쿨타임 리셋
  }
}

function updateGicheolSkills() {
  // 1번 스킬 업데이트
  if (gcSkill1Phase === 1) {
    gcSkill1ChargeTimer--;
    gcSkill1Size = map(gcSkill1ChargeTimer, 240, 0, 10, gcSkill1MaxSize);
    gcSkill1X = gicheolX + gicheolWidth / 2;
    gcSkill1Y = gicheolY - gcSkill1Size / 2 - 20;
    if (gcSkill1ChargeTimer <= 0) {
      gcSkill1Phase = 2;
      let targetX = playerX + playerWidth / 2;
      let targetY = playerY + playerHeight / 2;
      let flightTime = 60; 
      gcSkill1VX = (targetX - gcSkill1X) / flightTime;
      gcSkill1VY = (targetY - gcSkill1Y - 0.5 * gcSkill1Gravity * flightTime * flightTime) / flightTime;
    }
  } else if (gcSkill1Phase === 2) {
    gcSkill1X += gcSkill1VX; gcSkill1Y += gcSkill1VY; gcSkill1VY += gcSkill1Gravity;
    let ballRect = { x: gcSkill1X - gcSkill1Size/2, y: gcSkill1Y - gcSkill1Size/2, w: gcSkill1Size, h: gcSkill1Size };
    let playerHitbox = getPlayerHitbox();
    let shield = getESkillHitbox();
    let hitGround = (gcSkill1Y + gcSkill1Size / 2 >= bossground_Y + 120);
    let hitPlayer = checkCollision(ballRect, playerHitbox);
    
    if (hitGround || hitPlayer) {
      gcSkill1Phase = 3; gcSkill1ExplosionTimer = 30; 
      if (hitPlayer || dist(gcSkill1X, gcSkill1Y, playerX + playerWidth/2, playerY + playerHeight/2) < gcSkill1Size + 50) {
        if (!shield || !checkCollision(shield, ballRect)) {
          if (millis() - lastHitTime > 1000) { playerHp -= 2; lastHitTime = millis(); updateSchoolScore(); }
        }
      }
    }
  } else if (gcSkill1Phase === 3) {
    gcSkill1ExplosionTimer--;
    if (gcSkill1ExplosionTimer <= 0) gcSkill1Phase = 0;
  }

  // ★ 5번 스킬 업데이트
  if (gcSkill2Phase === 1) {
    gcSkill2Timer--;
    if (gcSkill2Timer <= 0) {
      gcSkill2Phase = 2;
      gcSkill2X = gicheolX + gicheolWidth; // 보스 바로 앞에서 출발
      gcSkill2Y = bossground_Y + 120 - gcSkill2H; // 플레이어가 밟는 바닥 높이에 딱 맞춤
    }
  } else if (gcSkill2Phase === 2) {
    gcSkill2X += gcSkill2Speed; // 오른쪽으로 거세게 날아감
    
    // 피격 판정
    let pRect = { x: gcSkill2X, y: gcSkill2Y, w: gcSkill2W, h: gcSkill2H };
    let playerHitbox = getPlayerHitbox();
    let shield = getESkillHitbox();
    
    if (checkCollision(pRect, playerHitbox) && millis() - lastHitTime > 1000) {
      if (!shield || !checkCollision(shield, pRect)) {
        playerHp -= 2; // 거대 투사체 데미지
        lastHitTime = millis();
        updateSchoolScore();
      }
    }

    // 화면(플랫폼) 오른쪽 끝까지 가면 종료 및 삭제
    if (gcSkill2X > bossground_X + bossZoneFloorWidth) {
      gcSkill2Phase = 0;
    }
  }
}

function drawGicheolSkills() {
  push();

  // ==========================================
  // 4번 스킬 (나선환) 처리
  // ==========================================
  if (gcSkill1Phase === 1) {
    // Phase 1: 기 모으는 준비 동작
    if (gcSkill1ChargeImg) {
      imageMode(CENTER);
      image(gcSkill1ChargeImg, gcSkill1X, gcSkill1Y, gcSkill1Size, gcSkill1Size);
    } else {
      fill(0, 50, 255, 200); ellipse(gcSkill1X, gcSkill1Y, gcSkill1Size, gcSkill1Size);
    }
  } 
  else if (gcSkill1Phase === 2) {
    // Phase 2: 날아가는 중
    if (gcSkill1Img) {
      imageMode(CENTER);
      image(gcSkill1Img, gcSkill1X, gcSkill1Y, gcSkill1Size, gcSkill1Size);
    } else {
      fill(0, 50, 255, 200); ellipse(gcSkill1X, gcSkill1Y, gcSkill1Size, gcSkill1Size);
    }
  } 
  else if (gcSkill1Phase === 3) {
    // Phase 3: 폭발
    let alpha = map(gcSkill1ExplosionTimer, 0, 30, 0, 255);
    push();
    tint(255, alpha);
    if (gcSkill1ExplosionImg) {
      imageMode(CENTER);
      image(gcSkill1ExplosionImg, gcSkill1X, gcSkill1Y, gcSkill1MaxSize + 100, gcSkill1MaxSize + 100);
    } else {
      fill(255, 0, 0, alpha); noStroke();
      ellipse(gcSkill1X, gcSkill1Y, gcSkill1MaxSize + 100, gcSkill1MaxSize + 100);
    }
    pop();
  }

 // ==========================================
  // 5번 스킬 처리 (drawGicheolSkills 함수 내)
  // ==========================================
  if (gcSkill2Phase === 1) {
    // Phase 1: 기 모으기 및 경고 표시 (교수님 깜빡임)
    if (frameCount % 20 < 10) {
      fill(255, 0, 0, 150);
      noStroke();
      rect(gicheolX, gicheolY, gicheolWidth, gicheolHeight);
    }
    
    // 투명한 네모 모양 안내선
    fill(255, 0, 0, 80); 
    noStroke();
    
    // 안내선 시작 X 위치
    let rectX = gicheolX + gicheolWidth;
    // 안내선 길이 (보스존 끝까지)
    let rectW = (bossground_X + bossZoneFloorWidth) - rectX;
    // 투사체 높이 중앙에 맞춘 Y 위치
    let rectY = bossground_Y + 120 - gcSkill2H / 2;
    
    // 깔끔한 네모 모양으로 그리기
    rect(rectX, rectY, rectW, gcSkill2H);
  } 
  else if (gcSkill2Phase === 2) {
    // Phase 2: 투사체 발사
    if (typeof gcSkill2Img !== 'undefined' && gcSkill2Img) {
      imageMode(CORNER);
      image(gcSkill2Img, gcSkill2X, gcSkill2Y, gcSkill2W, gcSkill2H);
    } else {
      fill(150, 0, 255); 
      rect(gcSkill2X, gcSkill2Y, gcSkill2W, gcSkill2H, 20);
    }
  }

  pop();
}

// ==============================
// 오경수 교수님 스킬 발동
// ==============================
function triggerKyungsuSkill(skillNum) {
  if (kyungsuHp <= 0) return; 

  if (skillNum === 1 && ksSkill1Phase === 0) {
    ksSkill1Phase = 1;
    ksSkill1ActiveStep = 1;
    ksSkill1WaveCount = 0;
    ksSkill1Timer = 0; 
  } 
  else if (skillNum === 2) {
    ksMobs = [];
    ksMobs.push({ x: kyungsuX - 150, y: bossground_Y + 120 - 60, w: 60, h: 60, hp: 30, damage: 1, speed: 2.5, isBig: false });
    ksMobs.push({ x: kyungsuX + 150, y: bossground_Y + 120 - 60, w: 60, h: 60, hp: 30, damage: 1, speed: 2.5, isBig: false });
    
    ksMobs.push({ x: kyungsuX, y: bossground_Y + 120 - 150, w: 150, h: 150, hp: 60, damage: 2, speed: 1.5, isBig: true });
  }
}

function updateKyungsuSkills() {
  if (ksSkill1Phase === 1) {
    if (ksSkill1Timer > 0) {
      ksSkill1Timer--; 
    } else {
      
      // [1단계]: 대형 하단 휩쓸기
      if (ksSkill1ActiveStep === 1) {
        ksProjectiles.push({
          type: 'linear', x: kyungsuX, y: bossground_Y + 120 - 140, 
          w: 150, h: 120, vx: -18, vy: 0, damage: 1, delay: 0
        });
        ksSkill1ActiveStep = 2; 
        ksSkill1Timer = 90; 
      }
      // [2단계]: 대형 천장 유도 투사체
      else if (ksSkill1ActiveStep === 2) {
        for(let i=0; i<3; i++) {
          let startX = bossground_X + random(0, bossZoneFloorWidth);
          let startY = bossground_Y - 800 + random(-100, 100);
          
          let targetX = playerX + playerWidth / 2;
          let targetY = playerY + playerHeight / 2;
          let angle = atan2(targetY - startY, targetX - startX);
          let speed = 12;
          
          ksProjectiles.push({
            type: 'homing', x: startX, y: startY, w: 100, h: 100, 
            vx: cos(angle) * speed, vy: sin(angle) * speed, damage: 1, delay: 0
          });
        }
        ksSkill1ActiveStep = 3; 
        ksSkill1WaveCount = 0;
        ksSkill1Timer = 120; 
      }
      // [3단계]: 거대 낙하 블록
      else if (ksSkill1ActiveStep === 3) {
        if (ksSkill1WaveCount < 2) { 
          let isOddWave = (ksSkill1WaveCount % 2 === 0); 
          let segmentsCount = 20; 
          let segWidth = bossZoneFloorWidth / segmentsCount; 
          
          for (let i = 0; i < segmentsCount; i++) {
            if ((i % 2 === 0) === isOddWave) {
              let projW = segWidth * 0.55; 
              ksProjectiles.push({
                type: 'block', x: bossground_X + i * segWidth + (segWidth - projW) / 2, 
                y: bossground_Y - 800, w: projW, h: 150, vx: 0, vy: 11.5, damage: 1, delay: 0
              });
            }
          }
          ksSkill1WaveCount++;
          ksSkill1Timer = 60; 
        } else {
          ksSkill1ActiveStep = 4; 
          ksSkill1WaveCount = 0;
          ksSkill1Timer = 0; 
        }
      }
      // [4단계]: 거대 낙하 블록 + 휩쓸기 콤보
      else if (ksSkill1ActiveStep === 4) {
        if (ksSkill1WaveCount < 2) { 
          let isOddWave = (ksSkill1WaveCount % 2 === 0); 
          let segmentsCount = 20; 
          let segWidth = bossZoneFloorWidth / segmentsCount; 
          
          for (let i = 0; i < segmentsCount; i++) {
            if ((i % 2 === 0) === isOddWave) {
              let projW = segWidth * 0.55; 
              ksProjectiles.push({
                type: 'block', x: bossground_X + i * segWidth + (segWidth - projW) / 2, 
                y: bossground_Y - 800, w: projW, h: 150, vx: 0, vy: 11.5, damage: 1, delay: 0
              });
            }
          }
          ksProjectiles.push({
            type: 'linear', x: kyungsuX, y: bossground_Y + 120 - 140, 
            w: 150, h: 120, vx: -16, vy: 0, damage: 1, delay: 45 
          });

          ksSkill1WaveCount++;
          ksSkill1Timer = 60; 
        } else {
          ksSkill1Phase = 2; 
        }
      }
    }
  } 
  else if (ksSkill1Phase === 2) {
    if (ksProjectiles.length === 0) {
      ksSkill1Phase = 0;
    }
  }

  // 투사체 이동 및 피격 로직
  for (let i = ksProjectiles.length - 1; i >= 0; i--) {
    let p = ksProjectiles[i];

    if (p.delay !== undefined && p.delay > 0) {
      p.delay--;
      continue; 
    }

    p.x += p.vx;
    p.y += p.vy;

    let pRect = { x: p.x, y: p.y, w: p.w, h: p.h };
    let playerHitbox = getPlayerHitbox();
    let shield = getESkillHitbox();

    if (checkCollision(pRect, playerHitbox) && millis() - lastHitTime > 1000) {
      if (shield && checkCollision(shield, pRect)) {
      } else {
        playerHp -= p.damage;
        lastHitTime = millis();
        updateSchoolScore();
      }
      ksProjectiles.splice(i, 1);
      continue;
    }

    if (p.type === 'block' || p.type === 'homing') {
      if (p.y > bossground_Y + 120 - p.h) ksProjectiles.splice(i, 1);
    } else if (p.type === 'linear') {
      if (p.x + p.w < bossground_X) ksProjectiles.splice(i, 1);
    }
  }

  for (let i = ksMobs.length - 1; i >= 0; i--) {
    let m = ksMobs[i];
    if (m.x + m.w / 2 < playerX + playerWidth / 2) m.x += m.speed;
    else m.x -= m.speed;

    let mRect = { x: m.x, y: m.y, w: m.w, h: m.h };
    let playerHitbox = getPlayerHitbox();
    let shield = getESkillHitbox();

    if (checkCollision(mRect, playerHitbox) && millis() - lastHitTime > 1000) {
      if (shield && checkCollision(shield, mRect)) {
      } else {
        playerHp -= m.damage;
        lastHitTime = millis();
        updateSchoolScore();
      }
    }
  }
}

function drawKyungsuSkills() {
  push();
  for (let i = 0; i < ksProjectiles.length; i++) {
    let p = ksProjectiles[i];
    if (p.delay !== undefined && p.delay > 0) continue;
    
    if (p.type === 'linear') {
      if (ksProjImg1) image(ksProjImg1, p.x, p.y, p.w, p.h);
      else { fill(255, 100, 0); rect(p.x, p.y, p.w, p.h, 5); }
    } 
    else if (p.type === 'homing') {
      if (ksProjImg2) image(ksProjImg2, p.x, p.y, p.w, p.h);
      else { fill(0, 255, 255); ellipse(p.x + p.w/2, p.y + p.h/2, p.w, p.h); } 
    } 
    else if (p.type === 'block') {
      if (ksProjImg3) image(ksProjImg3, p.x, p.y, p.w, p.h);
      else { fill(255, 0, 255); rect(p.x, p.y, p.w, p.h, 10); } 
    }
  }

  for (let i = 0; i < ksMobs.length; i++) {
    let m = ksMobs[i];
    if (m.isBig) {
      if (typeof ksMobBigImg !== 'undefined' && ksMobBigImg) image(ksMobBigImg, m.x, m.y, m.w, m.h);
      else { fill(200, 0, 0); rect(m.x, m.y, m.w, m.h); }
    } else {
      if (typeof ksMobSmallImg !== 'undefined' && ksMobSmallImg) image(ksMobSmallImg, m.x, m.y, m.w, m.h);
      else { fill(255, 150, 150); rect(m.x, m.y, m.w, m.h); }
    }
    fill(0); rect(m.x, m.y - 15, m.w, 8);
    fill(0, 255, 0); rect(m.x, m.y - 15, m.w * (m.hp / (m.isBig ? 60 : 30)), 8);
  }
  
  pop();
}

// 정기철 텔레포트 및 보스 그리기
function updateBossPatterns() {
  if (gicheolHp > 0) {
    // 5번 스킬 시전 중일 때는 일반 텔레포트를 잠시 멈춥니다!
    if (playerX >= bossground_X && gcSkill2Phase === 0) {
      if (gicheolLastTeleport === 0) {
        gicheolLastTeleport = millis();
      }

      if (millis() - gicheolLastTeleport > 10000) {
        gicheolPosIdx = (gicheolPosIdx + 1) % 3; 
        
        let leftPos = bossground_X + 200;
        let centerPos = bossground_X + bossZoneFloorWidth / 2 - gicheolWidth / 2;
        let rightPos = bossground_X + bossZoneFloorWidth - 200 - gicheolWidth;

        if (gicheolPosIdx === 0) gicheolX = leftPos;
        else if (gicheolPosIdx === 1) gicheolX = centerPos;
        else if (gicheolPosIdx === 2) gicheolX = rightPos;

        gicheolLastTeleport = millis(); 
      }
    } else if (playerX < bossground_X) {
      gicheolLastTeleport = 0;
      gicheolPosIdx = 1;
      gicheolX = bossground_X + bossZoneFloorWidth / 2;
    }
  }
}

function gicheolBossDrawing() {
  if (gicheolHp > 0) {
    push();
    if (typeof gicheolImg !== 'undefined' && gicheolImg) {
      image(gicheolImg, gicheolX, gicheolY, gicheolWidth, gicheolHeight);
    } else {
      fill(255, 255, 0); rect(gicheolX, gicheolY, gicheolWidth, gicheolHeight);
    }
    pop();
  }
}

function kyungsuBossDrawing() {
  if (kyungsuHp > 0) {
    push();
    if (ksMobs.length > 0) {
      stroke(0, 255, 255);
      strokeWeight(5);
    } else {
      noStroke();
    }
    
    if (typeof kyungsuImg !== 'undefined' && kyungsuImg) {
      image(kyungsuImg, kyungsuX, kyungsuY, kyungsuWidth, kyungsuHeight);
    } else {
      fill(255, 255, 0); rect(kyungsuX, kyungsuY, kyungsuWidth, kyungsuHeight);
    }
    pop();
  }
}

function gicheolBossHpDrawing() {
  if (gicheolHp > 0) {
    let gicheolHpWidth = (gicheolHp / gicheolMaxHp) * 200;
    push(); stroke(0); fill(100); rect(gicheolX, gicheolY - 50, 200, 30);
    fill(255, 0, 0); rect(gicheolX, gicheolY - 50, gicheolHpWidth, 30); pop();
  }
}

function kyungsuBossHpDrawing() {
  if (kyungsuHp > 0) {
    let kyungsuHpWidth = (kyungsuHp / kyungsuMaxHp) * 100;
    push(); stroke(0); fill(100); rect(kyungsuX, kyungsuY - 50, 100, 30);
    if (ksMobs.length > 0) fill(0, 255, 255);
    else fill(255, 0, 0);
    rect(kyungsuX, kyungsuY - 50, kyungsuHpWidth, 30); pop();
  }
}

function drawFinalBoss() {
  // 0. 보스 생존 여부 확인
  if (typeof finalBossHp === 'undefined' || finalBossHp <= 0) return;

  // 1. 보스 그리기 (이미지 없으면 빨간 박스)
  if (typeof unjeImg !== 'undefined' && unjeImg) {
    image(unjeImg, finalBossX, finalBossY, finalBossWidth, finalBossHeight);
  } else {
    fill(255, 0, 0); rect(finalBossX, finalBossY, finalBossWidth, finalBossHeight);
  }

  // 2. 체력바
  let hpRatio = max(0, finalBossHp / finalBossMaxHp);
  push(); fill(100); rect(finalBossX, finalBossY - 30, finalBossWidth, 20);
  fill(255, 0, 0); rect(finalBossX, finalBossY - 30, finalBossWidth * hpRatio, 20); pop();

  // 3. 6번 스킬: 투사체
  if (typeof isFinalBossSkill1Active !== 'undefined' && isFinalBossSkill1Active) {
    // [기존 로직] 90프레임마다 랜덤 높이에서 생성
    finalBossSkill1Timer--;
    if (finalBossSkill1Timer <= 0) {
      finalBossProjectiles.push({ x: finalBossX - 50, y: random([GROUND_Y+70-playerHeight, GROUND_Y+70-playerHeight-220, GROUND_Y+70-playerHeight-380]) + 20, w: 360, h: 180, speed: 10 });
      finalBossSkill1Count++;
      
      if (finalBossSkill1Count >= 15) {
        isFinalBossSkill1Active = false;
      } else {
        finalBossSkill1Timer = 90; 
      }
    }

    if (frameCount % 60 === 0) { // 60프레임마다 발사
      finalBossProjectiles.push({ x: finalBossX - 50, y: -400, w: 200, h: 300, speed: 10 });
    }
  }

  for (let i = finalBossProjectiles.length - 1; i >= 0; i--) {
    let p = finalBossProjectiles[i];
    p.x -= p.speed;
    // 이미지 없으면 오렌지색 박스
    if (typeof finalBossProjImg !== 'undefined' && finalBossProjImg) image(finalBossProjImg, p.x, p.y, p.w, p.h);
    else { fill(255, 100, 0); rect(p.x, p.y, p.w, p.h); }

    if (p.x < final_bossground_X - 500) { finalBossProjectiles.splice(i, 1); continue; }
    
    // 6번 스킬 충돌 판정 및 방패(E스킬) 방어 적용
    let pRect = { x: p.x, y: p.y, w: p.w, h: p.h };
    let playerHitbox = getPlayerHitbox();
    let shield = getESkillHitbox(); // 방패 히트박스 가져오기

    if (checkCollision(pRect, playerHitbox) && millis() - lastHitTime > 1000) {
       // 방패와 충돌했다면 방어 성공! (데미지 없음)
       if (shield && checkCollision(shield, pRect)) {
          // 필요하다면 여기서 막는 소리 재생 등을 추가할 수 있습니다.
       } else {
          playerHp -= 1; 
          lastHitTime = millis(); 
          updateSchoolScore();
       }
    }
  }

  // 4. 7번 스킬: 레이저 (이미지 없으면 파란 원/빨간 박스)
  if (typeof laserBeam !== 'undefined' && laserBeam && laserBeam.active) {
    laserBeam.timer++;
    
    // 이미지 결정 (이동중 vs 발사중)
    let imgToDraw = (laserBeam.phase === 0) ? laserMovingImg : laserArrivedImg;

    if (imgToDraw) {
      imageMode(CENTER);
      image(imgToDraw, laserBeam.x, laserBeam.y, 100, 100);
    } else { 
      fill(laserBeam.phase === 0 ? 0 : 255, 0, laserBeam.phase === 0 ? 255 : 0); 
      ellipse(laserBeam.x, laserBeam.y, 80, 80); 
    }

    if (laserBeam.phase === 0) {
      laserBeam.x -= 15;
      if (laserBeam.x <= laserBeam.targetX) { 
        laserBeam.phase = 1; 
        laserBeam.timer = 0; 
      }
    } else if (laserBeam.phase === 1 && laserBeam.fireCount < 3) {
      let cycle = laserBeam.timer % 100; 
      
      if (cycle < 40) { 
        push(); 
        stroke(255, 0, 0, 80); 
        strokeWeight(2);
        line(laserBeam.x, laserBeam.y, playerX + playerWidth / 2, GROUND_Y); 
        pop(); 
        
        laserBeam.lockedTargetX = playerX + playerWidth / 2; 
      }
      else if (cycle < 60) { 
        push(); 
        stroke(255, 0, 0, 200); 
        strokeWeight(5);
        line(laserBeam.x, laserBeam.y, laserBeam.lockedTargetX, GROUND_Y); 
        pop(); 
      }
      else if (cycle < 80) {
        push(); 
        stroke(255, 0, 0, 255); 
        strokeWeight(15);
        line(laserBeam.x, laserBeam.y, laserBeam.lockedTargetX, GROUND_Y); 
        pop(); 
        
        // 7번 스킬 레이저 피격 및 방패(E스킬) 방어 적용
        if (abs((playerX + playerWidth / 2) - laserBeam.lockedTargetX) < 50) {
          // 레이저를 위한 가상의 히트박스 생성 (고정된 X좌표 중심의 기둥 형태)
          let laserRect = { x: laserBeam.lockedTargetX - 15, y: laserBeam.y, w: 30, h: GROUND_Y - laserBeam.y };
          let shield = getESkillHitbox(); // 방패 히트박스 가져오기
          
          // 방패로 막고 있다면 방어 성공!
          if (shield && checkCollision(shield, laserRect)) {
             // 방어 성공 처리
          } else {
             playerHp -= 0.1; 
          }
        }
      }
      
      if (cycle === 99) laserBeam.fireCount++;
    } else if (laserBeam.phase === 1) {
      laserBeam.active = false;
    }
  }

  // ==========================================
  // ★ 8번 카메라 공격 로직 (빨간 네모 테두리 제거 버전)
  // ==========================================
  if (typeof cameraSkill !== 'undefined' && cameraSkill && cameraSkill.active) {
    cameraSkill.timer++;
    
    // [Phase 0] 흐린 포즈 표시 (2초 = 120프레임 대기)
    if (cameraSkill.phase === 0) {
      push();
      imageMode(CENTER);
      blendMode(SCREEN); 
      if (typeof cameraWarningImg !== 'undefined' && cameraWarningImg) {
        image(cameraWarningImg, cameraSkill.x, cameraSkill.y, cameraSkill.size, cameraSkill.size);
      }
      blendMode(BLEND); 
      pop(); // ★ 빨간색 안내선(rect) 그리는 코드 삭제 완료

      // 2초(120프레임)가 지나면 공격 페이즈로 넘어감
      if (cameraSkill.timer >= 120) {
        cameraSkill.phase = 1;
        cameraSkill.timer = 0;

        // 공격 순간! 가운데 네모 공간에 플레이어가 있으면 데미지 판정 (판정은 그대로 작동합니다)
        let hitRect = {
          x: cameraSkill.x - cameraSkill.innerSize / 2,
          y: cameraSkill.y - cameraSkill.innerSize / 2,
          w: cameraSkill.innerSize,
          h: cameraSkill.innerSize
        };
        let pRect = getPlayerHitbox();
        let shield = typeof getESkillHitbox === 'function' ? getESkillHitbox() : null;

        if (checkCollision(pRect, hitRect)) {
          if (!(shield && checkCollision(shield, hitRect))) { 
            if (millis() - lastHitTime > 1000) {
              playerHp -= 1;
              lastHitTime = millis();
              if (typeof updateSchoolScore === 'function') updateSchoolScore();
            }
          }
        }
      }
    } 
    // [Phase 1] 공격 포즈 표시 (0.5초 = 30프레임 동안 유지)
    else if (cameraSkill.phase === 1) {
      push();
      imageMode(CENTER);
      blendMode(SCREEN);
      if (typeof cameraAttackImg !== 'undefined' && cameraAttackImg) {
        image(cameraAttackImg, cameraSkill.x, cameraSkill.y, cameraSkill.size, cameraSkill.size);
      }
      blendMode(BLEND);
      pop(); // ★ 강한 붉은 테두리(rect) 그리는 코드 삭제 완료

      // 0.5초가 지나면 다음 타겟팅을 준비하거나 스킬을 끝냄
      if (cameraSkill.timer >= 30) {
        cameraSkill.count++;
        if (cameraSkill.count >= 3) {
          cameraSkill.active = false; // 3번 다 쏘면 종료
        } else {
          // 다시 플레이어의 새로운 위치를 잡고 흐린 포즈부터 시작
          cameraSkill.phase = 0;
          cameraSkill.timer = 0;
          cameraSkill.x = playerX + playerWidth / 2;
          cameraSkill.y = playerY + playerHeight / 2;
        }
      }
    }
  }
}

// ==============================
// 최종 보스 (이운재 총장님) 스킬 발동
// ==============================
function triggerFinalBossSkill(skillNum) {
  if (typeof finalBossHp === 'undefined' || finalBossHp <= 0) return;

  // 6번 스킬: 다중 투사체 발사
  if (skillNum === 1) {
    if (!isFinalBossSkill1Active && millis() - lastSkill6Time > 1000) {
      isFinalBossSkill1Active = true;
      finalBossSkill1Timer = 0;
      finalBossSkill1Count = 0;
      finalBossProjectiles = []; // 투사체 배열 초기화
      lastSkill6Time = millis(); // 마지막 실행 시간 기록
    }
  }

  // 7번 스킬: 모기 날리기 및 레이저 발사
  else if (skillNum === 2) {
    laserBeam = {
      active: true,
      phase: 0,                  // 0: 플레이어 쪽으로 날아가는 중, 1: 멈춰서 레이저 발사 중
      x: finalBossX,             // 보스 위치에서 출발
      y: finalBossY - 200,       
      targetX: finalBossX - 600, // 보스 앞으로 일정 거리 날아간 뒤 멈출 위치
      timer: 0,
      fireCount: 0,
      lockedTargetX: 0           
    };
  }

  // ★ 8번 스킬: 글미 포즈 카메라 공격 (추가됨!)
  else if (skillNum === 3) {
    cameraSkill = {
      active: true,
      phase: 0,   // 0: 흐린 포즈(경고), 1: 선명한 포즈(공격)
      count: 0,   // 공격 횟수 카운트
      timer: 0,
      x: playerX + playerWidth / 2, // 플레이어의 현재 위치 고정
      y: playerY + playerHeight / 2,
      size: 700,      // 손 포즈 이미지 전체 크기
      innerSize: 220  // 가운데 네모 공간(타격 판정)의 크기
    };
  }
}