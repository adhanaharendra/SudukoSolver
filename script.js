window.onload = createBoard;

function createBoard() {
  const board = document.getElementById("sudoku-board");
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("input");
    cell.setAttribute("maxlength", "1");
    cell.setAttribute("type", "number");
    cell.dataset.index = i;
    cell.addEventListener("keydown", handleKeyNavigation);
    board.appendChild(cell);
  }
}

function handleKeyNavigation(event) {
  if (event.key === " ") {
    event.preventDefault(); // Prevent spacebar scrolling
    const currentIndex = parseInt(this.dataset.index);
    moveToNextCell(currentIndex);
  }
}

function moveToNextCell(currentIndex) {
  const totalCells = 81;
  const nextIndex = (currentIndex + 1) % totalCells;
  document.querySelector(`[data-index="${nextIndex}"]`).focus();
}

function getBoardValues() {
  const cells = document.querySelectorAll("#sudoku-board input");
  const board = [];
  cells.forEach((cell, index) => {
    if (index % 9 === 0) board.push([]);
    board[Math.floor(index / 9)].push(parseInt(cell.value) || 0);
  });
  return board;
}

function setBoardValues(board) {
  const cells = document.querySelectorAll("#sudoku-board input");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    cell.value = board[row][col] === 0 ? "" : board[row][col];
  });
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num || 
        board[3 * Math.floor(row / 3) + Math.floor(i / 3)]
        [3 * Math.floor(col / 3) + (i % 3)] === num) {
      return false;
    }
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function solveSudoku() {
  const board = getBoardValues();
  if (solve(board)) {
    setBoardValues(board);
    alert("Sudoku solved!");
  } else {
    alert("No solution found.");
  }
}
