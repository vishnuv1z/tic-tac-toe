const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const resetScoresBtn = document.getElementById('reset-scores');
const player1ScoreEl = document.getElementById('score1');
const player2ScoreEl = document.getElementById('score2');
const player1Card = document.getElementById('player1');
const player2Card = document.getElementById('player2');
const p2Name = document.getElementById('p2-name');
const modeBtns = document.querySelectorAll('.mode-btn');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'x'; // 'x' for Player 1, 'o' for Player 2 / AI
let running = false;
let isAITurn = false;
let gameMode = 'PvP'; // PvP, AI-Easy, AI-Hard
let aiTimeoutId = null;

// Scores
let p1Score = 0;
let p2Score = 0;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    resetBtn.addEventListener('click', () => resetGame(false));
    resetScoresBtn.addEventListener('click', resetScores);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            gameMode = e.currentTarget.getAttribute('data-mode');
            updateModeText();
            resetGame(true); // reset scores too on mode change
        });
    });

    running = true;
    updateStatus();
    updateActivePlayer();
}

function updateModeText() {
    if (gameMode === 'PvP') p2Name.textContent = 'Player 2';
    if (gameMode === 'AI-Easy') p2Name.textContent = 'AI Easy (O)';
    if (gameMode === 'AI-Hard') p2Name.textContent = 'AI Hard (O)';
}

function cellClicked() {
    const cellIndex = this.getAttribute('data-index');

    if (board[cellIndex] !== '' || !running || isAITurn) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer.toUpperCase();
    cell.classList.add(currentPlayer);
}

function changePlayer() {
    currentPlayer = (currentPlayer === 'x') ? 'o' : 'x';
    updateStatus();
    updateActivePlayer();

    if (running && currentPlayer === 'o' && gameMode.startsWith('AI')) {
        isAITurn = true;
        aiTimeoutId = setTimeout(makeAIMove, 500); // Small delay for better UX
    } else {
        isAITurn = false;
    }
}

function updateStatus() {
    let t = '';
    if (currentPlayer === 'x') t = "Player 1's Turn (X)";
    else {
        if (gameMode === 'PvP') t = "Player 2's Turn (O)";
        if (gameMode === 'AI-Easy') t = "AI Easy is thinking...";
        if (gameMode === 'AI-Hard') t = "AI Hard is thinking...";
    }
    statusText.textContent = t;
}

function updateActivePlayer() {
    if (currentPlayer === 'x') {
        player1Card.classList.add('active');
        player2Card.classList.remove('active');
    } else {
        player2Card.classList.add('active');
        player1Card.classList.remove('active');
    }
}

// Assessing the board state
function evaluateBoard(bState) {
    const b = [
        [bState[0], bState[1], bState[2]],
        [bState[3], bState[4], bState[5]],
        [bState[6], bState[7], bState[8]]
    ];

    // Checking Rows
    for (let row = 0; row < 3; row++) {
        if (b[row][0] !== '' && b[row][0] === b[row][1] && b[row][1] === b[row][2]) {
            return b[row][0] === 'x' ? 10 : -10;
        }
    }

    // Checking Columns
    for (let col = 0; col < 3; col++) {
        if (b[0][col] !== '' && b[0][col] === b[1][col] && b[1][col] === b[2][col]) {
            return b[0][col] === 'x' ? 10 : -10;
        }
    }

    // Checking Diagonals
    if (b[0][0] !== '' && b[0][0] === b[1][1] && b[1][1] === b[2][2]) {
        return b[0][0] === 'x' ? 10 : -10;
    }
    if (b[0][2] !== '' && b[0][2] === b[1][1] && b[1][1] === b[2][0]) {
        return b[0][2] === 'x' ? 10 : -10;
    }

    return 0; // No winner
}

// AI Minimax logic ('o' tries to minimize the evaluation score)
function minimax(boardState, depth, isMaximizing) {
    let result = evaluateBoard(boardState);
    if (result === 10) return 10 - depth; // Prefer winning faster for X
    if (result === -10) return -10 + depth; // Prefer winning faster for O

    if (!boardState.includes('')) return 0; // Draw

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'x';
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'o';
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getBestMove() {
    let bestScore = Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'o';
            let score = minimax(board, 0, true);
            board[i] = '';
            if (score < bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function makeAIMove() {
    aiTimeoutId = null;
    if (!running) return;

    let moveIndex;
    if (gameMode === 'AI-Easy') {
        const available = [];
        board.forEach((cell, idx) => { if (cell === '') available.push(idx); });
        if (available.length > 0) {
            moveIndex = available[Math.floor(Math.random() * available.length)];
        }
    } else if (gameMode === 'AI-Hard') {
        moveIndex = getBestMove();
    }

    if (moveIndex !== undefined && board[moveIndex] === '') {
        const cell = document.querySelector(`.cell[data-index="${moveIndex}"]`);
        updateCell(cell, moveIndex);
        isAITurn = false;
        checkWinner();
    }
}


const LINE_COORDINATES = [
    { x1: 18.5, y1: 18.5, x2: 81.5, y2: 18.5 }, // Row 0
    { x1: 18.5, y1: 50,   x2: 81.5, y2: 50 },   // Row 1
    { x1: 18.5, y1: 81.5, x2: 81.5, y2: 81.5 }, // Row 2
    { x1: 18.5, y1: 18.5, x2: 18.5, y2: 81.5 }, // Col 0
    { x1: 50,   y1: 18.5, x2: 50,   y2: 81.5 }, // Col 1
    { x1: 81.5, y1: 18.5, x2: 81.5, y2: 81.5 }, // Col 2
    { x1: 18.5, y1: 18.5, x2: 81.5, y2: 81.5 }, // Diagonal 1
    { x1: 81.5, y1: 18.5, x2: 18.5, y2: 81.5 }  // Diagonal 2
];

function highlightWinningLine(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (let idx = 0; idx < winningCombinations.length; idx++) {
        const [a, b, c] = winningCombinations[idx];
        if (board[a] === player && board[b] === player && board[c] === player) {
            const coords = LINE_COORDINATES[idx];
            const winningLine = document.getElementById('winning-line');
            
            winningLine.setAttribute('x1', coords.x1);
            winningLine.setAttribute('y1', coords.y1);
            winningLine.setAttribute('x2', coords.x2);
            winningLine.setAttribute('y2', coords.y2);
            
            const strokeColor = player === 'x' ? '#e74c3c' : '#3498db';
            winningLine.setAttribute('stroke', strokeColor);
            winningLine.classList.add('active');
            break;
        }
    }
}

function checkWinner() {
    const val = evaluateBoard(board);

    if (val === 10) {
        statusText.textContent = "Player 1 Wins!";
        p1Score += 1;
        updateScoreBoard();
        running = false;
        player1Card.classList.add('active');
        player2Card.classList.remove('active');
        highlightWinningLine('x');
        createConfetti();
    } else if (val === -10) {
        let winnerText = gameMode === 'PvP' ? "Player 2 Wins!" : "AI Wins!";
        statusText.textContent = winnerText;
        p2Score += 1;
        updateScoreBoard();
        running = false;
        player2Card.classList.add('active');
        player1Card.classList.remove('active');
        highlightWinningLine('o');
        createConfetti();
    } else if (!board.includes('')) {
        statusText.textContent = "It's a Draw!";
        running = false;
        player1Card.classList.remove('active');
        player2Card.classList.remove('active');
    } else {
        changePlayer();
    }
}

function updateScoreBoard() {
    player1ScoreEl.textContent = p1Score;
    player2ScoreEl.textContent = p2Score;
}

function resetScores() {
    p1Score = 0;
    p2Score = 0;
    updateScoreBoard();
}

function resetGame(fullReset = false) {
    if (aiTimeoutId) {
        clearTimeout(aiTimeoutId);
        aiTimeoutId = null;
    }

    if (fullReset) {
        p1Score = 0;
        p2Score = 0;
        updateScoreBoard();
    }

    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = (Math.random() < 0.5) ? 'x' : 'o';
    isAITurn = false;
    updateStatus();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x');
        cell.classList.remove('o');
    });

    const winningLine = document.getElementById('winning-line');
    winningLine.setAttribute('x1', '0');
    winningLine.setAttribute('y1', '0');
    winningLine.setAttribute('x2', '0');
    winningLine.setAttribute('y2', '0');
    winningLine.setAttribute('stroke', 'none');
    winningLine.classList.remove('active');
    running = true;
    updateActivePlayer();

    if (currentPlayer === 'o' && gameMode.startsWith('AI')) {
        isAITurn = true;
        aiTimeoutId = setTimeout(makeAIMove, 500);
    }
}

function createConfetti() {
    const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#ff6b81'];
    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.width = (Math.random() * 8 + 6) + 'px';
        particle.style.height = (Math.random() * 12 + 6) + 'px';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
        particle.style.animationDelay = (Math.random() * 0.8) + 's';
        document.body.appendChild(particle);

        setTimeout(() => particle.remove(), 5000);
    }
}
