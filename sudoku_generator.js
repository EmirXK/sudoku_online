import { sudokuSolver, isValid } from './sudoku_solver.js';

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

export { generateSudoku, blankSpaces, removeNumbers, isUniqueSolution, solveWithCounter };
