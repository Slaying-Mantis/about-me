class Ball {
  constructor(x, y, elem, xVector, yVector) {
    this.ballX = x;
    this.ballY = y;
    this.elem = elem;
    this.xVelocity = xVector;
    this.yVelocity = yVector;
    this.initials = { x, y, xVector, yVector };
  }

  radius = 2;
  directionX = 'left';
  directionY = 'up';
  minYSpeed = 0.5;
  maxYSpeed = 2;

  left() {
    return this.ballX - this.radius;
  }
  right() {
    return this.ballX + this.radius;
  }
  top() {
    return this.ballY - this.radius;
  }
  bottom() {
    return this.ballY + this.radius;
  }

  leftCollide() {
    const point = this.ballX - (this.radius / 3);
    return point;
  }
  rightCollide() {
    const point = this.ballX + (this.radius / 3);
    return point;
  }
  topCollide() {
    const point = this.ballY - (this.radius / 3);
    return point;
  }
  bottomCollide() {
    const point = this.ballY + (this.radius / 3);
    return point;
  }

  vectorX() {
    switch(this.directionX) {
      case 'left':
        return this.xVelocity * -1;
      case 'right':
        return this.xVelocity * 1;
    }
  }
  vectorY() {
    switch(this.directionY) {
      case 'up':
        return this.yVelocity * -1;
      case 'down':
        return this.yVelocity * 1;
    }
  }

  move() {
    this.ballX += this.vectorX();
    this.ballY += this.vectorY();
  }

  setDirectionX(direction) {
    if (typeof direction !== 'string') {
      throw new TypeError ('Provided input is not a string.');
    } else {
      this.directionX = direction;
    }
  }
  setDirectionY(direction) {
    if (typeof direction !== 'string') {
      throw new TypeError ('Provided input is not a string.');
    } else {
      this.directionY = direction;
    }
  }

  bounceHorizontally() {
    switch(this.directionX) {
      case 'left':
        this.directionX = 'right';
        break;
      case 'right':
        this.directionX = 'left';
        break;
    }
  }

  bounceVertically() {
    switch(this.directionY) {
      case 'up':
        this.directionY = 'down';
        break;
      case 'down':
        this.directionY = 'up';
        break;
    }
  }

  paddleBounce() {
    this.directionY = 'up';
  }

  updateVelocityX(speed) {
    this.xVelocity = speed;
  }
  updateVelocityY(speed) {
    this.yVelocity = speed;
  }

  reset() {
    this.ballX = this.initials.x;
    this.ballY = this.initials.y;
    this.xVelocity = this.initials.xVector;
    this.yVelocity = this.initials.yVector;
    this.directionX = 'left';
    this.directionY = 'up';
  }

  render() {
    this.elem.style.left = `${this.ballX}%`;
    this.elem.style.top = `${this.ballY}%`;
  }
}

class Paddle {
  constructor(x, y, elem, width = 20) {
    this.paddleX = x;
    this.paddleY = y;
    this.width = width;
    this.elem = elem;
    this.horizontalEdge = width / 2;
  }

  height = 3;
  verticalEdge = 1.5;

  left() {
    return this.paddleX - this.horizontalEdge;
  }
  right() {
    return this.paddleX + this.horizontalEdge;
  }
  top() {
    return this.paddleY - this.verticalEdge;
  }
  bottom() {
    return this.paddleY + this.verticalEdge;
  }
  leftQuarter() {
    return this.paddleX - (this.horizontalEdge/2);
  }
  rightQuarter() {
    return this.paddleX + (this.horizontalEdge/2);
  }

  updatePaddleX(newX) {
    this.paddleX = newX;
  }

  render() {
    this.elem.style.left = `${this.paddleX}%`;
    this.elem.style.top = `${this.paddleY}%;`
  }

  setOpacity(value = 0.2) {
    this.elem.style.opacity = `${value}`;
  }

  resetOpacity() {
    this.elem.style.opacity = '100';
  }
}



class Block {
  constructor(left, top, right, bottom, elem) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.elem = elem;
  }

  smashed = false;

  smash() {
    this.smashed = true;
    this.elem.style.opacity = '0';
  }

  reset() {
    this.smashed = false;
    this.elem.style.opacity = '100';
  }
}

class Level {
  constructor(ballElem, paddleElem, blocksElem, gameAreaElem) {
    this.ballELem = ballElem;
    this.paddleElem = paddleElem;
    this.blocksElems = blocksElem;
    this.gameScreenElem = gameAreaElem;
  }

  ball = "";
  paddle = "";
  blocks = [];
  blockSize = "";
  gameArea = {
    left: 0,
    right: 100,
    top: 0,
    bottom: 100
  };
  score = 0;
  scoreMod = 4;
  startTime = 0;
  elapsed = 0;
  loseCondition = false;
  win = false;
  gameStart = true;

  getBlockPositions(block, screen) {
    const rect = block.getBoundingClientRect();
    const gameAreaRect = screen.getBoundingClientRect();
    const dimensions = [
      Math.floor(((rect.left - gameAreaRect.left) / gameAreaRect.width) * 1000) / 10,
      Math.floor(((rect.top - gameAreaRect.top) / gameAreaRect.height) * 1000) / 10,
      Math.floor(((rect.right - gameAreaRect.left) / gameAreaRect.width) * 1000) / 10,
      Math.floor(((rect.bottom - gameAreaRect.top) / gameAreaRect.height) * 1000) / 10,
    ];
    return dimensions;
  }

  getBlockDimensions(block, screen) {
    const blockRect = block.elem.getBoundingClientRect();
    const gameAreaRect = screen.getBoundingClientRect();
    const [width, height] = [
      Math.floor((blockRect.width / gameAreaRect.width) * 1000) / 10,
      Math.floor((blockRect.height / gameAreaRect.height) * 1000) / 10,
    ];
    return { width, height };
  }

  buildBlocks(collection) {
    const blockDimensions = Array.from(collection).map((block) => {
      return this.getBlockPositions(block, this.gameScreenElem);
    });
    console.log("blocks positions updated!")

    blockDimensions.forEach(([left, top, right, bottom], idx) => {
      this.blocks.push(new Block(left, top, right, bottom, document.querySelector(`.block:nth-child(${idx + 1})`)));
    })

    this.blockSize = this.getBlockDimensions(this.blocks[0], this.gameScreenElem);
    console.log("blocks built!");
  }

  resetBlocks() {
    this.blocks.forEach(block => block.reset());
  }

  buildBall() {
    this.ball = new Ball(50, 92, this.ballELem, 0.5, 0.5);
    console.log("ball built!")
  }
  buildPaddle() {
    this.paddle = new Paddle(50, 97, this.paddleElem, 20);
    console.log("paddle built!")
  }

  setup() {
    this.buildBall();
    this.buildPaddle();
    this.buildBlocks(this.blocksElems);
    console.log("setup complete!")
  }

  proximityCheck(element) {
    if (element.left > this.ball.right() || element.right < this.ball.left()) {
      return true;
    }
    return false;
  }

  detectCollisionNew(element) {
    const block = element;

    if (this.ball.ballY < block.bottom && this.ball.ballY > block.top) {
      switch (this.ball.directionX) {
        case 'right':
          if ((this.ball.right() >= block.left) && (this.ball.right() < (block.left + (this.blockSize.width/2)))) {
            return 'left wall';
          }
          break;
        case 'left':
          if ((this.ball.left() <= block.right) && (this.ball.left() > (block.right - (this.blockSize.width/2)))) {
            return 'right wall';
          }
          break;
      } 
    }
    if (this.ball.ballX > block.left && this.ball.ballX < block.right) {
      switch (this.ball.directionY) {
        case 'up':
          if ((this.ball.top() <= block.bottom) && (this.ball.top() > (block.bottom - (this.blockSize.height / 2)))) {
            return 'bottom wall';
          }
          break;
        case 'down':
          if ((this.ball.bottom() >= block.top) && (this.ball.bottom() < (block.top + (this.blockSize.height / 2)))) {
            return 'top wall';
          }
          break;
      }
    }
    
    return 'no collision';
  }

  blockCollision() {
    let proximity;
    let detector;
    this.blocks.forEach((block) => {
      proximity = this.proximityCheck(block);
      if (block.smashed) {
        //log("Block smashed works")
        return;
      }
      if (proximity) {
        //log(`proximity check works for ${block}`)
        return;
      }
      detector = this.detectCollisionNew(block);
      switch (detector) {
        case 'left wall':
          this.ball.bounceHorizontally();
          block.smash();
          this.updateScore();
          break;
        case 'right wall':
          this.ball.bounceHorizontally();
          block.smash();
          this.updateScore();
          break;
        case 'top wall':
          this.ball.bounceVertically();
          block.smash();
          this.updateScore();
          break;
        case 'bottom wall':
          this.ball.bounceVertically();
          block.smash();
          this.updateScore();
          break;
        case 'no collision':
          return;
      }
      
    })
  }

  ballCollision() {
    if (this.ball.right() >= this.gameArea.right) {
      this.ball.setDirectionX('left');
    } else if (this.ball.bottom() >= this.gameArea.bottom) {
      this.ball.setDirectionY('up');
    } else if (this.ball.left() <= this.gameArea.left) {
      this.ball.setDirectionX('right');
    } else if (this.ball.top() <= this.gameArea.top) {
      this.ball.setDirectionY('down');
    }
  }

  paddleCollision() {
    if ((this.ball.bottom() >= this.paddle.top()) && ((this.ball.leftCollide() >= this.paddle.left()) && (this.ball.rightCollide() <= this.paddle.right()))) {
      this.ball.paddleBounce();
      this.zoneModifier();
    }
  }

  zoneModifier() {
    let collisionGradient = this.ball.ballX - this.paddle.paddleX;
    let speedX = this.ball.xVelocity;
    let speedY = this.ball.yVelocity;
    let newSpeedX;
    let newSpeedY;
    if (collisionGradient === 0) {
      speedY -= (speedY * 0.5);
      speedX = 0;
    } else if (collisionGradient <= -10 || collisionGradient >= 10) {
      speedY += (speedY * 0.5);
      speedX = 1;
      this.ball.bounceHorizontally();
    } else if (collisionGradient < 0) {
      if (collisionGradient < -5 && collisionGradient > -10) {
        speedY += (speedY * ((-collisionGradient)/10));
        if (this.ball.directionX === 'right') {
          this.ball.bounceHorizontally();
        }
      } else if (collisionGradient > -5 && collisionGradient < 0) {
        speedY -= (speedY * ((-collisionGradient)/10));
      }
      speedX = ((-collisionGradient)/10);
    } else if (collisionGradient > 0) {
      if (collisionGradient > 5 && collisionGradient < 10) {
        speedY += (speedY * (collisionGradient/10));
        if (this.ball.directionX === 'left') {
          this.ball.bounceHorizontally();
        }
      } else if (collisionGradient < 5 && collisionGradient > 0) {
        speedY -= (speedY * (collisionGradient/10));
      }
      speedX = (collisionGradient/10);
    }
    newSpeedY = Math.min(Math.max(speedY, this.ball.minYSpeed), this.ball.maxYSpeed);
    newSpeedX = speedX;
    this.ball.updateVelocityY(newSpeedY);
    this.ball.updateVelocityX(newSpeedX);
  }

  updatePaddle(x) {
    const gameAreaRect = this.gameScreenElem.getBoundingClientRect();

    const adjustedPointer = x - gameAreaRect.left;
    const pointerPosition = (adjustedPointer / gameAreaRect.width) * 100;

    const min = this.paddle.horizontalEdge;
    const max = this.gameArea.right - this.paddle.horizontalEdge;


    const updatedX = Math.min(Math.max(pointerPosition, min), max);
    this.paddle.updatePaddleX(updatedX);
  }

  render() {
    this.ball.render();
    this.paddle.render();
  }

  setStartTime() {
    this.startTime = Date.now();
  }
  timer() {
    const now = Date.now();
    this.elapsed = (now - this.startTime) / 1000;
  }
  pointModifier() {
    if (this.elapsed > 20) {
      this.scoreMod = 1;
    } else if (this.elapsed > 10) {
      this.scoreMod = 2;
    }
  }
  modifyPoints() {
    if (this.scoreMod != 1) {
      this.pointModifier();
    }
  }
  updateScore() {
    this.timer();
    this.modifyPoints();
    this.score += this.scoreMod;
  }

  start() {
    this.gameStart = false;
    this.setStartTime();
  }


  reset() {
    this.ball.reset();
    this.ball.render();
    this.loseCondition = false;
    this.win = false;
    this.resetBlocks();
    this.gameScreenElem.style.background = 'black';
    this.paddle.resetOpacity();
    this.score = 0;
    this.scoreMod = 4;
    this.startTime = 0;
    this.elapsed = 0;
    this.gameStart = true;
  }

  checkGameOver() {
    if (this.ball.bottom() >= this.gameArea.bottom) {
      this.loseCondition = true;
    }
  }

  allSmashed() {
    for (const block of this.blocks) {
      if (!(block.smashed)) {
        return false;
      }
    }
    return true;
  }

  checkWin() {
    if (this.allSmashed()) {
      this.win = true;
    }
  }

  gameOver() {
    this.gameScreenElem.style.background = 'darkred';
    this.paddle.setOpacity();
  }

  gameWon() {
    this.gameScreenElem.style.background = 'green';
    this.paddle.setOpacity();
  }

}

const ballElem = document.querySelector('.ball');
const paddleElem = document.querySelector('.paddle');
const allBlockElems = document.querySelectorAll('.block');
const gameAreaElem = document.querySelector('.game-area');
const gameSetupElem = document.querySelector('.game-setup');
const gameCondition = document.querySelector('.game-over');
const playBtn = document.querySelector('.button.play');
const reloadBtn = document.querySelector('.button.reload');
const homeBtn = document.querySelector('.button.home');
const points = document.querySelector('#points');



function drawWin() {
  const winBox = `
    <div class="game-over">
      <p>Congrats! 🎉</p>
    </div>
  `
  const template = document.createElement("template");
  template.innerHTML = winBox.trim();
  const winElem = template.content.firstElementChild;
  gameSetupElem.appendChild(winElem);
}

function drawLoss() {
  const loseBox = `
    <div class="game-over">
      <p>Game Over! ❌</p>
    </div>
  `

  const template = document.createElement("template");
  template.innerHTML = loseBox.trim();
  const lossElem = template.content.firstElementChild;
  gameSetupElem.appendChild(lossElem);
}

function clearGameOver() {
  const box = document.querySelector('.game-over');
  box.remove();
}

const levelOne = new Level(ballElem, paddleElem, allBlockElems, gameAreaElem);

levelOne.setup();

function movePaddle(event) {
  
  if (!levelOne.loseCondition) {
    levelOne.updatePaddle(event.pageX);
    levelOne.render();
  }
}

gameSetupElem.addEventListener("pointermove", movePaddle);

function updateScore(score) {
  points.innerText = `${score}`;
}

function gameOver() {
  levelOne.gameOver();
  drawLoss();
}

function gameComplete() {
  levelOne.gameWon();
  drawWin();
}

function reload(event) {
  event.stopPropagation();
  levelOne.reset();
  updateScore(levelOne.score);
  clearGameOver();
}


function gameLoop() {
  levelOne.ballCollision();
  levelOne.paddleCollision();
  levelOne.blockCollision();
  updateScore(levelOne.score);
  levelOne.ball.move();
  levelOne.render();
  levelOne.checkWin();
  levelOne.checkGameOver();

  if (levelOne.loseCondition) {
    gameOver();
  } else if (levelOne.win) {
    gameComplete();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

function startGame(event) {
  event.stopPropagation();
  levelOne.start();
  requestAnimationFrame(gameLoop);
}

console.log(levelOne.loseCondition);


playBtn.addEventListener('click', (event) => {
  if (levelOne.gameStart) {
    startGame(event);
  } else {
    return;
  }
});
reloadBtn.addEventListener('click', (event) => {
  if (levelOne.loseCondition || levelOne.win) {
    reload(event);
  }
})
