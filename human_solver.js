const size = 9;
const subgridSize = 3;
let initialBoard = [];

document.getElementById('generate').addEventListener('click', generateSudokuButtonClicked);
document.getElementById('restart').addEventListener('click', restartPuzzle);
document.getElementById('giveUp').addEventListener('click', giveUp);
document.getElementById('checkSolution').addEventListener('click', checkSolution);
const boardWrapper = document.querySelector(".board-wrapper");
const checkSolutionButton = document.querySelector("#checkSolution");
const restartButton = document.querySelector("#restart");
const giveUpButton = document.querySelector("#giveUp");

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.backgroundColor = "var(--color3)"; // Active state
    });
    
    button.addEventListener('mouseup', () => {
        button.style.backgroundColor = "var(--color2)"; // Normal state
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = "var(--color2)"; // Revert if mouse leaves button
    });
});


function generateSudokuButtonClicked() {
    showButtons();
    enableCheckSolutionButton();
    boardWrapper.style = "display: flex;";
    console.log("generate called");
    const difficulty = document.getElementById('difficulty').value;
    
    // Simulated board data for demonstration
    const data = {
        board: generateHumanSolvablePuzzle(difficulty)
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
            cellInput.type = 'text'; // Change type to 'text'
            cellInput.maxLength = 1; // Limit to 1 character
            cellInput.id = `cell-${i}-${j}`;
            cellInput.value = board[i][j] !== 0 ? board[i][j] : '';
            cellInput.readOnly = board[i][j] !== 0;
            cellInput.classList.remove('invalid');

            // Restrict input to single digits only
            cellInput.addEventListener('input', function() {
                let value = this.value;
                if (!/^[1-9]$/.test(value)) {
                    this.value = ''; // Clear invalid input
                }
            });

            cell.appendChild(cellInput);
            row.appendChild(cell);
        }
        boardTable.appendChild(row);
    }
}

function giveUp() {
    console.log("give up called");
    restartPuzzle();
    disableCheckSolutionButton();
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
    solve(board)

    console.log(prettyPrint(board))

    board.forEach((row, i) => {
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
    enableCheckSolutionButton();
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

function isValid(board, num, row, col) {
    // Check if the number is in the given row or column
    for (let i = 0; i < size; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    // Check if the number is in the subgrid
    const startRow = Math.floor(row / subgridSize) * subgridSize;
    const startCol = Math.floor(col / subgridSize) * subgridSize;
    for (let i = 0; i < subgridSize; i++) {
        for (let j = 0; j < subgridSize; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

function findEmptyCell(board) {
    // Find an empty cell (represented by 0)
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

function isSolved(board) {
    return findEmptyCell(board) === null;
}

function eliminate(board) {
    // Eliminate candidates using the "Single Possibility" technique
    let progress = false;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 0) {
                const candidates = [];
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, num, row, col)) {
                        candidates.push(num);
                    }
                }
                if (candidates.length === 1) {
                    board[row][col] = candidates[0];
                    progress = true;
                }
            }
        }
    }
    return progress;
}

function onlyChoice(board) {
    // Fill cells using the "Only Choice" technique
    let progress = false;
    for (let num = 1; num <= 9; num++) {
        for (let row = 0; row < size; row++) {
            const candidates = [];
            for (let col = 0; col < size; col++) {
                if (board[row][col] === 0 && isValid(board, num, row, col)) {
                    candidates.push(col);
                }
            }
            if (candidates.length === 1) {
                board[row][candidates[0]] = num;
                progress = true;
            }
        }

        for (let col = 0; col < size; col++) {
            const candidates = [];
            for (let row = 0; row < size; row++) {
                if (board[row][col] === 0 && isValid(board, num, row, col)) {
                    candidates.push(row);
                }
            }
            if (candidates.length === 1) {
                board[candidates[0]][col] = num;
                progress = true;
            }
        }

        for (let boxRow = 0; boxRow < size; boxRow += subgridSize) {
            for (let boxCol = 0; boxCol < size; boxCol += subgridSize) {
                const candidates = [];
                for (let i = 0; i < subgridSize; i++) {
                    for (let j = 0; j < subgridSize; j++) {
                        const row = boxRow + i;
                        const col = boxCol + j;
                        if (board[row][col] === 0 && isValid(board, num, row, col)) {
                            candidates.push([row, col]);
                        }
                    }
                }
                if (candidates.length === 1) {
                    const [row, col] = candidates[0];
                    board[row][col] = num;
                    progress = true;
                }
            }
        }
    }
    return progress;
}

function nakedPairs(board) {
    // Implement the Naked Pairs technique
    let progress = false;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 0) {
                const candidates = [];
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, num, row, col)) {
                        candidates.push(num);
                    }
                }
                if (candidates.length === 2) {
                    for (let otherCol = col + 1; otherCol < size; otherCol++) {
                        if (board[row][otherCol] === 0) {
                            const otherCandidates = [];
                            for (let num = 1; num <= 9; num++) {
                                if (isValid(board, num, row, otherCol)) {
                                    otherCandidates.push(num);
                                }
                            }
                            if (JSON.stringify(candidates) === JSON.stringify(otherCandidates)) {
                                for (let i = 0; i < size; i++) {
                                    if (i !== col && i !== otherCol && board[row][i] === 0) {
                                        for (const num of candidates) {
                                            if (isValid(board, num, row, i)) {
                                                progress = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return progress;
}

function solveLogically(board) {
    while (!isSolved(board)) {
        if (!eliminate(board) && !onlyChoice(board) && !nakedPairs(board)) {
            break;
        }
    }
    return board;
}

// Helper function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Generate a fully solved Sudoku board
function generateSolvedBoard() {
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    solve(board);
    return board;
}

// Solve the Sudoku board using backtracking
function solve(board) {
    const cell = findEmptyCell(board);
    if (!cell) return true;

    const [row, col] = cell;
    const numbers = shuffle([...Array(size).keys()].map(x => x + 1)); // Shuffle numbers 1-9

    for (const num of numbers) {
        if (isValid(board, num, row, col)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
        }
    }

    return false;
}

// Remove numbers to create a puzzle
function removeNumbers(board, difficulty) {
    let attempts = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 35 : difficulty === 'hard' ? 40 : 45;
    const puzzle = board.map(row => row.slice());

    while (attempts > 0) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        if (puzzle[row][col] === 0) continue;

        const backup = puzzle[row][col];
        puzzle[row][col] = 0;

        const copy = puzzle.map(row => row.slice());
        if (countSolutions(copy) !== 1) {
            puzzle[row][col] = backup;
        } else {
            attempts--;
        }
    }

    return puzzle;
}

// Find all solutions (used to check for uniqueness)
function countSolutions(board) {
    const cell = findEmptyCell(board);
    if (!cell) return 1;

    const [row, col] = cell;
    let count = 0;

    for (let num = 1; num <= size; num++) {
        if (isValid(board, num, row, col)) {
            board[row][col] = num;
            count += countSolutions(board);
            if (count > 1) break; // Early exit if more than one solution is found
            board[row][col] = 0;
        }
    }

    return count;
}

function deepCopy(board) {
    return board.map(row => row.slice());
}

function solveWithLogic(board) {
    let progress;
    do {
        progress = false;
        progress = eliminate(board) || progress;
        progress = onlyChoice(board) || progress;
        progress = nakedPairs(board) || progress;
    } while (progress);

    return isSolved(board); // Return true if the puzzle is fully solved by logic
}

function generateHumanSolvablePuzzle(difficulty) {
    let puzzle;
    do {
        const solvedBoard = generateSolvedBoard();
        puzzle = removeNumbers(solvedBoard, difficulty);

        // Create a deep copy of the puzzle for the logical solver
        const puzzleCopy = deepCopy(puzzle);

        // Check if the puzzle can be solved using logic alone
        if (!solveWithLogic(puzzleCopy)) {
            puzzle = null; // Regenerate if not solvable by logic
        }
    } while (!puzzle);

    return puzzle;
}


function prettyPrint(board) {
    const size = board.length;
    const subgridSize = Math.sqrt(size);
    let output = '';

    for (let row = 0; row < size; row++) {
        if (row % subgridSize === 0 && row !== 0) {
            output += '-'.repeat(size * 2 + subgridSize - 1) + '\n';
        }
        for (let col = 0; col < size; col++) {
            if (col % subgridSize === 0 && col !== 0) {
                output += '| ';
            }
            output += board[row][col] === 0 ? '.' : board[row][col];
            output += ' ';
        }
        output += '\n';
    }

    console.log(output);
}

function enableCheckSolutionButton()
{
    checkSolutionButton.setAttribute("style", "display: inline; cursor: pointer; background-color: #0B8494; pointer-events: all;");
}

function disableCheckSolutionButton()
{
    checkSolutionButton.setAttribute("style", "display: inline; cursor: default; background-color: gray; pointer-events: none;");
}

function showButtons()
{
    restartButton.setAttribute("style", "display: inline;");
    giveUpButton.setAttribute("style", "display: inline;");
}