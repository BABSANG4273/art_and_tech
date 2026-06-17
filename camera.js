function applyCamera() {
  // ★ 보스방 진입 시 부드러운 줌아웃 연출
  if (gameState === 'ssu_stage3' && isFinalBossZoneEntered) {
    zoomLevel = lerp(zoomLevel, 0.75, 0.05); 
  } else {
    zoomLevel = lerp(zoomLevel, 1.0, 0.05); 
  }

  let visibleWidth = width / zoomLevel;
  let visibleHeight = height / zoomLevel;

  // 기본적으로 카메라가 플레이어를 따라다니는 설정
  let cameraX = playerX + playerWidth / 2 - visibleWidth / 2;
  let cameraY = playerY + playerHeight / 2 - visibleHeight / 1.5;

  if (gameState === 'ssu_stage1') {
    if (playerX < bossground_X) {
      cameraX = max(0, cameraX);
    } else {
      let center = bossground_X + bossZoneFloorWidth / 2;
      // 화면이 보스방보다 크면 중앙 고정, 아니면 플레이어 추적
      if (visibleWidth >= bossZoneFloorWidth) {
        cameraX = center - visibleWidth / 2;
      } else {
        cameraX = max(bossground_X, cameraX);
        cameraX = min(cameraX, bossground_X + bossZoneFloorWidth - visibleWidth);
      }
    }
  }

  if (gameState === 'ssu_stage3') {
    if (!isFinalBossZoneEntered) {
      cameraX = max(0, cameraX);
    } else {
      let center = final_bossground_X + final_bossZoneFloorWidth / 2;
      // 화면 튕김 방지용 X축 고정 로직
      if (visibleWidth >= final_bossZoneFloorWidth) {
        cameraX = center - visibleWidth / 2;
      } else {
        cameraX = max(final_bossground_X, cameraX);
        cameraX = min(cameraX, final_bossground_X + final_bossZoneFloorWidth - visibleWidth);
      }

      // ==========================================
      // ★ [핵심 추가] 3라운드 보스전 Y축 카메라 고정!
      // 플레이어가 아무리 높이 점프해도, 카메라는 땅(final_bossground_Y) 높이를 기준으로 얼어붙습니다.
      // ==========================================
      cameraY = final_bossground_Y + playerHeight / 2 - visibleHeight / 1.5;
    }
  }

  scale(zoomLevel);

  // 화면 흔들림 효과
  if (screenShake > 0) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
    screenShake *= 0.85;
    if (screenShake < 0.5) screenShake = 0;
  }

  translate(-cameraX, -cameraY);
}