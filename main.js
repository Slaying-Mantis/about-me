
const gameArea = document.querySelector('.game-area');

gameArea.addEventListener('pointerdown', (event) => {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const pointerDot = {
    x: event.pageX,
    y: event.pageY
  }
  console.log({ 
    'box left': gameAreaRect.left,
    'box top': gameAreaRect.top,
    'pointer details': pointerDot
  })
})