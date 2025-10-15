# Minesweeper Web Application

This is a simple single-page web application implementing the classic game of Minesweeper.

## Features

*   **8x8 Grid**: A standard grid size for quick gameplay.
*   **10 Randomly Placed Mines**: Mines are distributed randomly at the start of each game.
*   **Reveal Cells**: Click on a square to reveal its content.
*   **Neighbor Count Logic**: Non-mine squares display the number of adjacent mines (0-8).
*   **Automatic Empty Cell Revelation**: Clicking on an empty square (with 0 adjacent mines) automatically reveals all contiguous empty squares and their numbered neighbors.
*   **Basic Styling**: Clear visual distinction between unrevealed, revealed, and mine squares.

## How to Play

1.  Open `index.html` in your web browser.
2.  The 8x8 grid will appear with all squares hidden.
3.  Click on any square to reveal it:
    *   If it's a mine (💣), the game visually indicates a mine was hit.
    *   If it's a non-mine square, it will reveal a number indicating how many mines are adjacent to it.
    *   If the number is 0, all adjacent squares (including their neighbors if they are also 0) will automatically be revealed.

## Technical Details

*   **HTML (index.html)**: Provides the basic structure of the web page and the container for the game grid.
*   **CSS (style.css)**: Handles the visual presentation, including grid layout, cell styling, and visual cues for revealed cells and mine counts.
*   **JavaScript (script.js)**: Implements the core game logic:
    *   Board initialization and mine placement.
    *   Calculation of adjacent mine counts.
    *   Event handling for cell clicks.
    *   Recursive revelation of empty cells (`flood fill` algorithm).
