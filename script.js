/* ===== script.js =====  */
window.onload = createBoard;

let timerInterval = null;
let startTime = null;

function createBoard() {
  const board = document.getElementById("sudoku-board");
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement("input");
    cell.setAttribute("maxlength", "1");
    cell.setAttribute("type", "number");
    cell.setAttribute("min", "1");
    cell.setAttribute("max", "9");
    cell.dataset.index = i;

    const row = Math.floor(i / 9);
    const col = i % 9;
    if (row % 3 === 0) cell.classList.add("top-border");
    if (row === 8) cell.classList.add("bottom-border");
    if (col % 3 === 0) cell.classList.add("left-border");
    if (col === 8) cell.classList.add("right-border");

    cell.addEventListener("keydown", handleKeyNavigation);
    cell.addEventListener("input", validateInput);
    board.appendChild(cell);
  }
  resetTimer();
}

function handleKeyNavigation(event) {
  if (event.key === " ") {
    event.preventDefault();
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

  if (value === "") return;

  if (isNaN(num) || num < 1 || num > 9) {
    event.target.value = "";
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
  cells.forEach(cell => {
    cell.value = "";
    cell.readOnly = false;
    cell.style.color = "";
  });
  resetTimer();
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
        board[row][col] = 0;
        if (!isValid(board, row, col, num)) {
          return false;
        }
        board[row][col] = num;
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
    resetTimer();
    alert("Sudoku solved!");
  } else {
    alert("No solution found.");
  }
}

function generatePuzzle() {
  clearBoard();

  const clueCount = parseInt(document.getElementById("difficulty").value);
  const cellsToRemove = 81 - clueCount;

  let board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(board);

  let removed = 0;
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (board[row][col] !== 0) {
      board[row][col] = 0;
      removed++;
    }
  }

  setBoardValues(board);

  const cells = document.querySelectorAll("#sudoku-board input");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    if (board[row][col] !== 0) {
      cell.readOnly = true;
      cell.style.color = "blue";
    } else {
      cell.readOnly = false;
      cell.style.color = "";
    }
  });

  resetTimer();
  startTimer();
}

function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `Time: ${minutes}:${seconds}`;
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById('timer').textContent = 'Time: 00:00';
}
