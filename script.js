"use strict";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//for score
let score = 0;

//for life
let life = 3;

//draw life
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Life: ${life}`, canvas.width - 50, 20);
}

//for bricks
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];
for (let r = 0; r < brickRowCount; r++) {
  bricks[r] = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[r][c] = { x: 0, y: 0, status: 1 };
  }
}
//to draw bricks
function drawBricks() {
  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      if (bricks[r][c].status == 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetTop;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetLeft;
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      } else {
        bricks[r][c].x = canvas.width;
        bricks[r][c].y = canvas.height;
      }
    }
  }
}

//for ball
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = -1;
let dy = 1;

//for paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

//for event
let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.key === "Right " || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  console.log(e);
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (let r = 0; r < brickRowCount; r++) {
    for (let c = 0; c < brickColumnCount; c++) {
      const brick = bricks[r][c];
      if (
        x > brick.x &&
        x < brick.x + brickWidth &&
        y > brick.y &&
        y < brick.y + brickHeight
      ) {
        brick.status = 0;
        dy = -dy;
        score++;
        if (score === brickRowCount * brickColumnCount) {
          alert("YOU WIN, CONGRATULATIONS!!");
          document.location.reload();
        }
      }
    }
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "0095DD";
  ctx.fill();
  ctx.closePath();
}

//to draw score
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  collisionDetection();
  drawPaddle();

  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }

    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
      dx = -dx;
    }

    x += dx;
    y += dy;
    drawScore();
    drawLives();
    if (rightPressed) {
      paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
      paddleX = Math.max(paddleX - 7, 0);
    }
    requestAnimationFrame(draw);
  }
}

//events
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();
