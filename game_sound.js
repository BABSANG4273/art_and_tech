// 1스테이지 BGM
function playStage1Bgm() {
  userStartAudio(); 
  if (currentBgm === 'stage1') return;
  stopAllBgm();
  stage1Bgm.setVolume(0.35);
  stage1Bgm.loop();
  currentBgm = 'stage1';
}

// 1스테이지 보스전 BGM
function playAtBossBgm() {
  if (currentBgm === 'atBoss') return;
  stopAllBgm();
  atBossBgm.setVolume(0.45);
  atBossBgm.loop();
  currentBgm = 'atBoss';
}

// 2스테이지 BGM
function playStage2Bgm() {
  if (currentBgm === 'stage2') return;
  stopAllBgm();
  stage2Bgm.setVolume(0.35);
  stage2Bgm.loop();
  currentBgm = 'stage2';
}

// 3스테이지 BGM
function playStage3Bgm() {
  if (currentBgm === 'stage3') return;
  stopAllBgm();
  stage3Bgm.setVolume(0.35);
  stage3Bgm.loop();
  currentBgm = 'stage3';
}

// 3스테이지 보스전 BGM
function playFinalBossBgm() {
  if (currentBgm === 'finalBoss') return;
  stopAllBgm();
  finalBossBgm.setVolume(0.45);
  finalBossBgm.loop();
  currentBgm = 'finalBoss';
}

// 모든 BGM 정지 함수
function stopAllBgm() {
  if (stage1Bgm && stage1Bgm.isPlaying()) stage1Bgm.stop();
  if (atBossBgm && atBossBgm.isPlaying()) atBossBgm.stop();
  if (stage2Bgm && stage2Bgm.isPlaying()) stage2Bgm.stop();
  if (stage3Bgm && stage3Bgm.isPlaying()) stage3Bgm.stop();
  if (finalBossBgm && finalBossBgm.isPlaying()) finalBossBgm.stop();
}

// 포탈 소리
function playPortalSound() {
  if (!portalSound) return;
  portalSound.setVolume(0.8);
  portalSound.play();
}

//맞는 소리
let lastHitSoundTime = 0;
function playHitSound() {
  if (!hitSound) return;
  if (millis() - lastHitSoundTime > 500) {
    hitSound.setVolume(1.0); // 볼륨 조절 (0.0 ~ 1.0)
    hitSound.play();
    lastHitSoundTime = millis();
  }
}

// ★ 여기서 준비하신 mp3 파일 이름을 정확히 맞춰주세요!
function preloadSound() {
  stage1Bgm = loadSound('sound/ssu_stage1_bgm.mp3');
  atBossBgm = loadSound('sound/at_boss_bgm.mp3');
  stage2Bgm = loadSound('sound/ssu_stage2_bgm.mp3');
  stage3Bgm = loadSound('sound/ssu_stage1_bgm.mp3'); 
  finalBossBgm = loadSound('sound/at_boss_bgm.mp3'); 

  qSkillSound = loadSound('sound/skill_Q_sound.mp3');
  eSkillSound = loadSound('sound/skill_E_sound.mp3');
  portalSound = loadSound('sound/portal_sound.mp3');
  lSkillSound = loadSound('sound/skill_L_sound.mp3');
  
}