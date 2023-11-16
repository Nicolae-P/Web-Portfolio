document.getElementById("theme-toggle").addEventListener("click", function() {
  document.body.classList.toggle("dark-theme");
});



let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let scoreX = 0;
let scoreO = 0;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function updateScore() {
  document.getElementById("playerX").innerText = `Player X: ${scoreX}`;
  document.getElementById("playerO").innerText = `Player O: ${scoreO}`;
}

function makeMove(cellIndex) {
  if (gameActive && board[cellIndex] === "") {
    board[cellIndex] = currentPlayer;
    const cell = document.getElementsByClassName("cell")[cellIndex];
    cell.innerText = currentPlayer;
    cell.style.backgroundColor = currentPlayer === "X" ? "#850303" : "#3b3b3b";
    cell.classList.add("played");
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("current-player").innerText = `Current Player: ${currentPlayer}`;
    checkWinner();
  }
}

function checkWinner() {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      document.getElementById("message").innerText = `${board[a]} wins!`;
      if (board[a] === "X") {
        scoreX++;
      } else {
        scoreO++;
      }
      updateScore();
      gameActive = false;
    }
  }

  if (!board.includes("") && gameActive) {
    document.getElementById("message").innerText = "It's a draw!";
    gameActive = false;
  }
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  document.getElementById("message").innerText = "";
  const cells = document.getElementsByClassName("cell");
  for (let cell of cells) {
    cell.innerText = "";
    cell.style.backgroundColor = "#eee";
    cell.classList.remove("played");
  }
  document.getElementById("current-player").innerText = "Current Player: X";
}

resetGame();
