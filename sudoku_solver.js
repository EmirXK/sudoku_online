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

export { sudokuSolver, isValid }