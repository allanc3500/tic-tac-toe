const Gameboard = (function () {
  //Initialize rows, column, board array, and HTML elements.
  const rows = 3;
  const columns = 3;
  let board = [];
  const main = document.querySelector("main");
  const boardDiv = document.createElement("div");
  boardDiv.className = "boardDiv";

  //Function to loop and create a 2D array (3x3) and initialize them with blanks.
  //During the creation of the 2D array, make buttons to represent each of the
  //spaces in the tic tac toe board. Append each row of 3 to a div. And after the board
  //is created, append those buttonDivs to the boardDiv.
  const createBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      const buttonDiv = document.createElement("div");
      for (let j = 0; j < columns; j++) {
        board[i].push("_");
        const button = document.createElement("button");
        button.className = "gameButton";
        button.id = `${i}And${j}`;
        buttonDiv.appendChild(button);
      }
      boardDiv.appendChild(buttonDiv);
    }
    main.appendChild(boardDiv);
  };

  //Function to display the board
  const displayBoard = () => board;

  //Function to update the board. Return false if the space
  //is already taken.
  const updateBoard = (row, col, player) => {
    if (board[col][row] != "_") {
      return false;
    }
    board[col][row] = player;
    const button = document.getElementById(`${row}And${col}`);
    button.textContent = player;
    return true;
  };

  //Function to check for win conditions
  const checkWin = () => {
    if (
      board[2][2] == board[1][2] &&
      board[1][2] == board[0][2] &&
      board[0][2] != "_"
    ) {
      return true;
    } else if (
      board[0][1] == board[1][1] &&
      board[1][1] == board[2][1] &&
      board[2][1] != "_"
    ) {
      return true;
    } else if (
      board[0][0] == board[1][0] &&
      board[1][0] == board[2][0] &&
      board[2][0] != "_"
    ) {
      return true;
    } else if (
      board[0][0] == board[1][1] &&
      board[1][1] == board[2][2] &&
      board[2][2] != "_"
    ) {
      return true;
    } else if (
      board[0][2] == board[1][1] &&
      board[1][1] == board[2][0] &&
      board[2][0] != "_"
    ) {
      return true;
    } else if (
      board[0][0] == board[0][1] &&
      board[0][1] == board[0][2] &&
      board[0][2] != "_"
    ) {
      return true;
    } else if (
      board[1][0] == board[1][1] &&
      board[1][1] == board[1][2] &&
      board[1][2] != "_"
    ) {
      return true;
    } else if (
      board[2][0] == board[2][1] &&
      board[2][1] == board[2][2] &&
      board[2][2] != "_"
    ) {
      return true;
    }
  };

  //Function to check for tie conditions.
  const checkTie = () => {
    if (
      board[0][0] != "_" &&
      board[0][1] != "_" &&
      board[0][2] != "_" &&
      board[1][0] != "_" &&
      board[1][1] != "_" &&
      board[1][2] != "_" &&
      board[2][0] != "_" &&
      board[2][1] != "_" &&
      board[2][2] != "_"
    ) {
      return true;
    } else {
      return false;
    }
  };

  //Function to reset the board back so we don't have duplicate boards or
  //game data from the last game still remaining.
  const resetBoard = () => {
    boardDiv.innerHTML = "";
    board = [];
  };

  //Return functions you want exposed.
  return {
    createBoard,
    displayBoard,
    updateBoard,
    checkWin,
    resetBoard,
    checkTie,
  };
})();

function GameController(
  //Defaults each player name to Player One and Player Two
  //if arguments for GameController is empty
  playerOneName = "Player 1 Name",
  playerTwoName = "Player 2 Name"
) {
  //Set up game board
  const board = Gameboard;
  board.createBoard();

  //Create 2 player objects
  const players = [
    {
      name: playerOneName,
      token: "X",
    },
    {
      name: playerTwoName,
      token: "O",
    },
  ];

  //Active player is initialized to the first Player One
  let activePlayer = players[0];

  //Function that switch players. For example, if it was Player One's turn, switch players and Player 2 is now the active player
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    const turnDiv = document.getElementById("turn");
    turnDiv.textContent = `${activePlayer.name}'s turn`;
  };

  //Function that returns the current active player
  const getActivePlayer = () => activePlayer;

  const buttons = document.querySelectorAll(".gameButton");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      playRound(button.id.slice(0, 1), button.id.slice(4, 5));
    });
  });
  //Function to begin and play round. Takes in a row and column parameter.
  //Print out dropping player name's token into row and column.
  //Update board
  //Check to see if someone won.
  //If board.checkWin() is equal to You Win, log that player wins and return.
  //If not, then we switch players and it will be their turn that round.
  const playRound = (row, column) => {
    if (board.updateBoard(row, column, getActivePlayer().token) == false) {
      const turnDiv = document.querySelector("#turn");
      turnDiv.textContent = "Spot is already taken! Pick another one";
      return;
    }
    board.checkWin();
    if (board.checkWin() == true || board.checkTie() == true) {
      const gameOverModal = document.getElementById("gameOver");
      gameOverModal.style.display = "block";
      if (board.checkWin()) {
        const winnerText = document.querySelector(".winnerText");
        winnerText.textContent = `${getActivePlayer().name} wins! Play again?`;
      } else {
        const winnerText = document.querySelector(".winnerText");
        winnerText.textContent = `Tie Game! Play again?`;
      }
      const yes = document.getElementById("yesButton");
      const no = document.getElementById("noButton");
      yes.addEventListener("click", () => {
        board.resetBoard();
        GameController(playerOneName, playerTwoName);
        gameOverModal.style.display = "none";
        const turnDiv = document.getElementById("turn");
        turnDiv.textContent =
          document.querySelector("#player1").value + `'s turn`;
      });
      no.addEventListener("click", () => {
        board.resetBoard();
        gameOverModal.style.display = "none";
        const enterNameDialog = document.querySelector("#enterName");
        enterNameDialog.style.display = "block";
        const turnDiv = document.getElementById("turn");
        turnDiv.textContent = "Welcome to Tic Tac Toe";
      });
    }
    switchPlayerTurn();
  };

  //Only return and expose functions: playRound, getActivePlayer
  return {
    playRound,
    getActivePlayer,
  };
}

const startGame = (function () {
  const submitButton = document.querySelector("#submit");
  submitButton.addEventListener("click", () => {
    if (
      document.querySelector("#player1").value == "" &&
      document.querySelector("#player2").value == ""
    ) {
      document.querySelector("#player1").value = "Player 1 Name";
      document.querySelector("#player2").value = "Player 2 Name";
    } else if (document.querySelector("#player1").value == "") {
      document.querySelector("#player1").value = "Player 1 Name";
    } else if (document.querySelector("#player2").value == "") {
      document.querySelector("#player2").value = "Player 2 Name";
    } else {
    }

    GameController(
      document.querySelector("#player1").value,
      document.querySelector("#player2").value
    );
    const turnDiv = document.getElementById("turn");
    turnDiv.textContent = document.querySelector("#player1").value + `'s turn`;
    const enterNameDialog = document.querySelector("#enterName");
    enterNameDialog.style.display = "none";
  });
})();
