let floorImg;
let atBackgroundImg;
let downBackgroundImg;
let bossZoneFloorImg;
let bossZoneBackgroundImg; 
let bossZoneDowngroundImg;
let militaryGroundImg;
let militaryBackgroundImg;
let militaryDownBackgroundImg;
let militaryNoticeImg;
let militaryAssistantImg;
let ssuUnivesityBackgroundImg;
let ssuFloorImg;
let ssuGameClearImg;
let longObjectImg;
let shortObjectImg;
//----------------------추가--------
let startBgImgs = [];
let militaryLeaveClearImg;
//-------------------------------
function preloadBackground() {
  floorImg = loadImage('배경 오브젝트/floor.png');
  atBackgroundImg = loadImage('배경 오브젝트/at_background.png');
  // 시작화면 배경 3장 추가
  startBgImgs[0] = loadImage('배경 오브젝트/처음화면1.png');
  startBgImgs[1] = loadImage('배경 오브젝트/처음화면2.png');
  startBgImgs[2] = loadImage('배경 오브젝트/처음화면3.png');
  downBackgroundImg = loadImage('배경 오브젝트/down_background.png');
  bossZoneFloorImg = loadImage('배경 오브젝트/bosszone_floor.png');
  bossZoneBackgroundImg = loadImage('배경 오브젝트/bossZoneBackgroundImg.png');
  bossZoneDowngroundImg = loadImage('배경 오브젝트/bossZoneDownground.png');
  militaryBackgroundImg = loadImage('배경 오브젝트/군대 배경.png');
  militaryGroundImg = loadImage('배경 오브젝트/군대 바닥.png');
  militaryNoticeImg = loadImage('배경 오브젝트/입영통지서.png');
  militaryDownBackgroundImg = loadImage('배경 오브젝트/군대 밑바닥.png');
  militaryAssistantImg = loadImage('배경 오브젝트/조교.png');
  ssuUnivesityBackgroundImg = loadImage('배경 오브젝트/숭실대 배경.png');
  ssuFloorImg = loadImage('배경 오브젝트/숭실대 바닥.png');
  //-------------수정-----------------------------------
  portalImg = loadImage('배경 오브젝트/포탈.png');
  ssuGameClearImg = loadImage('배경 오브젝트/숭실대 졸업장.png');
  longObjectImg = loadImage('배경 오브젝트/옵젝 2.png');
  shortObjectImg = loadImage('배경 오브젝트/옵젝3.png');
  militaryLeaveClearImg = loadImage('배경 오브젝트/휴학통지서.png');
  //-----------------------------------------------------
}

function drawStartBackground() {
  let changeTime = 240; // 4초마다 다음 사진
  let fadeTime = 90; // 1.5초 동안 서서히 전환

  let currentIndex = Math.floor(frameCount / changeTime) % startBgImgs.length;
  let nextIndex = (currentIndex + 1) % startBgImgs.length;

  let t = frameCount % changeTime;
  let alphaValue = 0;

  if (t > changeTime - fadeTime) {
    alphaValue = map(t, changeTime - fadeTime, changeTime, 0, 255);
  }

  drawFullScreenImage(startBgImgs[currentIndex]);

  push();
  tint(255, alphaValue);
  drawFullScreenImage(startBgImgs[nextIndex]);
  pop();
}

function drawFullScreenImage(img) {
  if (!img) return;

  let imgRatio = img.width / img.height;
  let canvasRatio = width / height;

  if (imgRatio > canvasRatio) {
    let newHeight = height;
    let newWidth = height * imgRatio;
    image(img, (width - newWidth) / 2, 0, newWidth, newHeight);
  } else {
    let newWidth = width;
    let newHeight = width / imgRatio;
    image(img, 0, (height - newHeight) / 2, newWidth, newHeight);
  }
}
//------------------수정---------------------------------
function BackgroundObjectiveDrawing() {
  if (gameState === 'ssu_stage1') {
    drawObjectImages(
      longObjectsX,
      longObjectsY,
      longObjectImg,
      longObjectWidth,
      longObjectHeight,
    );

    drawObjectImages(
      shortObjectsX,
      shortObjectsY,
      shortObjectImg,
      shortObjectWidth,
      shortObjectHeight,
    );
  }

  if (gameState === 'ssu_stage3' && playerX >= final_bossground_X) {
    drawObjectImages(
      final_longObjectsX,
      final_longObjectsY,
      longObjectImg,
      longObjectWidth,
      longObjectHeight,
    );

    drawObjectImages(
      final_shortObjectsX,
      final_shortObjectsY,
      shortObjectImg,
      shortObjectWidth,
      shortObjectHeight,
      true,
    );
  }
}

function drawObjectImages(xArray, yArray, img, objW, objH, isCenter = false) {
  for (let i = 0; i < xArray.length; i++) {
    push();

    if (isCenter) {
      imageMode(CENTER);
      image(img, xArray[i], yArray[i], objW, objH);
    } else {
      imageMode(CORNER);
      image(img, xArray[i], yArray[i], objW, objH);
    }

    pop();
  }
}
//---------------------------------------------------------------------

function drawEnvironment() {
  image(floorImg, -1000, GROUND_Y, MAP_WIDTH, 200);
  image(downBackgroundImg, -1000, GROUND_Y + 200, MAP_WIDTH, height);

  //보스지역 땅
  image(
    bossZoneFloorImg,
    bossground_X,
    bossground_Y,
    bossZoneFloorWidth,
    bossZoneFloorHeight,
  );
  image(
    bossZoneDowngroundImg,
    bossground_X,
    bossground_Y + bossZoneFloorHeight,
    bossZoneFloorWidth,
    height,
  );
}

function atBackgroundDrawing() {
  image(atBackgroundImg, 0, 0, width, 800);

  let bgRatio = atBackgroundImg.width / atBackgroundImg.height;
  let canvasRatio = width / height;

  if (bgRatio > canvasRatio) {
    let newHeight = height;
    let newWidth = height * bgRatio;

    image(atBackgroundImg, (width - newWidth) / 2, 0, newWidth, newHeight);
  } else {
    let newWidth = width;
    let newHeight = width / bgRatio;

    image(atBackgroundImg, 0, (height - newHeight) / 2, newWidth, newHeight);
  }
}

function bossZoneBackgroundDrawing() {
  image(bossZoneBackgroundImg, 0, 0, width, 800);

  let bgRatio = bossZoneBackgroundImg.width / bossZoneBackgroundImg.height;
  let canvasRatio = width / height;

  if (bgRatio > canvasRatio) {
    let newHeight = height;
    let newWidth = height * bgRatio;

    image(
      bossZoneBackgroundImg,
      (width - newWidth) / 2,
      0,
      newWidth,
      newHeight,
    );
  } else {
    let newWidth = width;
    let newHeight = width / bgRatio;

    image(
      bossZoneBackgroundImg,
      0,
      (height - newHeight) / 2,
      newWidth,
      newHeight,
    );
  }
}

function stage2DrawEnvironment() {
  militaryBackgroundDrawing();
  image(militaryDownBackgroundImg, 0, GROUND_Y + 200, width, height);

  image(militaryGroundImg, 0, GROUND_Y, width, 200);
}

function militaryBackgroundDrawing() {
  let targetHeight = GROUND_Y + 15;
  let bgRatio = militaryBackgroundImg.width / militaryBackgroundImg.height;
  let targetRatio = width / targetHeight;

  if (bgRatio > targetRatio) {
    let newHeight = targetHeight;
    let newWidth = targetHeight * bgRatio;

    image(
      militaryBackgroundImg,
      (width - newWidth) / 2,
      0,
      newWidth,
      newHeight,
    );
  } else {
    let newWidth = width;
    let newHeight = width / bgRatio;

    image(
      militaryBackgroundImg,
      0,
      targetHeight - newHeight,
      newWidth,
      newHeight,
    );
  }
}

function stage3DrawEnvironment() {
  // 배열을 순회하며 너비 100으로 숭실대 바닥 그리기
  for (let i = 0; i < stage3FloorsX.length; i++) {
    // 바닥의 높이는 기존과 동일하게 200으로 설정했습니다.
    image(ssuFloorImg, stage3FloorsX[i], GROUND_Y + 50, 200, 200);
  }
}

function ssuUnivesityBackground() {
  image(ssuUnivesityBackgroundImg, 0, 0, width, 800);

  let bgRatio =
    ssuUnivesityBackgroundImg.width / ssuUnivesityBackgroundImg.height;
  let canvasRatio = width / height;

  if (bgRatio > canvasRatio) {
    let newHeight = height;
    let newWidth = height * bgRatio;

    image(
      ssuUnivesityBackgroundImg,
      (width - newWidth) / 2,
      0,
      newWidth,
      newHeight,
    );
  } else {
    let newWidth = width;
    let newHeight = width / bgRatio;

    image(
      ssuUnivesityBackgroundImg,
      0,
      (height - newHeight) / 2,
      newWidth,
      newHeight,
    );
  }
}
