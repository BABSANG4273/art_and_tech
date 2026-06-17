function ssuStage1() {
  if (playerX + playerWidth >= bossground_X) {
    bossZoneBackgroundDrawing();
    playAtBossBgm();
  } else {
    atBackgroundDrawing();

    if (currentBgm !== 'stage1') {
      playStage1Bgm();
    }
  }

  hpDrawing();
  schoolScoresDrawing();

  // ===== 여기서부터 카메라와 맵 이동을 위한 push 시작! =====
  push();
  applyCamera();
  drawEnvironment();
  BackgroundObjectiveDrawing();
  updateCppMobs();
  updateJsMobs();
  movePlayer();
  stage1PlayerLanding();
  drawPlayer();
  bosses();

  // 스킬 업데이트 (L: 투사체, Q: 망치, E: 방어막)
  lSkillMove();
  lSkillDrawing();
  lSkillHitBoss();

  hammerSkillUpdate();
  drawQImpactEffect();
  eSkillUpdate(); // E 스킬(방어막) 작동

  // 피격 처리 (방패 방어 판정 포함)
  checkPlayerBossCollision();
  //---------------추가및변경--------------
  // 보스를 모두 잡았을 때 (스테이지 2로 이동)
  if (gicheolHp <= 0 && kyungsuHp <= 0) {
    stage1Portal();
  }

  // ===== 카메라 이동 설정 끝! 짝꿍 pop! =====
  pop();

  rSkillUpdate();

  skillbarDrawing();
  skillsCooltime();

  // 게임 오버
  if (playerHp <= 0) {
    gameState = 'gameover';
  }
  //-------------------------------------------
}

// 보스와의 충돌 검사 (방어막 로직 포함)
function checkPlayerBossCollision() {
  let playerHitbox = getPlayerHitbox();
  let shieldHitbox = getESkillHitbox(); // 켜져있는 방패 영역 가져오기

  let gicheolBoss = {
    x: gicheolX,
    y: gicheolY,
    w: gicheolWidth,
    h: gicheolHeight,
  };
  let kyungsuBoss = {
    x: kyungsuX,
    y: kyungsuY,
    w: kyungsuWidth,
    h: kyungsuHeight,
  };

  if (millis() - lastHitTime > 1000) {
    let isHit = false;

    // 1. 기철 교수님 충돌 검사
    if (gicheolHp > 0 && checkCollision(playerHitbox, gicheolBoss)) {
      // 플레이어와 닿았지만, 방패와도 닿아있다면 방어 성공!
      if (shieldHitbox && checkCollision(shieldHitbox, gicheolBoss)) {
        playBlockSound();
      } else {
        isHit = true;
      }
    }
    // 2. 경수 교수님 충돌 검사
    else if (kyungsuHp > 0 && checkCollision(playerHitbox, kyungsuBoss)) {
      if (shieldHitbox && checkCollision(shieldHitbox, kyungsuBoss)) {
        playBlockSound();
      } else {
        isHit = true;
      }
    }

    // 최종적으로 피격 당했다면 체력 깎기
    if (isHit) {
      playerHp -= 1;
      lastHitTime = millis();
      updateSchoolScore();
    }
  }
}
