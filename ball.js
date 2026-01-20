const ball = document.createElement('div');
document.body.appendChild(ball)

function renderBall() {
  ball.style.width = '100px';
  ball.style.height = '100px';
  ball.style.position = 'absolute';
  ball.style.borderRadius = '50%';
  ball.style.left = '200px';
  ball.style.top = '200px';
  ball.style.backgroundColor = 'red';
}

renderBall();
