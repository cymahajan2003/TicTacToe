const boardEl = document.getElementById('board');
const currentTurnEl = document.getElementById('currentTurn');
const resultBoxEl = document.getElementById('resultBox');
const player1Icon = document.getElementById('player1Icon');
const player2Icon = document.getElementById('player2Icon');
const score1El = document.getElementById('score1');
const score2El = document.getElementById('score2');
const scoreDrawEl = document.getElementById('scoreDraw');
const scoreBox1 = document.getElementById('scoreBox1');
const scoreBox2 = document.getElementById('scoreBox2');
const scoreBoxDraw = document.getElementById('scoreBoxDraw');
const resetBtn = document.getElementById('resetBtn');
const newGameBtn = document.getElementById('newGameBtn');

let board = Array(3).fill().map(() => Array(3).fill(''));
let currentPlayer = 'X';
let gameOver = false;
let winningCells = [];
let scores = { player1: 0, player2: 0, draws: 0 };

function createBoard() {
    boardEl.innerHTML = '';
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleClick);
            boardEl.appendChild(cell);
        }
    }
}

function handleClick(e) {
    if(gameOver) return;
    
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;
    
    if(board[row][col] === '') {
        const icon = currentPlayer === 'X' ? player1Icon.value : player2Icon.value;
        board[row][col] = icon;
        e.target.textContent = icon;
        e.target.classList.add('taken', currentPlayer === 'X' ? 'player1' : 'player2');
        
        if(checkWin(icon)) {
            highlightWinningCells();
            showResult(`${icon} Wins!`, 'win');
            updateScores(currentPlayer === 'X' ? 'player1' : 'player2');
            highlightScoreBox(currentPlayer === 'X' ? 'player1' : 'player2');
            gameOver = true;
        } else if(isBoardFull()) {
            showResult("It's a Draw!", 'draw');
            updateScores('draws');
            highlightScoreBox('draws');
            gameOver = true;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateTurnDisplay();
        }
    }
}

function checkWin(icon) {
    // Rows
    for(let i = 0; i < 3; i++) {
        if(board[i].every(c => c === icon)) {
            winningCells = [[i,0], [i,1], [i,2]];
            return true;
        }
    }
    
    // Columns
    for(let j = 0; j < 3; j++) {
        if(board.every(r => r[j] === icon)) {
            winningCells = [[0,j], [1,j], [2,j]];
            return true;
        }
    }
    
    // Diagonals
    if([0,1,2].every(i => board[i][i] === icon)) {
        winningCells = [[0,0], [1,1], [2,2]];
        return true;
    }
    
    if([0,1,2].every(i => board[i][2-i] === icon)) {
        winningCells = [[0,2], [1,1], [2,0]];
        return true;
    }
    
    return false;
}

function highlightWinningCells() {
    winningCells.forEach(([row, col]) => {
        const cell = boardEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('win');
    });
}

function showResult(message, type) {
    resultBoxEl.textContent = message;
    resultBoxEl.className = `result-box ${type}`;
    currentTurnEl.textContent = type === 'win' ? '🎉' : '🤝';
}

function updateScores(winner) {
    scores[winner]++;
    updateAllScores();
    highlightScoreBox(winner);
}

function highlightScoreBox(winner) {
    scoreBox1.classList.remove('active');
    scoreBox2.classList.remove('active');
    scoreBoxDraw.classList.remove('active');
    
    if(winner === 'player1') {
        scoreBox1.classList.add('active');
    } else if(winner === 'player2') {
        scoreBox2.classList.add('active');
    } else {
        scoreBoxDraw.classList.add('active');
    }
}

function updateTurnDisplay() {
    const icon = currentPlayer === 'X' ? player1Icon.value : player2Icon.value;
    currentTurnEl.textContent = icon;
    currentTurnEl.style.color = currentPlayer === 'X' ? '#4CAF50' : '#2196F3';
}

function isBoardFull() {
    return board.flat().every(cell => cell !== '');
}

function resetGame() {
    board = Array(3).fill().map(() => Array(3).fill(''));
    createBoard();
    resultBoxEl.textContent = '';
    resultBoxEl.className = 'result-box';
    currentPlayer = 'X';
    gameOver = false;
    winningCells = [];
    updateTurnDisplay();
    
    scoreBox1.classList.remove('active');
    scoreBox2.classList.remove('active');
    scoreBoxDraw.classList.remove('active');
}

function newGame() {
    scores = { player1: 0, player2: 0, draws: 0 };
    resetGame();
    updateAllScores();
}

function updateAllScores() {
    score1El.textContent = scores.player1;
    score2El.textContent = scores.player2;
    scoreDrawEl.textContent = scores.draws;
}

player1Icon.addEventListener('change', () => {
    if(player1Icon.value === player2Icon.value) {
        // Find a different emoji that's not currently selected
        const allOptions = Array.from(player2Icon.options).map(opt => opt.value);
        const availableOptions = allOptions.filter(opt => opt !== player1Icon.value);
        if(availableOptions.length > 0) {
            player2Icon.value = availableOptions[0];
        }
    }
    if(!gameOver) updateTurnDisplay();
});

player2Icon.addEventListener('change', () => {
    if(player2Icon.value === player1Icon.value) {
        // Find a different emoji that's not currently selected
        const allOptions = Array.from(player1Icon.options).map(opt => opt.value);
        const availableOptions = allOptions.filter(opt => opt !== player2Icon.value);
        if(availableOptions.length > 0) {
            player1Icon.value = availableOptions[0];
        }
    }
    if(!gameOver) updateTurnDisplay();
});

resetBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', newGame);

createBoard();
updateTurnDisplay();
updateAllScores();
