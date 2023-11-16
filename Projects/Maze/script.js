// Initialization of maze elements
const maze = document.getElementById('maze');
const player = createElement('div', { id: 'player' });
const winningPoint = document.createElement('div');
    winningPoint.style.width = '40px';
    winningPoint.style.height = '40px';
    winningPoint.style.backgroundColor = 'green';
    winningPoint.style.position = 'absolute';
    winningPoint.style.top = '360px';
    winningPoint.style.left = '360px';

// Player and game state variables
let [playerX, playerY, isGameOver, touchStartX, touchStartY, startTime, timerInterval] = [0, 0, false, 0, 0, null, null];

// Append elements to the maze
maze.appendChild(player);
maze.appendChild(winningPoint);

// Wall configurations
const walls = [
    { x: 40, y: 40, width: 320, height: 40 },
    { x: 40, y: 80, width:40, height: 160 },
    { x: 0, y: 280, width: 80, height: 40 },
    { x: 120, y: 200, width: 40, height: 200 },
    { x: 80, y: 200, width: 40, height: 40 },
    { x: 120, y: 120, width: 280, height: 40 },
    { x: 200, y: 160, width: 40, height: 160 },
    { x: 200, y: 360, width: 40, height: 40 },
    { x: 280, y: 200, width: 40, height: 200 },
    { x: 320, y: 200, width: 40, height: 40 },
    { x: 40, y: 320, width: 40, height: 40 },
    { x: 320, y: 280, width: 40, height: 40 },
];

document.addEventListener('DOMContentLoaded', displayInitialBestTime);
document.addEventListener('keydown', handleKeyPress);
maze.addEventListener('touchstart', handleTouchStart, false);
maze.addEventListener('touchend', handleTouchEnd, false);

function createElement(type, options) {
    const element = document.createElement(type);
    Object.keys(options).forEach(key => {
        if (key === 'style') {
            Object.assign(element.style, options.style);
        } else {
            element[key] = options[key];
        }
    });
    return element;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    document.getElementById('timer').innerText = `Time: ${formatTime(elapsedTime)}`;
}

function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${pad(minutes, 2)}:${pad(seconds, 2)}:${pad(milliseconds % 1000, 3)}`;
}

function pad(number, length) {
    return String(number).padStart(length, '0');
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = 'Time: 0';
}

function saveBestTime(currentTime) {
    const bestTime = getBestTime();
    if (!bestTime || currentTime < bestTime) {
        localStorage.setItem('bestTime', currentTime);
        updateBestTimeDisplay(currentTime);
    }
}

function updateBestTimeDisplay(time) {
    document.getElementById('best-time').innerText = `Best Time: ${formatTime(time)}`;
}

function getBestTime() {
    return localStorage.getItem('bestTime');
}

function drawWalls() {
    walls.forEach(wall => {
        const wallElement = createElement('div', {
            className: 'wall',
            style: {
                width: `${wall.width}px`, height: `${wall.height}px`,
                left: `${wall.x}px`, top: `${wall.y}px`
            }
        });
        maze.appendChild(wallElement);
    });
}

function movePlayer(x, y) {
    if (!isGameOver) {
        playerX += x;
        playerY += y;
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;

        checkCollisions();
        checkWin();
    }
}

function checkCollisions() {
    walls.forEach(wall => {
        if (playerX < wall.x + wall.width && playerX + 40 > wall.x &&
            playerY < wall.y + wall.height && playerY + 40 > wall.y) {
            gameOver();
        }
    });

    if (playerX < 0 || playerX + 40 > maze.clientWidth || playerY < 0 || playerY + 40 > maze.clientHeight) {
        gameOver();
    }
}

function gameOver() {
    alert('Game Over!');
    stopTimer();
    resetGame();
}

function winGame() {
    stopTimer();
    const elapsedTime = Date.now() - startTime;
    saveBestTime(elapsedTime);
    alert(`You won! Your Time: ${formatTime(elapsedTime)}. Best Time: ${formatTime(getBestTime())}`);
    resetGame();
}

function checkWin() {
    if (playerX === winningPoint.offsetLeft && playerY === winningPoint.offsetTop) {
        winGame();
    }
}

function resetGame() {
    playerX = playerY = 0;
    player.style.left = player.style.top = '0px';
    isGameOver = false;
    startTime = null;
}

function displayInitialBestTime() {
    const bestTime = getBestTime();
    document.getElementById('best-time').innerText = bestTime ? `Best Time: ${formatTime(bestTime)}` : 'Best Time: --:--:---';
}

function handleKeyPress(event) {
    if (!isGameOver && (startTime == null)) {
        startTimer();
    }
    switch (event.key) {
        case 'ArrowRight':
        case 'd': movePlayer(40, 0); break;
        case 'ArrowLeft':
        case 'a': movePlayer(-40, 0); break;
        case 'ArrowDown':
        case 's': movePlayer(0, 40); break;
        case 'ArrowUp':
        case 'w': movePlayer(0, -40); break;
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
    let touchEndX = e.changedTouches[0].screenX;
    let touchEndY = e.changedTouches[0].screenY;
    handleGesture(touchEndX, touchEndY);
}

function handleGesture(touchEndX, touchEndY) {
    if (startTime == null) {
        startTimer();
    }
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) { // Horizontal swipe
        dx > 0 ? movePlayer(40, 0) : movePlayer(-40, 0);
    } else { // Vertical swipe
        dy > 0 ? movePlayer(0, 40) : movePlayer(0, -40);
    }
}

drawWalls();
