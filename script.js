const body = document.querySelector("body");
const buttons = document.querySelector(".buttons");
const ai = document.querySelector(".AI");
const pvp = document.querySelector(".PVP");
const form = document.querySelector(".form");

const Person = (name, sign, turn) => {
  const getName = () => name;
  const getSign = () => sign;
  const getTurn = () => turn;
  const setTurn = (value) => {
    turn = value;
  };
  const changeTurn = () => {
    turn = !turn;
  };
  return { getName, getSign, getTurn, changeTurn, setTurn };
};
let playerOne;
let playerTwo;

const GameController = (() => {
  let gameMode;
  let level;
  const setGameMode = (mode) => (gameMode = mode);
  const getGameMode = () => gameMode;
  const setLevel = (lev) => (level = lev);
  const restart = document.createElement("button");
  restart.classList.add("play");
  restart.textContent = "RESTART";
  restart.addEventListener("click", () => {
    EventHandler.HandleRestartButton();
  });
  let previousGameTurn = false;

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const beginGame = () => {
    body.appendChild(restart);
    playerOne.setTurn(!previousGameTurn);
    playerTwo.setTurn(previousGameTurn);
    GameBoard.clearGameBoard();
    displayController.updateGameBoard(GameBoard.getGameBoard(), body);
    displayController.displayTurn(playerOne, playerTwo);
    displayController.removeResultAndButton();
    previousGameTurn = !previousGameTurn;
    if (gameMode === "ai" && playerTwo.getTurn()) {
      MoveAI();
    }
  };

  const checkIfFinished = () => {
    if (GameBoard.checkIfWinner()) {
      displayController.displayResult(
        false,
        GameBoard.checkIfWinner().getName()
      );
      displayController.removeTurn();
      endOfGame = true;
      return true;
    }
    if (GameBoard.checkIfDraw()) {
      displayController.displayResult(true, "");
      displayController.removeTurn();
      endOfGame = true;
      return true;
    }
  };

  const removeRestart = () => {
    body.removeChild(restart);
  };

  const evaluate = (b) => {
    if (GameBoard.checkIfWinner(b) == playerTwo) {
      return 10;
    } else if (GameBoard.checkIfWinner(b) == playerOne) {
      return -10;
    }
    return 0;
  };

  const minimax = (board, isMax) => {
    let score = evaluate(board);

    if (score == 10) return score;

    if (score == -10) return score;

    if (GameBoard.checkIfDraw(board)) return 0;

    if (isMax) {
      let best = -1000;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == null) {
            board[i][j] = playerTwo;
            best = Math.max(best, minimax(board, !isMax));
            board[i][j] = null;
          }
        }
      }
      return best;
    } else {
      let best = 1000;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] == null) {
            board[i][j] = playerOne;
            best = Math.min(best, minimax(board, !isMax));
            board[i][j] = null;
          }
        }
      }
      return best;
    }
  };

  const findBestMove = (board) => {
    let bestScore = -1000;
    bestMoveY = -1;
    bestMoveX = -1;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == null) {
          board[i][j] = playerTwo;
          let moveScore = minimax(board, false);
          board[i][j] = null;

          if (moveScore > bestScore) {
            bestMoveY = i;
            bestMoveX = j;
            bestScore = moveScore;
          }
        }
      }
    }
    return [bestMoveX, bestMoveY];
  };

  const MoveAI = () => {
    setTimeout(() => {
      let i, j;
      if (level === "easy") {
        i = randomInt(0, 2);
        j = randomInt(0, 2);
        while (GameBoard.getGameBoard()[i][j] !== null) {
          i = randomInt(0, 2);
          j = randomInt(0, 2);
        }
      } else {
        console.log(GameBoard.getGameBoard());
        let move = findBestMove(GameBoard.getGameBoard());
        i = move[1];
        j = move[0];
      }

      GameBoard.updateGameBoard(
        i,
        j,
        playerOne.getTurn() ? playerOne : playerTwo
      );
      displayController.updateGameBoard(GameBoard.getGameBoard(), body);
      if (GameController.checkIfFinished()) {
        return;
      }
      displayController.updateGameBoard(GameBoard.getGameBoard(), body);
      playerOne.changeTurn();
      playerTwo.changeTurn();
      displayController.displayTurn(playerOne, playerTwo);
    }, 200);
  };
  return {
    beginGame,
    checkIfFinished,
    setGameMode,
    getGameMode,
    removeRestart,
    setLevel,
    MoveAI,
  };
})();

const GameBoard = (() => {
  let gameboard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const isFinished = () => checkIfWinner() || checkIfDraw();

  const getGameBoard = () => gameboard;

  const updateGameBoard = (x, y, player) => {
    gameboard[x][y] = player;
  };

  const clearGameBoard = () => {
    gameboard = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  };

  const checkIfWinner = (b = gameboard) => {
    return (
      checkVertical(0, b) ||
      checkVertical(1, b) ||
      checkVertical(2, b) ||
      checkHorizontal(0, b) ||
      checkHorizontal(1, b) ||
      checkHorizontal(2, b) ||
      checkMainDiagonal(b) ||
      checkSecondaryDiagonal(b)
    );
  };

  const checkVertical = (index, board = gameboard) => {
    let i;
    for (i = 1; i < board[index].length; i++) {
      if (board[index][i] !== board[index][i - 1] || board[index][i] === null) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return board[index][i - 1];
  };

  const checkHorizontal = (index, board = gameboard) => {
    let i;
    for (i = 1; i < board.length; i++) {
      if (board[i][index] !== board[i - 1][index] || board[i][index] === null) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return board[i - 1][index];
  };

  const checkMainDiagonal = (board = gameboard) => {
    let i;
    for (i = 1; i < board.length; i++) {
      if (board[i][i] !== board[i - 1][i - 1] || board[i][i] === null) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return board[i - 1][i - 1];
  };

  const checkSecondaryDiagonal = (board = gameboard) => {
    let i;
    let j;
    for (i = 1, j = 1; i < board.length; i++, j--) {
      if (board[i][j] !== board[i - 1][j + 1] || board[i][j] === null) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return board[i - 1][j + 1];
  };

  const checkIfDraw = (board = gameboard) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
    return true;
  };

  return {
    getGameBoard,
    updateGameBoard,
    checkIfWinner,
    checkIfDraw,
    clearGameBoard,
    isFinished,
  };
})();
const displayController = (() => {
  const restart = document.createElement("button");
  restart.textContent = "Play again?";
  restart.classList.add("play");

  const mainDisplay = document.createElement("button");
  mainDisplay.textContent = "Go to start menu";
  mainDisplay.classList.add("play");

  const easy = document.createElement("button");
  easy.textContent = "EASY MODE";
  easy.classList.add("play");

  const hard = document.createElement("button");
  hard.textContent = "HARD MODE";
  hard.classList.add("play");

  const play = document.createElement("button");
  play.textContent = "PLAY";
  play.classList.add("play");

  const playerOneLabel = document.createElement(`label`);
  playerOneLabel.setAttribute("for", "one");
  playerOneLabel.textContent = "Player one(X) name:";

  const playerOneInput = document.createElement(`input`);
  playerOneInput.setAttribute("type", "text");
  playerOneInput.setAttribute("id", "one");

  const playerTwoLabel = document.createElement(`label`);
  playerTwoLabel.setAttribute("for", "two");
  playerTwoLabel.textContent = "Player two(O) name:";

  const playerTwoInput = document.createElement(`input`);
  playerTwoInput.setAttribute("type", "text");
  playerTwoInput.setAttribute("id", "two");

  playerOneInput.addEventListener("input", () => {
    if (
      (playerOneInput.value != "" && GameController.getGameMode() === "ai") ||
      playerTwoInput.value != ""
    ) {
      play.disabled = false;
      easy.disabled = false;
      hard.disabled = false;
    } else {
      play.disabled = true;
      easy.disabled = true;
      hard.disabled = true;
    }
  });
  playerTwoInput.addEventListener("input", () => {
    if (playerOneInput.value != "" && playerTwoInput.value != "") {
      play.disabled = false;
      easy.disabled = false;
      hard.disabled = false;
    } else {
      play.disabled = true;
      easy.disabled = true;
      hard.disabled = true;
    }
  });
  play.addEventListener("click", () => {
    EventHandler.HandleStart();
  });
  easy.addEventListener("click", () => {
    GameController.setLevel("easy");
    EventHandler.HandleStart();
  });

  hard.addEventListener("click", () => {
    GameController.setLevel("hard");
    EventHandler.HandleStart();
  });

  mainDisplay.addEventListener("click", () => {
    container.classList.add("hidden");
    removeResultAndButton();
    GameController.removeRestart();
    toggleButtons();
  });

  const container = document.createElement("div");
  const result = document.createElement("p");
  const turn = document.createElement("p");

  const updateGameBoard = (gameBoard) => {
    container.classList.remove("hidden");
    container.innerHTML = "";
    container.classList.add("gameBoard");
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        const rect = document.createElement("div");
        rect.classList.add("pressable");
        rect.dataset.xcoord = i;
        rect.dataset.ycoord = j;
        const para = document.createElement("p");
        if (gameBoard[i][j] !== null) {
          para.textContent = gameBoard[i][j].getSign();
          para.classList.add("maxsize");
          rect.classList.remove("pressable");
        }
        rect.appendChild(para);
        container.appendChild(rect);
      }
    }
    body.appendChild(container);
  };

  const displayResult = (isDraw, name) => {
    if (isDraw) {
      result.textContent = "It's a draw!";
    } else {
      result.textContent = `${name} has won!`;
    }
    body.appendChild(result);
    body.appendChild(restart);
    body.appendChild(mainDisplay);
  };

  const removeResultAndButton = () => {
    Array.from(body.childNodes).includes;
    if (Array.from(body.childNodes).includes(restart)) {
      body.removeChild(restart);
    }
    if (Array.from(body.childNodes).includes(result)) {
      body.removeChild(result);
    }
    if (Array.from(body.childNodes).includes(mainDisplay)) {
      body.removeChild(mainDisplay);
    }
  };

  const removeTurn = () => {
    body.removeChild(turn);
  };

  const displayTurn = (player1, player2) => {
    const which = player1.getTurn() ? player1 : player2;
    turn.textContent = `It's ${which.getName()}(${which.getSign()}) turn!`;
    body.appendChild(turn);
  };

  const displayPVP = () => {
    if (playerOneInput.value === "" || playerTwoInput.value === "") {
      play.disabled = true;
    }

    form.innerHTML = "";
    form.appendChild(playerOneLabel);
    form.appendChild(playerOneInput);
    form.appendChild(playerTwoLabel);
    form.appendChild(playerTwoInput);
    form.appendChild(play);
  };

  const displayAI = () => {
    if (playerOneInput.value === "") {
      easy.disabled = true;
      hard.disabled = true;
    }

    form.innerHTML = "";
    form.appendChild(playerOneLabel);
    form.appendChild(playerOneInput);
    form.appendChild(easy);
    form.appendChild(hard);
  };

  const toggleButtons = () => {
    buttons.classList.toggle("hidden");
  };

  return {
    playerOneInput,
    playerTwoInput,
    updateGameBoard,
    container,
    displayResult,
    restart,
    removeResultAndButton,
    displayTurn,
    removeTurn,
    displayPVP,
    displayAI,
    toggleButtons,
  };
})();

const EventHandler = (() => {
  const HandlePlayerMove = (e) => {
    if (e.target.hasAttribute("data-xcoord") && !GameBoard.isFinished()) {
      if (GameController.getGameMode() === "pvp" || playerOne.getTurn()) {
        GameBoard.updateGameBoard(
          e.target.dataset.xcoord,
          e.target.dataset.ycoord,
          playerOne.getTurn() ? playerOne : playerTwo
        );
        displayController.updateGameBoard(GameBoard.getGameBoard(), body);
        if (GameController.checkIfFinished()) {
          return;
        }
        playerOne.changeTurn();
        playerTwo.changeTurn();
        displayController.displayTurn(playerOne, playerTwo);
      }
      if (GameController.getGameMode() == "ai") {
        GameController.MoveAI();
      }
    }
  };

  const HandleRestartButton = () => {
    GameController.beginGame();
  };

  const HandleStart = () => {
    playerOne = Person(displayController.playerOneInput.value, "X");
    playerTwo = Person(
      GameController.getGameMode() === "ai"
        ? "AI"
        : displayController.playerTwoInput.value,
      "0"
    );
    form.classList.add("hidden");
    GameController.beginGame();
    displayController.playerOneInput.value = "";
    displayController.playerTwoInput.value = "";
  };
  return { HandlePlayerMove, HandleRestartButton, HandleStart };
})();

displayController.container.addEventListener("click", (e) =>
  EventHandler.HandlePlayerMove(e)
);
displayController.restart.addEventListener("click", () =>
  EventHandler.HandleRestartButton()
);
ai.addEventListener("click", () => {
  form.classList.remove("hidden");
  displayController.toggleButtons();
  GameController.setGameMode("ai");
  displayController.displayAI();
});
pvp.addEventListener("click", () => {
  form.classList.remove("hidden");
  displayController.toggleButtons();
  GameController.setGameMode("pvp");
  displayController.displayPVP();
});
