mp=null;
function mainPanelStart(){
  const canvas = document.getElementById("mainPanel");
  const ctx = canvas.getContext("2d");
  mp = new MainPanel(canvas,ctx);
  gameready(0);
}
function MainPanel(canvas,ctx){
  this.canvas = canvas;
  this.ctx = ctx;
  return this;
}
function gameready(int){
  mp.ctx.beginPath();
  mp.ctx.clearRect(0,0,mp.canvas.width,mp.canvas.height);
  mp.ctx.font = "40px 'ＭＳ ゴシック'";
	mp.ctx.textBaseline = "middle";
	mp.ctx.textAlign = "center";
  mp.ctx.fillStyle = "white";
	mp.ctx.fillText("Block Breaking", mp.canvas.width/2, mp.canvas.height/2);
  mp.ctx.closePath();
  document.getElementById("method").style.display = "";
  document.getElementById("start").style.display = "";
  document.getElementById("res").style.display = "none";
  document.getElementById("restart").style.display = "none";
  store();
  if(int == 1){
    gameStart();
  }
}
function store(){
  for(let i = 0;i < BLOCK_COLUMN_COUNT*BLOCK_ROW_COUNT;i++){
    let x = Math.floor(i/BLOCK_ROW_COUNT)+1;
    for(let j = 0;j < BLOCK_ROW_COUNT;j++){
      blockArrayX[i] = (x)*BLOCK_MARGIN+(x-1)*BLOCK_WIDTH;
      if(j == 2){
        continue;
      }
      i++;
    }
  }
  let yCount = 0;
  for(let l = 0;l < BLOCK_COLUMN_COUNT;l++){
    for(let n = 0;n < BLOCK_ROW_COUNT;n++){
      blockArrayY[yCount] = (n+1)*BLOCK_MARGIN+n*BLOCK_HEIGHT;
      yCount++;
    }
  }
  for(let p=0;p < BLOCK_COLUMN_COUNT*BLOCK_ROW_COUNT;p++){
    blockArray[p] = [blockArrayX[p],blockArrayY[p]];
  }
}
let canvas_width;
let canvas_height;
function displayNone(){
  document.getElementById("method").style.display = "none";
  document.getElementById("start").style.display = "none";
  document.getElementById("res").style.display = "none";
  document.getElementById("restart").style.display = "none";
  mp.ctx.clearRect(0,0,mp.canvas.width,mp.canvas.height);
  canvas_width = mp.canvas.width;
  canvas_height = mp.canvas.height;
}
let level = 7;
//about ball
const BALL_COLOR = "skyblue";
const BALL_RADIUS = 10;
let ballX;
let ballY;
let xMove = 1;
let yMove = -1;
//about bar
const BAR_COLOR = "blue";
const BAR_HEIGHT = 5;
const BAR_WIDTH = 60;
let barX;
let rightKeyFlag = false;
let leftKeyFlag = false;
//about block
const BLOCK_COLOR = "orange";
const BLOCK_ROW_COUNT = 3;
const BLOCK_COLUMN_COUNT = 9;//5
const BLOCK_WIDTH = 30;//54
const BLOCK_HEIGHT = 10;
const BLOCK_MARGIN = 3;//5
let blockArray = []
let blockArrayX = [];
let blockArrayY = [];
let timerID;
let clearCount;
function gameStart(){
  displayNone();
  ballX = BALL_RADIUS+1+Math.floor( Math.random()*(301-(2*(BALL_RADIUS+1))));
  ballY = canvas_height/2+Math.floor( Math.random()*25);
  barX = (canvas_width-BAR_WIDTH)/2;
  xMove = (Math.floor( Math.random()*2))*2-1;
  yMove = -1;
  clearCount = BLOCK_ROW_COUNT*BLOCK_COLUMN_COUNT;
  level = 30-3*(document.getElementById("difficulty").value);
  timerID = setInterval("draw()",level);
}
function draw(){
  mp.ctx.clearRect(0,0,canvas_width,canvas_height);
  drawBar();
  drawBall();
  drawBlock();
}
function drawBall(){
  if(ballY == BALL_RADIUS){
    yMove *= -1;
  }
  if(ballX == canvas_width-BALL_RADIUS || ballX == 0+BALL_RADIUS){
    xMove *= -1;
  }
  mp.ctx.beginPath()
  mp.ctx.arc(ballX,ballY,BALL_RADIUS,0,Math.PI*2);
  mp.ctx.fillStyle = BALL_COLOR;
  mp.ctx.fill();
  mp.ctx.closePath();
  if((ballY+BALL_RADIUS) == (canvas_height-BAR_HEIGHT)&&(barX < ballX && ballX < barX+BAR_WIDTH)){
    yMove *= -1;
  }
  ballX += xMove;
  ballY += yMove;
}
function drawBar(){
  if(rightKeyFlag && (barX < (canvas_width - BAR_WIDTH))){
    barX += 3;
  }
  if(leftKeyFlag && (barX > 0)){
    barX -= 3;
  }
  mp.ctx.beginPath();
  mp.ctx.rect(barX,canvas_height-BAR_HEIGHT,BAR_WIDTH,BAR_HEIGHT)
  mp.ctx.fillStyle = BAR_COLOR;
  mp.ctx.fill();
  mp.ctx.closePath();
}
function keyDownHandler(e){
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightKeyFlag = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftKeyFlag = true;
  }
}
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightKeyFlag = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftKeyFlag = false;
  }
}
function drawBlock() {
  for(let q = 0;q < BLOCK_ROW_COUNT*BLOCK_COLUMN_COUNT;q++){
    if((blockArray[q][0] <= ballX&&ballX <= blockArray[q][0]+BLOCK_WIDTH)&&(blockArray[q][1]-BALL_RADIUS <= ballY&&ballY <= blockArray[q][1]+BLOCK_HEIGHT+BALL_RADIUS)){
      yMove *= -1;
      blockArray[q][0] = -3*BLOCK_ROW_COUNT;
      blockArray[q][1] = -3*BLOCK_COLUMN_COUNT;
      clearCount--;
    }
    if((blockArray[q][0]-BALL_RADIUS <= ballX&&ballX <= blockArray[q][0]+BLOCK_WIDTH+BALL_RADIUS)&&(blockArray[q][1] <= ballY&&ballY <= blockArray[q][1]+BLOCK_HEIGHT)){
      xMove *= -1;
      blockArray[q][0] = -3*BLOCK_ROW_COUNT;
      blockArray[q][1] = -3*BLOCK_COLUMN_COUNT;
      clearCount--;
    }
  }
  for(let m = 0;m < BLOCK_COLUMN_COUNT*BLOCK_ROW_COUNT;m++){
    mp.ctx.beginPath();
    mp.ctx.rect(blockArray[m][0],blockArray[m][1],BLOCK_WIDTH,BLOCK_HEIGHT);
    mp.ctx.fillStyle = BLOCK_COLOR;
    mp.ctx.fill();
    mp.ctx.closePath();
  }
  if(clearCount <= 0){
    clearInterval(timerID);
    document.getElementById("method").style.display = "none";
    document.getElementById("start").style.display = "none";
    document.getElementById("res").style.display = "";
    document.getElementById("restart").style.display = "";
    mp.ctx.beginPath();
    mp.ctx.clearRect(0,0,canvas_width,canvas_height);
    mp.ctx.clearRect(0,0,mp.canvas.width,mp.canvas.height);
    mp.ctx.font = "40px 'ＭＳ ゴシック'";
    mp.ctx.textBaseline = "middle";
    mp.ctx.textAlign = "center";
    mp.ctx.fillStyle = "white";
    mp.ctx.fillText("YOU WIN!", mp.canvas.width/2, mp.canvas.height/2);
    mp.ctx.closePath();
  }
  if((ballY+BALL_RADIUS == canvas_height)||((ballX+BALL_RADIUS == barX || ballX-BALL_RADIUS == barX+BAR_WIDTH)&&(canvas_height-BAR_HEIGHT < ballY))){
    clearInterval(timerID);
    document.getElementById("method").style.display = "none";
    document.getElementById("start").style.display = "none";
    document.getElementById("res").style.display = "";
    document.getElementById("restart").style.display = "";
    mp.ctx.beginPath();
    mp.ctx.clearRect(0,0,canvas_width,canvas_height);
    mp.ctx.clearRect(0,0,mp.canvas.width,mp.canvas.height);
    mp.ctx.font = "40px 'ＭＳ ゴシック'";
  	mp.ctx.textBaseline = "middle";
  	mp.ctx.textAlign = "center";
    mp.ctx.fillStyle = "white";
  	mp.ctx.fillText("YOU LOSE", mp.canvas.width/2, mp.canvas.height/2);
    mp.ctx.closePath();
  }
}
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
function gameDC(){
  window.alert("--------------------------遊び方--------------------------\n\nボールが落ちないように板を矢印キーで動かしてブロックを消そう");
}
