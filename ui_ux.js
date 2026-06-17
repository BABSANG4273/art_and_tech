// ui_ux.js (UI만 개선, 클릭 영역/좌표 완전 동일 유지)

function inRect(mx, my, x, y, w, h) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function shadowRect(x, y, w, h, r = 12, a = 50, oy = 8) {
  push();
  noStroke();
  fill(0, a);
  rect(x, y + oy, w, h, r);
  pop();
}

function panel(x, y, w, h, r = 16) {
  shadowRect(x, y, w, h, r, 45, 10);
  push();
  stroke(230);
  strokeWeight(2);
  fill(255);
  rect(x, y, w, h, r);
  pop();
}

function fancyButton(x, y, w, h, label, base = [255, 255, 255]) {
  const hovered = inRect(mouseX, mouseY, x, y, w, h);
  const pressed = hovered && mouseIsPressed;

  shadowRect(x, y, w, h, 12, 35, 6);

  push();
  stroke(0);
  strokeWeight(3);
  if (pressed) fill(base[0] - 20, base[1] - 20, base[2] - 20);
  else if (hovered) fill(base[0] - 10, base[1] - 10, base[2] - 10);
  else fill(...base);
  rect(x, y, w, h, 12);

  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(45);
  text(label, x + w / 2, y + h / 2 + 2);
  pop();
}

function softTitle(t1, t2) {
  push();
  // 얇은 배경 라벨
  noStroke();
  fill(26, 58, 92, 18);
  rect(130, 120, 360, 44, 10);

  // 메인 타이틀
  fill(220, 0, 0);
  textSize(120);
  text(t1, 150, 180);

  fill(0);
  textSize(110);
  text(t2, 600, 350);
  pop();
}

// 시작 화면
function drawStartScreen() {
  drawStartBackground();

  // 사진이 너무 밝으면 살짝 흰색 반투명만 덮기
  push();
  noStroke();
  fill(255, 180);
  rect(0, 0, width, height);
  pop();

  softTitle('대학에서', '살아남기');

  fancyButton(600, 500, 300, 80, '시작');
  fancyButton(600, 620, 300, 80, '설명');
}

// 대학교 선택 화면
function drawUniversityScreen() {
  background(250);

  // 외곽 패널 (기존 큰 박스 위치/크기 동일)
  panel(300, 250, 1000, 700, 18);

  // 제목
  push();
  fill(0);
  textSize(100);
  text('대학교 선택', 530, 150);
  pop();

  // 목록(클릭 영역 동일: x=400, width=universitysWidth, height=universitysHeight)
  strokeWeight(3);
  for (let i = 0; i < universitys.length; i++) {
    const boxX = 400;
    const boxY = i * 50 + 333 + 10 * i;
    const bw = universitysWidth;
    const bh = universitysHeight;

    const hover = inRect(mouseX, mouseY, boxX, boxY, bw, bh);

    // 항목 배경 + 호버
    push();
    shadowRect(boxX, boxY, bw, bh, 10, hover ? 40 : 20, hover ? 8 : 6);
    stroke(200);
    strokeWeight(2);
    fill(hover ? 255 : 245);
    rect(boxX, boxY, bw, bh, 10);

    // 왼쪽 인디케이터 바
    noStroke();
    fill(26, 58, 92, hover ? 220 : 140);
    rect(boxX, boxY, 6, bh, 10);

    // 텍스트
    fill(0);
    textSize(20);
    text(universitys[i], boxX + 20, boxY + bh / 2 + 7);
    pop();
  }

  // 선택된 대학교의 학과 패널(시각 강화, 클릭 영역은 그대로 departmentsBoxX/Y/Width/Height 사용)
  if (university !== -1) {
    // 강조 패널(기존 drawDepartment 내용과 겹치지 않게 배경만)
    const px = 420;
    const py = 360;
    const pw = 600;
    const ph = 450;
    panel(px, py, pw, ph, 16);

    // 상단 학교명 태그
    push();
    noStroke();
    fill(26, 58, 92);
    rect(px + 18, py + 18, 180, 36, 8);
    fill(255);
    textSize(20);
    textAlign(LEFT, CENTER);
    text(universitys[university], px + 28, py + 36);
    pop();

    // 학과 리스트(클릭되는 실제 박스는 아래 drawDepartment에서 그대로 그림)
  }

  // 기존 학과 그리기 호출(클릭 좌표를 유지하려면 이걸 건드리면 안 됨)
  drawDepartment();
}

// 학과 패널(클릭 박스 좌표/크기 그대로, 시각만 보강)
function drawDepartment() {
  if (university !== -1) {
    for (let i = 0; i < universitys.length; i++) {
      // 배경 패널(기존 좌표 근처에 덮어 그리되, 클릭 박스는 아래 그대로)
      push();
      fill(255, 255, 150, 30);
      stroke(0, 30);
      strokeWeight(2);
      rect(420, i * 50 + 360 + 10 * i, 600, 450, 16);
      pop();

      // 타이틀
      push();
      noStroke();
      fill(0);
      textSize(50);
      text(universitys[university], 620, i * 50 + 420 + 10 * i);
      pop();

      // 실제 클릭 박스(좌표/크기/텍스트 원본과 완전 동일)
      for (let j = 0; j < departments.length; j++) {
        const x = departmentsBoxX;
        const y = departmentsBoxY + departmentHeight * j + 10 * 1;
        const w = departmentWidth;
        const h = departmentHeight;
        const hover = inRect(mouseX, mouseY, x, y, w, h);

        push();
        stroke(0);
        strokeWeight(1);
        fill(hover ? 255 : 255);
        rect(x, y, w, h, 10);

        // 호버 강조선
        if (hover) {
          stroke(26, 58, 92);
          strokeWeight(2);
          noFill();
          rect(x, y, w, h, 10);
        }

        noStroke();
        fill(0);
        textSize(30);
        text(departments[j], x + 15, departmentsBoxY + 40 + j * 50);
        pop();
      }
    }
  }
}
//----------------------------추가------------------------------
// 클리어 화면(클릭 버튼 좌표/크기 동일)
function drawClearScreen() {
  background(255);

  if (clearStartFrame === 0) {
    clearStartFrame = frameCount;
  }

  let imgW = 800;
  let imgX = (width - imgW) / 2;

  let alphaValue = map(frameCount - clearStartFrame, 0, 180, 0, 255, true);

  push();
  tint(255, alphaValue);
  image(ssuGameClearImg, imgX, 0, imgW, height);
  push();
  tint(255, alphaValue);
  image(ssuGameClearImg, imgX, 0, imgW, height);
  pop();

  // 학과 + 학점도 졸업장과 같이 페이드 인
  push();
  fill(20, alphaValue);
  stroke(0, alphaValue);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  // 학과
  textSize(38);
  text(departments[0], width / 2 - 170, height / 2 - 70);

  // 학점: 왼쪽으로 이동
  fill(180, 0, 0, alphaValue);
  stroke(80, 0, 0, alphaValue);
  strokeWeight(3);
  textSize(58);
  text(nowSchoolScore, width / 2 + 70, height / 2 - 70);

  pop();
  pop();

  // 졸업장이 다 보인 뒤 버튼 등장
  if (alphaValue >= 250) {
    let btnW = 280;
    let btnH = 70;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - 120;

    push();

    fill(0, 80);
    noStroke();
    rect(btnX + 4, btnY + 4, btnW, btnH, 15);

    fill(255, 255, 255, 230);
    stroke(60);
    strokeWeight(2);
    rect(btnX, btnY, btnW, btnH, 15);

    fill(40);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text('다시 플레이', btnX + btnW / 2, btnY + btnH / 2);

    pop();
  }
}
//--------------------------------------------------------------------------

//게임오버
function drawGameOverScreen() {
  // 어두운 배경 + 약한 비네팅
  background(0);
  push();
  noStroke();
  for (let i = 0; i < width; i += 20) {
    const a = map(abs(i - width / 2), 0, width / 2, 0, 120);
    fill(0, 0, 0, a);
    rect(i, 0, 20, height);
  }
  pop();

  push();
  fill(255, 0, 0);
  textSize(120);
  textAlign(CENTER, CENTER);
  text('GAME OVER', width / 2, height / 2 - 100);

  textSize(50);
  fill(255);
  text('F, 재수강 대상입니다', width / 2, height / 2 + 50);
  pop();

  // 버튼(위치/크기 유지)
  shadowRect(width / 2 - 150, height / 2 + 150, 300, 100, 20, 45, 10);
  const hover = inRect(
    mouseX,
    mouseY,
    width / 2 - 150,
    height / 2 + 150,
    300,
    100,
  );
  push();
  fill(hover ? 255 : 255);
  stroke(0);
  strokeWeight(5);
  rect(width / 2 - 150, height / 2 + 150, 300, 100, 20);

  fill(0);
  noStroke();
  textSize(45);
  textAlign(CENTER, CENTER); // ★ 이 부분이 빠져서 글자가 밀렸던 것입니다!
  text('다시 도전하기', width / 2, height / 2 + 200);
  pop();
}

//------------------------추가--------------------------------
function drawMilitaryClearScreen() {
  background(255);

  if (clearStartFrame === 0) {
    clearStartFrame = frameCount;
  }

  let imgW = 800;
  let imgX = (width - imgW) / 2;

  let alphaValue = map(frameCount - clearStartFrame, 0, 180, 0, 255, true);

  push();
  tint(255, alphaValue);
  image(militaryLeaveClearImg, imgX, 0, imgW, height);
  pop();

  if (alphaValue >= 250) {
    let btnW = 280;
    let btnH = 70;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - 120;

    push();

    fill(0, 80);
    noStroke();
    rect(btnX + 4, btnY + 4, btnW, btnH, 15);

    fill(255, 255, 255, 230);
    stroke(60);
    strokeWeight(2);
    rect(btnX, btnY, btnW, btnH, 15);

    fill(40);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(32);
    text('다시 플레이', btnX + btnW / 2, btnY + btnH / 2);

    pop();
  }
}
//-------------------------------------------------------------------------
