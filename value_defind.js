let gameState;

let universitysWidth;
let universitysHeight;
let university;
let universitys = ['숭실대'];

let departments = ['글로벌미디어학부'];
let departmentsBoxX;
let departmentsBoxY;
let departmentWidth;
let departmentHeight;

const MAP_WIDTH = 3800;
const FINAL_MAP_WIDTH = 6000; 
const BOSS_START_X = 3000;
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;
const GROUND_Y = 600;
const FINAL_BOSS_START_X = 2000;

let playerX;
let playerY;
let playerSpeed;
let playerWidth;
let playerHeight;
let playerVelocityY;
let playerGravity;
let playerJumpPower;
let playerIsJumping;

let zoomLevel;

let playerHp;
let nowSchoolScore;
let lastHitTime;

let hitboxShiftX;
let hitboxShiftY;
let hitboxWidth;
let hitboxHeight;

let longObjectsX = [];
let longObjectsY = [];
let longObjectWidth;
let longObjectHeight;

let shortObjectsX = [];
let shortObjectsY = [];
let shortObjectWidth;
let shortObjectHeight;

let bossground_X;
let bossground_Y;
let bossZoneFloorWidth;
let bossZoneFloorHeight;

let gicheolX;
let gicheolY;
let gicheolWidth;
let gicheolHeight;
let gicheolHp;

let kyungsuX;
let kyungsuY;
let kyungsuWidth;
let kyungsuHeight;
let kyungsuHp;

let fallingObjects = [];
let fallingObjectWidth;
let fallingObjectHeight;
let fallingObjectSpeed;
let fallingObjectInterval;
let stage2StartTime;
let stage2ClearTime;

let final_bossground_X;
let final_bossground_Y;
let stage3FloorsX = [];
let final_bossZoneFloorWidth;
let final_playX_constrain;
let isFinalBossZoneEntered;

let finalBossX;
let finalBossY;
let finalBossWidth;
let finalBossHeight;
let finalBossHp;

let final_longObjectsX = [];
let final_longObjectsY = [];
let final_shortObjectsX = [];
let final_shortObjectsY = [];

let stagePortalsX = [];
let stagePortalsY = [];
let stagePortalWidth;
let stagePortalHeight;

let clearStartFrame;

let isRSkillActive = false;
let rSkillTimer = 0;
let rSkillUsedStage1 = false;
let rSkillUsedStage3 = false;

// ==========================================
// ★ BGM 및 사운드 변수 (중복 없이 한 곳에 모음!)
// ==========================================
let stage1Bgm;
let atBossBgm;
let stage2Bgm;
let stage3Bgm; 
let finalBossBgm;
let currentBgm = ''; 

let qSkillSound;
let eSkillSound;
let lSkillSound;
let portalSound;

let screenShake = 0;
let qImpactEffect = null;
let lastBlockSoundTime = 0;
let isPortalTransitioning = false;

// ==========================================

let mobX = [];
let mobY = [];
let mobHP = [];
let mobAlive = [];

let mobWidth;
let mobHeight;
let mobSpeed;
let mobDamageTime;

let cppMobBasicImgs = [];
let cppMobAttackImgs = [];
let cppMobChangeImgs = [];
let cppMobX = [];
let cppMobY = [];
let cppMobHP = [];
let cppMobAlive = [];
let cppMobState = [];
let cppMobTimer = [];
let cppMobLastAttackTime = [];
let cppMobWidth = 150;
let cppMobHeight = 140;
let cppMobSpeed = 1.5;
let cppMobDamage = 1;

let jsMobBasicImgs = [];
let jsMobAttackImgs = [];
let jsMobX = [];
let jsMobY = [];
let jsMobHP = [];
let jsMobAlive = [];
let jsMobState = [];
let jsMobTimer = [];
let jsMobLastAttackTime = [];
let jsMobDirection = [];
let jsMobWidth = 170;
let jsMobHeight = 170;
let jsMobSpeed = 1.4;
let jsMobDamage = 1;

let finalBossProjImg;
let finalBossProjectiles = [];
let isFinalBossSkill1Active = false;
let finalBossSkill1Timer = 0;
let finalBossSkill1Count = 0;

let laserBeam = null;
let laserEmitterImg;

let laserMovingImg;
let laserArrivedImg;

function valueDefind() {
  gameState = 'start';
  universitysWidth = 700;
  universitysHeight = 50;
  university = -1;
  departmentsBoxX = 450;
  departmentsBoxY = 430;
  departmentWidth = 400;
  departmentHeight = 50;
  playerX = 100;
  playerSpeed = 5;
  playerWidth = 90;
  playerHeight = 130;
  playerVelocityY = 0;
  playerGravity = 0.6;
  playerJumpPower = -15;
  playerIsJumping = false;
  zoomLevel = 1;
  playerY = GROUND_Y + 70 - playerHeight;

  hitboxShiftX = 18; 
  hitboxShiftY = 3; 
  hitboxWidth = 60; 
  hitboxHeight = 130; 

  longObjectWidth = 400;
  longObjectHeight = 50;
  shortObjectWidth = 200;
  shortObjectHeight = 30;

  longObjectsX = [800, 1400];
  longObjectsY = [GROUND_Y + 70 - playerHeight - 15, GROUND_Y + 70 - playerHeight];
  shortObjectsX = [1900, 2200, 2500];
  shortObjectsY = [GROUND_Y + 70 - playerHeight - 80, GROUND_Y + 70 - playerHeight - 150, GROUND_Y + 70 - playerHeight - 220];

  bossground_X = 2800;
  bossground_Y = GROUND_Y + 70 - playerHeight - 250;
  bossZoneFloorWidth = 2000;
  bossZoneFloorHeight = 200;
  
  gicheolX = bossground_X + bossZoneFloorWidth / 2;
  gicheolY = bossground_Y - 400 + 90;
  gicheolWidth = 200;
  gicheolHeight = 400;
  gicheolMaxHp = 250;
  gicheolHp = 250;
  
  kyungsuX = bossground_X + bossZoneFloorWidth / 2 + 300;
  kyungsuY = bossground_Y - 250 + 90;
  kyungsuWidth = 250;
  kyungsuHeight = 250;
  kyungsuMaxHp = 250;
  kyungsuHp = 250;
  
  playerHp = 5;
  nowSchoolScore = 'A+';
  lastHitTime = 0;
  
  fallingObjects = [];
  fallingObjectWidth = 80;
  fallingObjectHeight = 110;
  fallingObjectSpeed = 10;
  fallingObjectInterval = 40;
  stage2StartTime = 0;
  stage2ClearTime = 18 * 1000;

  final_bossground_X = 1800; 
  final_bossground_Y = GROUND_Y + 70 - playerHeight;
  final_bossZoneFloorWidth = 1800; 

  stage3FloorsX = [];
  for (let x = -1000; x <= FINAL_MAP_WIDTH; x += 200) {
    stage3FloorsX.push(x);
  }

  isFinalBossZoneEntered = false;
  final_playX_constrain = final_bossground_X + final_bossZoneFloorWidth;
  
  finalBossWidth = 150;
  finalBossHeight = 350;
  finalBossX = final_playX_constrain - finalBossWidth - 50; 
  finalBossY = bossground_Y + 40;

  finalBossHp = 300;
  finalBossMaxHp = 300;

  finalBossProjectiles = [];
  isFinalBossSkill1Active = false;

  // ==========================================
  // 보스방 안쪽 구조물 널찍하고 낮게 세팅
  // ==========================================
  
  const baseY = GROUND_Y + 70 - playerHeight;
  const startX = final_bossground_X + 100; // 왼쪽 여백

  longObjectWidth = 400;
  shortObjectWidth = 200;
  
  // ★ 가로 간격(Gap)을 130으로 대폭 넓혀서 시원하게 퍼지게 만듦
  const gap = 130; 

  final_shortObjectsX = [];
  final_shortObjectsY = [];
  final_longObjectsX = [];
  final_longObjectsY = [];

  // [1층] 짧은 발판 3개 (높이 아주 낮게: -40)
  for(let i=0; i<3; i++) {
    final_shortObjectsX.push(startX + i * (shortObjectWidth + gap));
    final_shortObjectsY.push(baseY - 40);
  }

  // [2층] 긴 발판 2개 (높이: -220)
  // 첫 번째 발판
  final_longObjectsX.push(startX + 100);
  final_longObjectsY.push(baseY - 220);
  // 두 번째 발판 (첫 번째 발판 위치 + 발판 길이 + 간격)
  final_longObjectsX.push(startX + 100 + longObjectWidth + gap);
  final_longObjectsY.push(baseY - 220);

  // [3층] 짧은 발판 3개 (높이: -380, 전체적으로 우측으로 쉬프트)
  for(let i=0; i<3; i++) {
    final_shortObjectsX.push(startX + 200 + i * (shortObjectWidth + gap));
    final_shortObjectsY.push(baseY - 380);
  }

  // [4층] 긴 발판 2개 (최고층 높이: -550 -> 점프 닿게 수정됨!)
  // 첫 번째 발판
  final_longObjectsX.push(startX + -40);
  final_longObjectsY.push(baseY - 550);
  // 두 번째 발판 (첫 번째 발판 위치 + 발판 길이 + 간격)
  final_longObjectsX.push(startX + -40 + longObjectWidth + gap);
  final_longObjectsY.push(baseY - 550);
  
  // ==========================================
  
  stagePortalsX = [4400, 500];
  stagePortalsY = [20, 200];
  stagePortalWidth = 300;
  stagePortalHeight = 500;

  clearStartFrame = 0;
  isPortalTransitioning = false;

  mobWidth = 50;
  mobHeight = 60;
  mobSpeed = 1.5;
  mobDamageTime = 0;

  cppMobX = [];
  cppMobY = [];
  cppMobHP = [];
  cppMobAlive = [];
  cppMobState = [];
  cppMobTimer = [];
  cppMobLastAttackTime = [];
  cppMobWidth = 150;
  cppMobHeight = 140;
  cppMobSpeed = 1.5;
  cppMobDamage = 1;

  jsMobX = [];
  jsMobY = [];
  jsMobHP = [];
  jsMobAlive = [];
  jsMobState = [];
  jsMobTimer = [];
  jsMobLastAttackTime = [];
  jsMobDirection = [];
  jsMobWidth = 170;
  jsMobHeight = 170;
  jsMobSpeed = 1.4;
  jsMobDamage = 1;

  // 1. 플레이어 상태 및 스킬 초기화
  isStage1BossZoneEntered = false;
  playerDirection = 'right';
  skillTF = [1, 1, 1, 1];
  skillCooldown = [0, 0, 0, 0];
  lSkillsX = []; lSkillsY = []; lSkillsDir = []; lSkillsAngle = [];
  activeQSkill = null;
  activeESkill = null;
  qImpactEffect = null;
  screenShake = 0;

  // 2. 정기철 교수님 스킬 및 상태 초기화
  gcSkill1Phase = 0;
  gcSkill2Phase = 0;
  gicheolLastTeleport = 0;
  gicheolPosIdx = 1;

  // 3. 오경수 교수님 스킬 및 상태 초기화
  ksSkill1Phase = 0;
  ksProjectiles = [];
  ksMobs = [];

  // 4. 최종 보스 스킬 및 상태 초기화
  laserBeam = null;
  lastSkill6Time = 0;
  cameraSkill = null;
  
  //궁
  isRSkillActive = false; // R스킬 켜져있는지 여부
  rSkillTimer = 0;        // 5초 지속시간 타이머
  rSkillUsedStage1 = false; // 1스테이지 사용 여부
  rSkillUsedStage3 = false; // 3스테이지 사용 여부
}