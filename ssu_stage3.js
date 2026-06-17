function ssuStage3() {
  ssuUnivesityBackground();

  // ==========================================
  if (playerX + playerWidth >= final_bossground_X) {
    playFinalBossBgm();
  } else {
    playStage3Bgm();
  }

  hpDrawing();
  schoolScoresDrawing();

  // ===== 여기서부터 카메라와 맵 이동을 위한 push 시작! =====
  push();
  applyCamera();
  stage3DrawEnvironment();
  BackgroundObjectiveDrawing();

  movePlayer();
  stage3PlayerLanding();
  drawPlayer();
  drawFinalBoss();

  // 스킬 업데이트 (L: 투사체, Q: 망치, E: 방어막)
  lSkillMove();
  lSkillDrawing();
  lSkillHitBoss();

  hammerSkillUpdate();
  drawQImpactEffect();
  eSkillUpdate(); // E 스킬(방어막) 작동

  pop();

  rSkillUpdate();
  
  skillbarDrawing();
  skillsCooltime();
  // 게임 오버
  if (playerHp <= 0) {
    gameState = 'gameover';
  }

  // 최종 보스 처치 시 게임 클리어(졸업) 화면으로 이동
  if (typeof finalBossHp !== 'undefined' && finalBossHp <= 0) {
    stopAllBgm(); 
    currentBgm = '';
    
    if (typeof clearStartFrame === 'undefined' || clearStartFrame === 0) {
        clearStartFrame = frameCount; 
    }
    
    gameState = 'clear';
  }
}