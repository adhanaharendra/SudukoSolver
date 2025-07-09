window.onload = createBoard;

function createBoard() {
  const board = document.getElementById("sudoku-board");
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("input");
    cell.setAttribute("maxlength", "1");
    cell.setAttribute("type", "number");
    cell.setAttribute("min", "1");
    cell.setAttribute("max", "9");
    cell.dataset.index = i;
    cell.addEventListener("keydown", handleKeyNavigation);
    cell.addEventListener("input", validateInput);
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

function validateInput(event) {
  const value = event.target.value;
  const num = parseInt(value);

  if (value === "") return; // Allow empty input

  if (isNaN(num) || num < 1 || num > 9) {
    event.target.value = ""; // Clear invalid input
    alert("Please enter a number between 1 and 9 only.");
  }
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

function clearBoard() {
  const cells = document.querySelectorAll("#sudoku-board input");
  cells.forEach(cell => cell.value = "");
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (
      board[row][i] === num || 
      board[i][col] === num || 
      board[3 * Math.floor(row / 3) + Math.floor(i / 3)]
           [3 * Math.floor(col / 3) + (i % 3)] === num
    ) {
      return false;
    }
  }
  return true;
}

function isInitialBoardValid(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0) {
        board[row][col] = 0; // Temporarily remove to check validity
        if (!isValid(board, row, col, num)) {
          return false;
        }
        board[row][col] = num; // Restore value
      }
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

  if (!isInitialBoardValid(board)) {
    clearBoard();
    alert("Invalid entries detected! Board has conflicting numbers.");
    return;
  }

  if (solve(board)) {
    setBoardValues(board);
    alert("Sudoku solved!");
  } else {
    alert("No solution found.");
  }
}
