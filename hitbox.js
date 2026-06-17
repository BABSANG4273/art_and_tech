function getPlayerHitbox() {
  return {
    x: playerX + hitboxShiftX,  // X 위치 이동 적용
    y: playerY + hitboxShiftY,  // Y 위치 이동 적용
    w: hitboxWidth,             // 고정 너비 적용
    h: hitboxHeight             // 고정 높이 적용
  };
}

// 붉은색 히트박스 (화면에서 보이지 않도록 그리기 코드 삭제)
function drawPlayerHitbox() {
  // 선을 그리는 코드를 모두 지웠습니다! 판정은 정상적으로 작동합니다.
}

// 충돌 감지
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.y + rect1.h > rect2.y
  );
}