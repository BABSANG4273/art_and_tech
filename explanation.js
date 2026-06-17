function explanation() {
  explanationbar();
  explanation_data();
  exBackButton();
}

function explanationbar() {
  push();
  fill(255);
  stroke(0);
  strokeWeight(4); // 테두리를 조금 더 선명하게
  // 박스를 화면 정중앙에 배치하기 위한 X, Y 계산
  let boxX = width / 2 - 450;
  let boxY = height / 2 - 300;
  rect(boxX, boxY, 900, 600);
  pop();
}

let data =
  '형식 : 2D 플랫포머 횡스크롤 액션 게임\n\n' +
  '소개 : 대학생이 교수(보스몹)들을 상대하며\n' +
  '단계를 클리어하는 게임.\n' +
  '캐릭터(대학생)의 스킨(과잠)과 교수 등이\n' +
  '학교와 학과 특징에 맞게 변경됨.\n\n' +
  '오른쪽 움직임 : D키\n' +
  '왼쪽 움직임 : A키\n' +
  '점프 : SPACEBAR\n' +
  '스킬 : Q / E / R(궁극기) / L(기본공격)\n\n' +
  'HP : 학점(A → B → C → D → F)';

function explanation_data() {
  push();
  fill(0);
  noStroke();
  textSize(30);
  textAlign(LEFT, TOP);
  text(data, width / 2 - 400, height / 2 - 250);
  pop();
}

function exBackButton() {
  push();
  fill(255);
  stroke(0);
  strokeWeight(2);
  // 박스 우측 하단에 버튼 배치
  let btnX = width / 2 + 150;
  let btnY = height / 2 + 150;
  rect(btnX, btnY, 200, 80);

  fill(0);
  noStroke();
  textSize(40);
  textAlign(CENTER, CENTER);
  // 버튼 중앙에 글자 배치
  text('뒤로', btnX + 100, btnY + 40);
  pop();
}