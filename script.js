let initialBoard = [];

document.getElementById('generate').addEventListener('click', generateSudoku2);
document.getElementById('restart').addEventListener('click', restartPuzzle);
document.getElementById('giveUp').addEventListener('click', giveUp);
document.getElementById('checkSolution').addEventListener('click', checkSolution);

function generateSudoku2() {
    console.log("generate called");
    const difficulty = document.getElementById('difficulty').value;
    
    // Simulated board data for demonstration
    const data = {
        board: generateSudoku(difficulty)
    };
    const board = data.board;

    initialBoard = JSON.parse(JSON.stringify(board));

    const boardTable = document.getElementById('sudoku-board');
    boardTable.innerHTML = '';

    const statusLabel = document.getElementById('status-label');
    statusLabel.textContent = '';

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const cellInput = document.createElement('input');
            cellInput.type = 'text';
            cellInput.maxLength = 1;
            cellInput.id = `cell-${i}-${j}`;
            cellInput.value = board[i][j] !== 0 ? board[i][j] : '';
            cellInput.readOnly = board[i][j] !== 0;
            cellInput.classList.remove('invalid');
            cell.appendChild(cellInput);
            row.appendChild(cell);
        }
        boardTable.appendChild(row);
    }
}

function giveUp() {
    restartPuzzle();
    const board = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            row.push(cell.value === '' ? 0 : parseInt(cell.value));
        }
        board.push(row);
    }

    // Simulated solved board for demonstration
    const solvedBoard = sudokuSolver(board);

    solvedBoard.forEach((row, i) => {
        row.forEach((cell, j) => {
            const cellInput = document.getElementById(`cell-${i}-${j}`);
            cellInput.value = cell !== 0 ? cell : '';
        });
    });
}

function checkSolution() {
    let valid = true;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const value = parseInt(cell.value);
            if (initialBoard[i][j] === 0) {
                if (value && !is_valid_value(i, j, value)) {
                    valid = false;
                    cell.classList.add('invalid');
                } else if (cell.readOnly === false) {
                    cell.classList.remove('invalid');
                }
            }
        }
    }

    const statusLabel = document.getElementById('status-label');
    if (valid && allCellsFilled()) {
        statusLabel.textContent = "Congratulations! You solved the Sudoku.";
        statusLabel.style.color = "green";
    } else {
        statusLabel.textContent = "There are some mistakes in your solution. Please try again.";
        statusLabel.style.color = "red";
    }
}

function allCellsFilled() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            if (cell.value === '') {
                return false;
            }
        }
    }
    return true;
}

function is_valid_value(i, j, val) {
    const board = [];
    for (let x = 0; x < 9; x++) {
        const row = [];
        for (let y = 0; y < 9; y++) {
            const cell = document.getElementById(`cell-${x}-${y}`);
            row.push(cell.value === '' ? 0 : parseInt(cell.value));
        }
        board.push(row);
    }

    // Check row and column
    for (let k = 0; k < 9; k++) {
        if ((board[i][k] === val && k !== j) || (board[k][j] === val && k !== i)) {
            return false;
        }
    }

    // Check 3x3 block
    const rowStart = Math.floor(i / 3) * 3;
    const colStart = Math.floor(j / 3) * 3;

    for (let x = rowStart; x < rowStart + 3; x++) {
        for (let y = colStart; y < colStart + 3; y++) {
            if (board[x][y] === val && (x !== i || y !== j)) {
                return false;
            }
        }
    }

    return true;
}

function restartPuzzle() {
    const statusLabel = document.getElementById('status-label');
    statusLabel.textContent = '';

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cellInput = document.getElementById(`cell-${i}-${j}`);
            cellInput.value = initialBoard[i][j] !== 0 ? initialBoard[i][j] : '';
            cellInput.readOnly = initialBoard[i][j] !== 0;
            cellInput.classList.remove('invalid');
        }
    }
}



// solve

function sudokuSolver(board) {
    solveRecursive(board);
    return board;
}

function solveRecursive(board) {
    // iterate the whole matrix
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            // check if empty (in our case empty = 0)
            if (board[i][j] === 0) {
                // iterate possible values
                let numbers = Array.from({ length: 9 }, (_, k) => k + 1);
                shuffle(numbers);
                for (let val of numbers) {
                    if (isValid(board, i, j, val)) {
                        board[i][j] = val;
                        if (solveRecursive(board)) {
                            return true;
                        } else {
                            // backtrack
                            board[i][j] = 0;
                        }
                    }
                }
                // if for loop ends with no valid values
                return false;
            }
        }
    }
    // if we reach the end of the matrix with no issues
    return true;
}

function isValid(board, i, j, val) {
    // check rows and cols
    for (let x = 0; x < board.length; x++) {
        if (board[i][x] === val || board[x][j] === val) {
            return false;
        }
    }

    // check 3x3 area
    let row = Math.floor(i / 3) * 3;
    let col = Math.floor(j / 3) * 3;

    for (let x = row; x < row + 3; x++) {
        for (let y = col; y < col + 3; y++) {
            if (board[x][y] === val) {
                return false;
            }
        }
    }

    // is valid
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



// generate

function removeNumbers(board, attempts) {
    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        while (board[row][col] === 0) {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        }
        const backup = board[row][col];
        board[row][col] = 0;

        // make a copy of the board to test uniqueness
        const boardCopy = board.map(row => row.slice());
        if (!isUniqueSolution(boardCopy)) {
            board[row][col] = backup;
            attempts -= 1;
        }
    }
}

function isUniqueSolution(board) {
    // use a counter to keep track of the number of solutions
    const solutions = [0];
    solveWithCounter(board, solutions);
    return solutions[0] === 1;
}

function solveWithCounter(board, solutions) {
    // solve the board again and keep track of the number of solutions
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                for (let val = 1; val <= 9; val++) {
                    if (isValid(board, i, j, val)) {
                        board[i][j] = val;
                        solveWithCounter(board, solutions);
                        board[i][j] = 0;

                        if (solutions[0] > 1) {
                            return;
                        }
                    }
                }
                return;
            }
        }
    }
    solutions[0] += 1;
}

function generateSudoku(difficulty = 'medium') {
    // generate a fully solved board
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    board = sudokuSolver(board);

    // define the number of attempts based on difficulty
    let attempts;
    switch (difficulty) {
        case 'easy':
            attempts = 2; // a lot of clues
            break;
        case 'medium':
            attempts = 5;
            break;
        case 'hard':
            attempts = 8;
            break;
        case 'expert':
            attempts = 11; // very few clues
            break;
        default:
            attempts = 5;
    }

    // remove numbers to create the puzzle
    removeNumbers(board, attempts);

    return board;
}

function blankSpaces(board) {
    let count = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] === 0) {
                count += 1;
            }
        }
    }
    return count;
}