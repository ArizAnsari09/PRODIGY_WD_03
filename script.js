const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const modeSelect = document.getElementById('mode');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let scorePlayerX = 0;
let scorePlayerO = 0;
let gameMode = '2player'; //Default game mode: 2 player//

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

// Game Mode Change
modeSelect.addEventListener('change', (e) =>{
    gameMode = e.target.value;
    resetGame(); //Resets game when mode changes
});

// handle cell clicks

cells.forEach(cell =>{
    cell.addEventListener('click', () =>{
        const index = cell.getAttribute('data-index');
        if(gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            playSound('move'); // Play move Sound
            checkWinner();
            if(gameActive && gameMode === 'vsAI' && currentPlayer === 'X') {
                setTimeout(aiMove, 500); // AI move after a short delay
            } else{
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    });
});

// Minimax AI Algorithm (Optimized AI)

function aiMove() {
    if (!gameActive) return;
    const bestMove = minimax(gameBoard, 'O');
    gameBoard[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';
    playSound('move');
    checkWinner();
    if (gameActive) currentPlayer = 'X';
}

//Minimaxalgory=ithm to find optimal move

function minimax(board, player) {
    const availableMoves = getAvailableMoves(board);

    if(checkWinnerForBoard(board, 'X')) return {score: -10};
    if(checkWinnerForBoard(board, 'O')) return {score: 10};
    if(availableMoves.length === 0) return {score: 0, index: -1};

    let moves = [];
    availableMoves.forEach(move => {
        const newBoard = [...board];
        newBoard[move] = player;
        const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
        moves.push({index: move, score: result.score});
    });

    return moves.reduce((bestMove, move) => {
        return player === 'O'
        ? (move.score > bestMove.score ? move : bestMove)
        : (move.score < bestMove.score ? move : bestMove);
    }); 
}

function getAvailableMoves(board) {
    return board.reduce((acc, val, index) =>{
        if(val === '') acc.push(index);
        return acc;
    }, []);
}

function checkWinnerForBoard(board, player) {
    return winningCombinations.some(combination => 
     combination.every(index => board[index] === player)
    );
}

//check for winner//

function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if(gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            gameActive = false;
            statusText.textContent = `${gameBoard[a]} wins!`;
            highlightWinningCombination(combination);
            playSound('win'); //play win sound//
            updateScore(gameBoard[a]);
            return;
        }
    }

    if(!gameBoard.includes('')) {
        gameActive = false;
        statusText.textContent = "It's a Tie!";
        playSound('tie'); //play tie sound//

    }
}

//UpdateScore//

function updateScore(winner){
    if(winner ==='X') {
        scorePlayerX++;
        scoreX.textContent = scorePlayerX;
    } else if(winner === 'O'){
        scorePlayerO++;
        scoreO.textContent = scorePlayerO;
    }
}

//reset the game //

resetButton.addEventListener('click', resetGame);

function resetGame(){
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    statusText.textContent = '';
    scorePlayerX = 0;
    scorePlayerO = 0;
    scoreX.textContent = scorePlayerX;
    scoreO.textContent = scorePlayerO;
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

//Play sound Effect
function playSound(type){ 
    const sound = document.getElementById(`${type}Sound`);
  if(sound)  
  sound.play();
}
