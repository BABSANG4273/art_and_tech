function preloadMobs() {
  cppMobBasicImgs[0] = loadImage('mob/R_cpp_basic1.png');
  cppMobBasicImgs[1] = loadImage('mob/R_cpp_basic2.png');

  cppMobAttackImgs[0] = loadImage('mob/R_cpp_attack_cout.png');
  cppMobAttackImgs[1] = loadImage('mob/R_cpp_attack_cin.png');

  cppMobChangeImgs[0] = loadImage('mob/R_cpp_change.png');

  // JS 몹 이미지 추가
  jsMobBasicImgs[0] = loadImage('mob/R_js_basic.png');
  jsMobAttackImgs[0] = loadImage('mob/R_js_attack1.png');
  jsMobAttackImgs[1] = loadImage('mob/R_js_attack2.png');
}

function setupCppMobs() {
  cppMobX = [];
  cppMobY = [];
  cppMobHP = [];
  cppMobAlive = [];
  cppMobState = [];
  cppMobTimer = [];
  cppMobLastAttackTime = [];
  cppMobDirection = [];

  createCppMob(800, GROUND_Y + 70 - cppMobHeight, 5);
  createCppMob(1300, GROUND_Y + 70 - cppMobHeight, 5);
  createCppMob(1800, GROUND_Y + 70 - cppMobHeight, 5);
}

function createCppMob(x, y, hp) {
  cppMobX.push(x);
  cppMobY.push(y);
  cppMobHP.push(hp);
  cppMobAlive.push(true);
  cppMobState.push(0);
  cppMobTimer.push(0);

  cppMobLastAttackTime.push(0);
  cppMobDirection.push('left');
}

function updateCppMobs() {
  for (let i = 0; i < cppMobX.length; i++) {
    if (cppMobAlive[i] == false) continue;

    let xDistance = abs(playerX + playerWidth / 2 - (cppMobX[i] + cppMobWidth / 2));
    let yDistance = abs(playerY + playerHeight / 2 - (cppMobY[i] + cppMobHeight / 2));
    let canAttack = xDistance <= 80 && yDistance <= 80;

    // 플레이어한테 붙기 전에는 이동
    if (playerX < cppMobX[i]) {
      cppMobDirection[i] = 'left';
      cppMobX[i] -= cppMobSpeed;
    } else {
      cppMobDirection[i] = 'right';
      cppMobX[i] += cppMobSpeed;
    }

    // 플레이어한테 붙은 뒤 1초 지나면 공격
    if (canAttack && cppMobState[i] == 0) {
      if (cppMobLastAttackTime[i] == 0) {
        cppMobLastAttackTime[i] = millis();
      }

      if (millis() - cppMobLastAttackTime[i] >= 1000) {
        cppMobState[i] = 1;
        cppMobTimer[i] = millis();

        // ==========================================
        // ★ 무적 시간 판정 및 깜빡임 트리거(lastHitTime) 추가
        // ==========================================
        if (millis() - lastHitTime > 1000) {
          playerHp -= cppMobDamage;
          lastHitTime = millis(); // 이 한 줄이 깜빡임을 작동시킵니다!
          if (typeof updateSchoolScore === 'function') updateSchoolScore();
        }
      }
    }

    // 공격모션 0.3초 후 무기교체
    if (cppMobState[i] == 1) {
      if (millis() - cppMobTimer[i] >= 300) {
        cppMobState[i] = 2;
        cppMobTimer[i] = millis();
      }
    }
    // 무기교체 0.3초 후 다음 기본모션
    else if (cppMobState[i] == 2) {
      if (millis() - cppMobTimer[i] >= 300) {
        cppMobState[i] = 3;
        cppMobTimer[i] = millis();
      }
    }
    // 다음 기본모션으로 돌아간 뒤 다시 1초 기다림
    else if (cppMobState[i] == 3) {
      if (millis() - cppMobTimer[i] >= 300) {
        cppMobState[i] = 0;
        cppMobLastAttackTime[i] = millis();
      }
    }

    drawCppMob(i);

    if (cppMobHP[i] <= 0) {
      cppMobAlive[i] = false;
    }
  }
}

function drawCppMob(i) {
  push();

  let drawX = cppMobX[i];
  let drawY = cppMobY[i];

  if (cppMobDirection[i] === 'left') {
    translate(cppMobX[i] + cppMobWidth, cppMobY[i]);
    scale(-1, 1);

    drawX = 0;
    drawY = 0;
  }

  if (cppMobState[i] == 0) {
    image(cppMobBasicImgs[0], drawX, drawY, cppMobWidth, cppMobHeight);
  } else if (cppMobState[i] == 1) {
    image(cppMobAttackImgs[0], drawX, drawY, cppMobWidth + 80, cppMobHeight);
  } else if (cppMobState[i] == 2) {
    image(cppMobChangeImgs[0], drawX, drawY, cppMobWidth, cppMobHeight);
  } else if (cppMobState[i] == 3) {
    image(cppMobBasicImgs[1], drawX, drawY, cppMobWidth, cppMobHeight);
  }

  pop();

  // HP바는 반전되면 안 되니까 pop() 밖에서 따로 그림
  push();

  fill(255, 0, 0);
  rect(cppMobX[i], cppMobY[i] - 15, cppMobWidth, 8);

  fill(0, 255, 0);
  rect(cppMobX[i], cppMobY[i] - 15, cppMobWidth * (cppMobHP[i] / 5), 8);

  pop();
}

function setupJsMobs() {
  jsMobX = [];
  jsMobY = [];
  jsMobHP = [];
  jsMobAlive = [];
  jsMobState = [];
  jsMobTimer = [];
  jsMobLastAttackTime = [];
  jsMobDirection = [];

  createJsMob(1000, GROUND_Y + 70 - jsMobHeight, 6);
  createJsMob(1600, GROUND_Y + 70 - jsMobHeight, 6);
  createJsMob(2300, GROUND_Y + 70 - jsMobHeight, 6);
}

function createJsMob(x, y, hp) {
  jsMobX.push(x);
  jsMobY.push(y);
  jsMobHP.push(hp);
  jsMobAlive.push(true);
  jsMobState.push(0);
  jsMobTimer.push(0);
  jsMobLastAttackTime.push(0);
  jsMobDirection.push('left');
}

function updateJsMobs() {
  for (let i = 0; i < jsMobX.length; i++) {
    if (jsMobAlive[i] == false) continue;

    let distance = abs(playerX + playerWidth / 2 - (jsMobX[i] + jsMobWidth / 2));

    // 방향 갱신
    if (playerX < jsMobX[i]) {
      jsMobDirection[i] = 'left';
    } else {
      jsMobDirection[i] = 'right';
    }

    // 기본 상태일 때만 플레이어 쪽으로 이동
    if (distance > 100 && jsMobState[i] == 0) {
      if (playerX < jsMobX[i]) {
        jsMobX[i] -= jsMobSpeed;
      } else {
        jsMobX[i] += jsMobSpeed;
      }
    }

    // 붙은 뒤 1초 기다렸다가 공격1
    if (distance <= 100 && jsMobState[i] == 0) {
      if (jsMobLastAttackTime[i] == 0) {
        jsMobLastAttackTime[i] = millis();
      }

      if (millis() - jsMobLastAttackTime[i] >= 1000) {
        jsMobState[i] = 1;
        jsMobTimer[i] = millis();

        // ==========================================
        // ★ 무적 시간 판정 및 깜빡임 트리거(lastHitTime) 추가
        // ==========================================
        if (millis() - lastHitTime > 1000) {
          playerHp -= jsMobDamage;
          lastHitTime = millis(); // 이 한 줄이 깜빡임을 작동시킵니다!
          if (typeof updateSchoolScore === 'function') updateSchoolScore();
        }
      }
    }

    // 공격1 0.3초 후 공격2
    if (jsMobState[i] == 1) {
      if (millis() - jsMobTimer[i] >= 300) {
        jsMobState[i] = 2;
        jsMobTimer[i] = millis();
      }
    }
    // 공격2 0.3초 후 기본모션으로 복귀
    else if (jsMobState[i] == 2) {
      if (millis() - jsMobTimer[i] >= 300) {
        jsMobState[i] = 0;
        jsMobLastAttackTime[i] = millis();
      }
    }

    drawJsMob(i);

    if (jsMobHP[i] <= 0) {
      jsMobAlive[i] = false;
    }
  }
}

function drawJsMob(i) {
  push();

  let drawX = jsMobX[i];
  let drawY = jsMobY[i];

  if (jsMobDirection[i] === 'left') {
    translate(jsMobX[i] + jsMobWidth, jsMobY[i]);
    scale(-1, 1);

    drawX = 0;
    drawY = 0;
  }

  if (jsMobState[i] == 0) {
    image(jsMobBasicImgs[0], drawX, drawY, jsMobWidth, jsMobHeight);
  } else if (jsMobState[i] == 1) {
    image(jsMobAttackImgs[0], drawX - 40, drawY, jsMobWidth + 120, jsMobHeight);
  } else if (jsMobState[i] == 2) {
    image(jsMobAttackImgs[1], drawX - 40, drawY, jsMobWidth + 120, jsMobHeight);
  }

  pop();

  // HP바
  push();
  fill(255, 0, 0);
  rect(jsMobX[i], jsMobY[i] - 15, jsMobWidth, 8);

  fill(0, 255, 0);
  rect(jsMobX[i], jsMobY[i] - 15, jsMobWidth * (jsMobHP[i] / 6), 8);
  pop();
}
