const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, resetBoard };
})();

const Player = (name, symbol) => ({
  name,
  symbol,
});

const ComputerPlayer = () => ({
  name: "Computer",
  symbol: "O",
});

const GameController = (() => {
  let currentPlayer;
  let opponentPlayer;
  let isGameActive = true;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? opponentPlayer : player1;
  };

  const checkForWin = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        Gameboard.getBoard()[a] !== "" &&
        Gameboard.getBoard()[a] === Gameboard.getBoard()[b] &&
        Gameboard.getBoard()[a] === Gameboard.getBoard()[c]
      ) {
        isGameActive = false;
        DisplayController.updateResults(`${currentPlayer.name} wins!`);
        return;
      }
    }
  };

  const checkForTie = () => {
    if (!Gameboard.getBoard().includes("") && isGameActive) {
      isGameActive = false;
      DisplayController.updateResults("It's a tie!");
    }
  };

  const handleCellClick = (cellIndex) => {
    if (
      !isGameActive ||
      Gameboard.getBoard()[cellIndex] !== "" ||
      currentPlayer === opponentPlayer
    ) {
      return;
    }

    Gameboard.getBoard()[cellIndex] = currentPlayer.symbol;
    DisplayController.renderBoard();
    checkForWin();
    checkForTie();
    switchPlayer();

    if (currentPlayer === opponentPlayer && isGameActive) {
      setTimeout(() => computerMove(), 500); // Delay for computer move
    }
  };

  const computerMove = () => {
    const emptyCells = Gameboard.getBoard().reduce((acc, cell, index) => {
      if (cell === "") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const computerMoveIndex = emptyCells[randomIndex];
      Gameboard.getBoard()[computerMoveIndex] = opponentPlayer.symbol;
      DisplayController.renderBoard();
      checkForWin();
      checkForTie();
      switchPlayer();
    }
  };

  const startNewGame = () => {
    isGameActive = true;
    Gameboard.resetBoard();
    currentPlayer = player1;
    opponentPlayer = player2;
    DisplayController.renderBoard();
  };

  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  return { startNewGame, handleCellClick };
})();

const DisplayController = (() => {
  const gameContainer = document.getElementById("game-container");
  const resultDisplay = document.createElement("div");
  resultDisplay.classList.add("result");

  const renderBoard = () => {
    gameContainer.innerHTML = "";
    Gameboard.getBoard().forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      cellElement.addEventListener("click", () =>
        GameController.handleCellClick(index)
      );
      gameContainer.appendChild(cellElement);
    });

    if (!gameContainer.contains(resultDisplay)) {
      gameContainer.appendChild(resultDisplay);
    }
  };

  const updateResults = (result) => {
    resultDisplay.textContent = result;
    if (!GameController.isGameActive) {
      renderPlayAgainButton();
    }
  };

  const renderPlayAgainButton = () => {
    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    playAgainButton.addEventListener("click", () =>
      GameController.startNewGame()
    );
    gameContainer.appendChild(playAgainButton);
  };

  return { renderBoard, updateResults };
})();

document.addEventListener("DOMContentLoaded", () => {
  GameController.startNewGame();
});
