const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const choices = document.querySelectorAll('.choice');
const resultDisplay = document.getElementById('result');
const computerChoiceDiv = document.getElementById('computer-choice');

let playerScore = 0;
let computerScore = 0;

choices.forEach(choice => {
    choice.addEventListener('click', function() {
        // Remove the 'hidden' class to show the elements
        document.getElementById('computer-choice-label').classList.remove('hidden');
        document.getElementById('versus').classList.remove('hidden');

        const playerChoice = this.id;
        const computerChoice = getComputerChoice();
        displayComputerChoice(computerChoice);
        const winner = getWinner(playerChoice, computerChoice);
        updateScore(winner);
        displayResult(playerChoice, computerChoice, winner);
    });
});
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomNumber = Math.floor(Math.random() * 3);
    return choices[randomNumber];
}

function displayComputerChoice(computerChoice) {
    computerChoiceDiv.innerHTML = `<img src="Images/${computerChoice}.png" alt="${computerChoice}">`;
    computerChoiceDiv.firstChild.classList.add('computer-choice-animate');
    setTimeout(() => {
        computerChoiceDiv.firstChild.classList.remove('computer-choice-animate');
    }, 300);
}

function getWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    } else if ((playerChoice === 'rock' && computerChoice === 'scissors') ||
               (playerChoice === 'paper' && computerChoice === 'rock') ||
               (playerChoice === 'scissors' && computerChoice === 'paper')) {
        return 'player';
    } else {
        return 'computer';
    }
}

function updateScore(winner) {
    if (winner === 'player') {
        playerScore++;
        playerScoreEl.textContent = playerScore;
    } else if (winner === 'computer') {
        computerScore++;
        computerScoreEl.textContent = computerScore;
    }
}

function displayResult(playerChoice, computerChoice, winner) {
    let resultMessage = '';
    if (winner === 'player') {
        resultMessage = `You win! ${playerChoice} beats ${computerChoice}.`;
    } else if (winner === 'computer') {
        resultMessage = `You lose! ${computerChoice} beats ${playerChoice}.`;
    } else {
        resultMessage = "It's a draw!";
    }
    resultDisplay.textContent = resultMessage;
}
