const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
let score = 0;
let gameOver = true;
let timeoutId = null;

// Replace with your image path
const moleImageUrl = '/lensky.jpg';

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
  const time = randomTime(1000, 1500); // 2-4 seconds
  const img = document.createElement('img');
  img.src = moleImageUrl;
  
  hole.appendChild(img);
  hole.classList.add('active');
  
  timeoutId = setTimeout(() => {
    hole.classList.remove('active');
    hole.removeChild(img);
    if (!gameOver) peep();
  }, time);
}

function startGame() {
  if (!gameOver) return;
  
  // Reset game state
  gameOver = false;
  score = 0;
  scoreDisplay.textContent = score;
  
  // Clear existing moles
  holes.forEach(hole => {
    hole.classList.remove('active');
    const img = hole.querySelector('img');
    if (img) hole.removeChild(img);
  });
  
  peep();
  
  // Auto-end after 15 seconds
  setTimeout(() => {
    gameOver = true;
    alert(`Game Over! Score: ${score}`);
  }, 15000);
}

function restartGame() {
  clearTimeout(timeoutId);
  gameOver = true;
  setTimeout(startGame, 100);
}

function whack(e) {
  if (!e.isTrusted || gameOver) return;
  
  score++;
  scoreDisplay.textContent = score;
  const hole = e.currentTarget;
  hole.classList.remove('active');
  const img = hole.querySelector('img');
  if (img) hole.removeChild(img);
}

// Event listeners
holes.forEach(hole => hole.addEventListener('click', whack));
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
