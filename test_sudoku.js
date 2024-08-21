import { generateSudoku, blankSpaces } from './sudoku_generator.js';

function printBoard(board) {
    for (let i = 0; i < board.length; i++) {
        let row = '';
        for (let j = 0; j < board[i].length; j++) {
            row += board[i][j] + ' ';
        }
        console.log(row.trim());
    }
}

function testSudokuGeneration() {
    const difficultyLevels = ['easy', 'medium', 'hard', 'expert'];

    difficultyLevels.forEach(level => {
        console.log(`\nGenerating Sudoku with difficulty: ${level}`);
        const board = generateSudoku(level);
        printBoard(board);
        console.log(`Blank spaces: ${blankSpaces(board)}\n`);
    });
}

// Run the test
testSudokuGeneration();
