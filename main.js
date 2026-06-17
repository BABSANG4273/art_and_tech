function setup() {
  // 모니터/창 크기에 딱 맞게 캔버스 생성 (제일 처음 보내주신 원본 방식)
  createCanvas(windowWidth, windowHeight);
  valueDefind();
  setupPlayer();
}

function windowResized() {
  // 창 크기가 변경되면 캔버스도 실시간으로 딱 맞게 조절
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  if (gameState === 'start') {
    drawStartScreen();
  } else if (gameState === 'explanation') {
    explanation();
  } else if (gameState === 'university') {
    drawUniversityScreen();
  } else if (gameState === 'ssu_stage1') {
    ssuStage1();
  } else if (gameState === 'ssu_stage2') {
    ssuStage2();
  } else if (gameState === 'ssu_stage3') {
    ssuStage3();
  } else if (gameState === 'clear') {
    drawClearScreen();
  } else if (gameState === 'military_over') {
    drawMilitaryClearScreen();
  } else if (gameState === 'gameover') {
    drawGameOverScreen();
  }

  drawDepartment();
}

function mousePressed() {
  if (gameState === 'start') {
    if (mouseX > 600 && mouseX < 900 && mouseY > 500 && mouseY < 580) {
      gameState = 'university';
    } else if (mouseX > 600 && mouseX < 900 && mouseY > 620 && mouseY < 700) {
      gameState = 'explanation';
    }
  }

  if (gameState === 'explanation') {
    let btnX = width / 2 + 150;
    let btnY = height / 2 + 150;

    if (mouseX > btnX && mouseX < btnX + 200 && mouseY > btnY && mouseY < btnY + 80) {
      gameState = 'start';
    }
  }

  if (gameState === 'university') {
    for (let i = 0; i < universitys.length; i++) {
      let boxX = 400;
      let boxY = i * 50 + 333 + 10 * i;
      if (mouseX > boxX && mouseX < boxX + universitysWidth && mouseY > boxY && mouseY < boxY + universitysHeight) {
        university = i;
      }
    }

    for (let i = 0; i < departments.length; i++) {
      let boxY = departmentsBoxY + departmentHeight * i + 10 * i;
      if (mouseX > departmentsBoxX && mouseX < departmentsBoxX + departmentWidth && mouseY > boxY && mouseY < boxY + departmentHeight) {
        university = -1;
        gameState = 'ssu_stage1';
        setupCppMobs();
        setupJsMobs();
        playStage1Bgm();
      }
    }
  }

  if (gameState === 'clear') {
    let btnW = 280;
    let btnH = 70;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - 120;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      valueDefind();
      gameState = 'start';
    }
  }

  if (gameState === 'military_over') {
    let btnW = 280;
    let btnH = 70;
    let btnX = width / 2 - btnW / 2;
    let btnY = height - 120;

    if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
      stopAllBgm();
      currentBgm = '';
      valueDefind();
      gameState = 'start';
    }
  }

  if (gameState === 'gameover') {
    if (mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 + 150 && mouseY < height / 2 + 250) {
      stopAllBgm();
      currentBgm = '';
      valueDefind(); 
      gameState = 'start'; 
    }
  }
}

function preload() {
  preloadBackground();
  preloadPlayer();
  preloadSound();
  preloadMobs();
}

//창크기 변경 방지
window.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

window.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.key === '=' || e.key === '-' || e.key === '+')) {
    e.preventDefault();
  }
});