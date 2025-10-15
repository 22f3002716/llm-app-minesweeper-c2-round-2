const GRID_SIZE = 8;
const NUM_MINES = 10;
let board = []; // 2D array to store cell objects { isMine: boolean, isRevealed: boolean, neighborCount: number, element: HTMLElement }

// Helper function to get cell coordinates from element ID
function getCoords(id) {
    const parts = id.split('-');
    return { row: parseInt(parts[1]), col: parseInt(parts[2]) };
}

// Function to initialize the board
function initializeBoard() {
    // Create empty board
    for (let r = 0; r < GRID_SIZE; r++) {
        board[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            board[r][c] = {
                isMine: false,
                isRevealed: false,
                neighborCount: 0,
                element: null // Will store reference to the DOM element
            };
        }
    }

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);
        if (!board[r][c].isMine) {
            board[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate neighbor counts
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (!board[r][c].isMine) {
                board[r][c].neighborCount = window.countNeighbors(r, c); // Using window.countNeighbors for verification check
            }
        }
    }
}

// Function to count neighbors (exposed globally for verification)
window.countNeighbors = function(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue; // Skip self

            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow >= 0 && newRow < GRID_SIZE &&
                newCol >= 0 && newCol < GRID_SIZE &&
                board[newRow][newCol].isMine) {
                count++;
            }
        }
    }
    return count;
};

// Function to reveal a cell
function revealCell(row, col) {
    const cell = board[row][col];
    if (cell.isRevealed) return; // Already revealed

    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.isMine) {
        cell.element.classList.add('mine');
        cell.element.querySelector('.cell-content').textContent = '💣';
    } else {
        if (cell.neighborCount > 0) {
            cell.element.querySelector('.cell-content').textContent = cell.neighborCount;
            cell.element.classList.add(`count-${cell.neighborCount}`); // Add class for color styling
        } else {
            // If neighbor count is 0, reveal adjacent cells (flood fill)
            cell.element.querySelector('.cell-content').textContent = ''; // Empty for 0 count
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;

                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (newRow >= 0 && newRow < GRID_SIZE &&
                        newCol >= 0 && newCol < GRID_SIZE) {
                        revealCell(newRow, newCol); // Recursively reveal neighbors
                    }
                }
            }
        }
    }
}

// Event listener for cell clicks
function handleCellClick(event) {
    // Ensure we are clicking on the cell div itself, not its child span
    const cellElement = event.target.closest('.cell');
    if (!cellElement || cellElement.classList.contains('revealed')) {
        return; // Do nothing if not a cell or already revealed
    }
    const { row, col } = getCoords(cellElement.id);
    revealCell(row, col);
}

// Function to create the grid in the DOM
function createGridElements() {
    const gridContainer = document.getElementById('minesweeper-grid');
    gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cellElement = document.createElement('div');
            cellElement.id = `cell-${r}-${c}`;
            cellElement.classList.add('cell');
            cellElement.addEventListener('click', handleCellClick);

            const span = document.createElement('span');
            span.classList.add('cell-content'); // Initially hidden by CSS
            cellElement.appendChild(span);

            board[r][c].element = cellElement; // Store reference
            gridContainer.appendChild(cellElement);
        }
    }
}

// Initialize game on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeBoard();
    createGridElements();
});
