function hpDrawing() {
  for (let i = 0; i < 5; i++) {
    stroke(0);
    strokeWeight(3);

    if (i < playerHp) {
      fill(255, 0, 0);
    } else {
      noFill();
    }
    rect(100 * i + 100, 50, 100, 50);
  }
}

function schoolScoresDrawing() {
  push();
  fill(0);
  stroke(0);
  strokeWeight(1);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(nowSchoolScore, 50, 75);
  pop();
}

function updateSchoolScore() {
  if (playerHp === 5) nowSchoolScore = 'A+';
  else if (playerHp === 4) nowSchoolScore = 'A0';
  else if (playerHp === 3) nowSchoolScore = 'B+';
  else if (playerHp === 2) nowSchoolScore = 'C+';
  else if (playerHp <= 1) nowSchoolScore = 'D+';
}
