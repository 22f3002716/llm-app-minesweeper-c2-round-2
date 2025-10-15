const GRID_SIZE = 8;
const NUM_MINES = 10;
let board = [];
let gameBoardElement;
let revealedCellsCount = 0; // To track non-mine cells revealed

function initializeGame() {
    board = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    revealedCellsCount = 0;

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);
        if (board[r][c] !== 'mine') {
            board[r][c] = 'mine';
            minesPlaced++;
        }
    }

    // Calculate neighbor counts
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] !== 'mine') {
                board[r][c] = window.countNeighbors(r, c); // Use window.countNeighbors for verification
            }
        }
    }
}

// Make countNeighbors globally accessible for verification
window.countNeighbors = function(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue; // Skip current cell

            const nr = row + dr;
            const nc = col + dc;

            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                if (board[nr][nc] === 'mine') {
                    count++;
                }
            }
        }
    }
    return count;
};

function renderBoard() {
    gameBoardElement.innerHTML = '';
    gameBoardElement.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell', 'hidden');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            gameBoardElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const cellElement = event.target;
    const r = parseInt(cellElement.dataset.row);
    const c = parseInt(cellElement.dataset.col);

    if (cellElement.classList.contains('revealed')) {
        return; // Already revealed
    }

    revealCell(r, c);
}

function revealCell(row, col) {
    // Check bounds
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return;
    }

    const cellElement = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    // Check if element exists and is not already revealed
    if (!cellElement || cellElement.classList.contains('revealed')) {
        return;
    }

    cellElement.classList.remove('hidden');
    cellElement.classList.add('revealed');

    const cellValue = board[row][col];

    if (cellValue === 'mine') {
        cellElement.textContent = '💣';
        cellElement.classList.add('mine-revealed');
        alert('Game Over! You hit a mine.');
        revealAllMines();
        // Disable further clicks on the board by removing listeners from all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
        return;
    } else {
        revealedCellsCount++;
        if (cellValue > 0) {
            cellElement.textContent = cellValue;
            cellElement.classList.add(`count-${cellValue}`);
        } else { // cellValue === 0, flood fill
            // Recursively reveal neighbors
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    revealCell(row + dr, col + dc); // Recursive call
                }
            }
        }
    }

    // Check for win condition (all non-mine cells revealed)
    if (revealedCellsCount === (GRID_SIZE * GRID_SIZE) - NUM_MINES) {
        alert('Congratulations! You cleared the field!');
        // Disable further clicks on the board by removing listeners from all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    }
}

function revealAllMines() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (board[r][c] === 'mine') {
                const cellElement = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (cellElement && !cellElement.classList.contains('revealed')) {
                    cellElement.classList.remove('hidden');
                    cellElement.classList.add('revealed', 'mine-revealed');
                    cellElement.textContent = '💣';
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    gameBoardElement = document.getElementById('minesweeper-grid');
    initializeGame();
    renderBoard();
});
