const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
let score = 0;
let gameOver = true;
let activeMoles = new Set();

// Replace with your image path
const moleImageUrl = '/lensky.JPG';

function randomTime(min, max) {
  return Math.random() * (max - min) + min;
}

function randomHole() {
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

function peep() {
  if (gameOver) return;

  const hole = randomHole();
  const time = randomTime(2000, 4000);
  const img = document.createElement('img');
  img.src = moleImageUrl;
  
  hole.appendChild(img);
  hole.classList.add('active');
  activeMoles.add(hole);

  const timeout = setTimeout(() => {
    if (hole.classList.contains('active')) {
      hole.classList.remove('active');
      hole.removeChild(img);
      activeMoles.delete(hole);
    }
    if (!gameOver) peep();
  }, time);

  // Store timeout reference on the hole
  hole.currentTimeout = timeout;
}

function startGame() {
  if (!gameOver) return;

  // Reset game state
  gameOver = false;
  score = 0;
  scoreDisplay.textContent = score;
  activeMoles.clear();

  // Clear existing moles and timeouts
  holes.forEach(hole => {
    hole.classList.remove('active');
    const img = hole.querySelector('img');
    if (img) hole.removeChild(img);
    if (hole.currentTimeout) {
      clearTimeout(hole.currentTimeout);
      delete hole.currentTimeout;
    }
  });

  peep();

  // Auto-end after 15 seconds
  setTimeout(() => {
    gameOver = true;
    alert(`Game Over! Score: ${score}`);
  }, 15000);
}

function restartGame() {
  gameOver = true;
  holes.forEach(hole => {
    if (hole.currentTimeout) {
      clearTimeout(hole.currentTimeout);
      delete hole.currentTimeout;
    }
  });
  setTimeout(startGame, 100);
}

function whack(e) {
  if (!e.isTrusted || gameOver) return;

  const hole = e.currentTarget;
  if (!hole.classList.contains('active')) return;

  // Clear the timeout when manually whacked
  clearTimeout(hole.currentTimeout);
  delete hole.currentTimeout;

  score++;
  scoreDisplay.textContent = score;
  hole.classList.remove('active');
  const img = hole.querySelector('img');
  if (img) hole.removeChild(img);
  activeMoles.delete(hole);

  // Immediately spawn new mole
  if (!gameOver) peep();
}

// Event listeners
holes.forEach(hole => hole.addEventListener('click', whack));
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
