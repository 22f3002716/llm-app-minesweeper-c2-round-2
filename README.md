# Minesweeper Game

This is a simple 8x8 Minesweeper game implemented as a single-page web application.

## How to Play

1.  **Objective:** Reveal all the squares that do not contain mines.
2.  **Clicking a Square:**
    *   If you click on a square with a mine (💣), the game ends.
    *   If you click on an empty square (no adjacent mines), it will reveal itself and automatically clear all adjacent empty squares until it hits squares with numbers.
    *   If you click on a numbered square, it will reveal the number, indicating how many mines are adjacent to it (horizontally, vertically, and diagonally).
3.  **Winning:** The game is won when all non-mine squares are revealed.

## Features

*   8x8 grid with 10 randomly placed mines.
*   Click to reveal squares.
*   Automatic neighbor count display.
*   Flood-fill reveal for empty squares.
*   Game over condition on hitting a mine.
*   Win condition when all safe squares are revealed.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript (ES6+)
