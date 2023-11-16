document.getElementById('startButton').addEventListener('click', startGame);

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

let mazeSize, blockSize, maze, player, goal;
let touchStartX = 0;
let touchStartY = 0;
let currentLevelIndex = 0;
const levels = [
  { level: 1, size: 11 },
  { level: 2, size: 15 },
  { level: 3, size: 21 }
];

function startGame() {
    setLevel(currentLevelIndex);
}

function setLevel(levelIndex) {
    let level = levels[levelIndex];
    mazeSize = level.size;
    blockSize = Math.floor(canvas.width / mazeSize);
    canvas.height = blockSize * mazeSize;
    canvas.width = blockSize * mazeSize;
    player = { x: 1, y: 1 };
    goal = { x: mazeSize - 2, y: mazeSize - 2 };
    generateMaze(mazeSize);
    drawMaze();
    placePlayer();
    placeGoal();
}

function generateMaze(size) {
    maze = new Array(size).fill(null).map(() => new Array(size).fill(1));
    let stack = [];
    let currentCell = { x: 1, y: 1 };
    maze[currentCell.y][currentCell.x] = 0;
    stack.push(currentCell);

    while (stack.length > 0) {
        currentCell = stack[stack.length - 1];
        let neighbors = getNeighbors(currentCell.x, currentCell.y);
        if (neighbors.length > 0) {
            let nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
            maze[nextCell.y][nextCell.x] = 0;
            removeWall(currentCell, nextCell);
            stack.push(nextCell);
        } else {
            stack.pop();
        }
    }
}

function getNeighbors(x, y) {
    let neighbors = [];
    const directions = [
        { x: -2, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: -2 },
        { x: 0, y: 2 }
    ];

    directions.forEach(dir => {
        const nx = x + dir.x;
        const ny = y + dir.y;
        if (ny > 0 && ny < mazeSize - 1 && nx > 0 && nx < mazeSize - 1 && maze[ny][nx] === 1) {
            neighbors.push({ x: nx, y: ny });
        }
    });

    return neighbors;
}

function removeWall(cell1, cell2) {
    let x = (cell1.x + cell2.x) / 2;
    let y = (cell1.y + cell2.y) / 2;
    maze[y][x] = 0;
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? 'black' : 'white';
            ctx.fillRect(x * blockSize, y * blockSize, blockSize + 1, blockSize + 1);
        }
    }
    placeGoal();
}

function placePlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * blockSize, player.y * blockSize, blockSize, blockSize);
}

function placeGoal() {
    ctx.fillStyle = 'green';
    ctx.fillRect(goal.x * blockSize, goal.y * blockSize, blockSize, blockSize);
}

function movePlayer(dx, dy) {
    let newX = player.x + dx;
    let newY = player.y + dy;
    if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        drawMaze();
        placePlayer();
        checkWin();
    }
}

function showMessage(message) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
        currentLevelIndex++;
        if (currentLevelIndex < levels.length) {
            setLevel(currentLevelIndex);
        } else {
            showMessage("Congratulations! You've completed all levels!");
            currentLevelIndex = 0;
            setTimeout(() => setLevel(currentLevelIndex), 3000);
        }
    }
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case "ArrowUp": movePlayer(0, -1); break;
        case "ArrowDown": movePlayer(0, 1); break;
        case "ArrowLeft": movePlayer(-1, 0); break;
        case "ArrowRight": movePlayer(1, 0); break;
    }
});

// Touchscreen support
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
    let touchEndX = e.changedTouches[0].clientX;
    let touchEndY = e.changedTouches[0].clientY;
    handleTouchMove(touchEndX, touchEndY);
}, { passive: false });

function handleTouchMove(touchEndX, touchEndY) {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) movePlayer(1, 0);
        else movePlayer(-1, 0);
    } else {
        if (dy > 0) movePlayer(0, 1);
        else movePlayer(0, -1);
    }
}
