let initialBoard = [];

document.getElementById('generate').addEventListener('click', generateSudoku);
document.getElementById('restart').addEventListener('click', restartPuzzle);
document.getElementById('giveUp').addEventListener('click', giveUp);
document.getElementById('checkSolution').addEventListener('click', checkSolution);

function generateSudoku() {
    const difficulty = document.getElementById('difficulty').value;
    
    // Simulated board data for demonstration
    const data = {
        board: [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ]
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
    const solvedBoard = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2],
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1],
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];

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
