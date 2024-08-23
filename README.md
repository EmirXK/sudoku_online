# Sudoku Online Game

Welcome to the Sudoku Online Game! This project is a web-based Sudoku game that allows users to play Sudoku puzzles of various difficulty levels. The game features puzzle generation, validation, and solving functionalities.



<p align="center">
  <img src="https://github.com/user-attachments/assets/c87066ae-0f2a-4c70-b1f7-60c800be017a" alt="Alt text" width="600" style="border: 2px solid black;"/>
</p>



## Live Demo

You can try the game online at <a href="https://emirxk.github.io/sudoku_online" target="_blank" rel="noopener">Sudoku Online</a>

## Features

- **Generate Sudoku Puzzle:** Create a new Sudoku puzzle with selectable difficulty levels: Easy, Medium, Hard, and Expert.
- **Restart Puzzle:** Reset the current puzzle to its original state.
- **Give Up:** Automatically solve the puzzle and reveal the solution.
- **Check Solution:** Validate the current puzzle solution and highlight any mistakes.
- **Responsive Design:** The game interface is designed to be user-friendly and responsive.
- **No Guessing Required:** The solving algorithms used guarantee that a logically solvable design is generated.

## Files

### `index.html`

The main HTML file that structures the Sudoku game interface. It includes:
- A dropdown to select difficulty.
- Buttons to generate a new puzzle, restart the current puzzle, give up, and check the solution.
- A table to display the Sudoku board.

### `style.css`

The CSS file that styles the Sudoku game board and interface elements. It defines:
- Basic layout and font settings.
- Styles for the Sudoku table and cells.
- Highlighting for invalid entries.
- Vibrant design features including button-disabling logic.

### `human_solver.js`

The JavaScript file that handles the game logic, including:
- Generating a logically solvable Sudoku puzzle based on selected difficulty.
- Restarting the puzzle and handling user inputs.
- Solving the puzzle and validating the solution.
- Functions to shuffle and remove numbers to create puzzles with unique solutions.

## How to Run

1. Clone the repository:
    ```bash
    git clone https://github.com/emirxk/sudoku_online.git
    ```

2. Navigate to the project directory:
    ```bash
    cd sudoku_online
    ```

3. Open `index.html` in your web browser to start playing.

## Contributing

Feel free to contribute to this project by:
- Opening issues for bugs or feature requests.
- Submitting pull requests with improvements or fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Sudoku generation and solving logic inspired by various Sudoku algorithms.
- UI design inspired by common web-based Sudoku games.
- Huge thanks to [cagdas-karatas](https://github.com/cagdas-karatas) for contributing to the project.

## Contact

For any questions or feedback, please reach out to [emirxk](https://github.com/emirxk) on GitHub.

