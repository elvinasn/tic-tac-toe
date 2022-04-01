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
let playerOne = Person("Elvinas", "X");
let playerTwo = Person("Gustautas", "O");

const GameController = (() => {
  let gameMode;
  const setGameMode = (mode) => (gameMode = mode);
  const getGameMode = () => gameMode;
  const restart = document.createElement("button");
  restart.classList.add("play");
  restart.textContent = "RESTART";
  restart.addEventListener("click", () => {
    EventHandler.HandleRestartButton();
  });
  let previousGameTurn = false;
  const beginGame = () => {
    body.appendChild(restart);
    playerOne.setTurn(!previousGameTurn);
    playerTwo.setTurn(previousGameTurn);
    GameBoard.clearGameBoard();
    displayController.updateGameBoard(GameBoard.getGameBoard(), body);
    displayController.displayTurn(playerOne, playerTwo);
    displayController.removeResultAndButton();
    previousGameTurn = !previousGameTurn;
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
  return {
    beginGame,
    checkIfFinished,
    setGameMode,
    getGameMode,
    removeRestart,
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

  const checkIfWinner = () => {
    return (
      checkVertical(0) ||
      checkVertical(1) ||
      checkVertical(2) ||
      checkHorizontal(0) ||
      checkHorizontal(1) ||
      checkHorizontal(2) ||
      checkMainDiagonal() ||
      checkSecondaryDiagonal()
    );
  };

  const checkVertical = (index) => {
    let i;
    for (i = 1; i < gameboard[index].length; i++) {
      if (
        gameboard[index][i] !== gameboard[index][i - 1] ||
        gameboard[index][i] === null
      ) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return gameboard[index][i - 1];
  };

  const checkHorizontal = (index) => {
    let i;
    for (i = 1; i < gameboard.length; i++) {
      if (
        gameboard[i][index] !== gameboard[i - 1][index] ||
        gameboard[i][index] === null
      ) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return gameboard[i - 1][index];
  };

  const checkMainDiagonal = () => {
    let i;
    for (i = 1; i < gameboard.length; i++) {
      if (
        gameboard[i][i] !== gameboard[i - 1][i - 1] ||
        gameboard[i][i] === null
      ) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return gameboard[i - 1][i - 1];
  };

  const checkSecondaryDiagonal = () => {
    let i;
    let j;
    for (i = 1, j = 1; i < gameboard.length; i++, j--) {
      if (
        gameboard[i][j] !== gameboard[i - 1][j + 1] ||
        gameboard[i][j] === null
      ) {
        gameFinished = false;
        return false;
      }
    }
    gameFinished = true;
    return gameboard[i - 1][j + 1];
  };

  const checkIfDraw = () => {
    for (let i = 0; i < gameboard.length; i++) {
      for (let j = 0; j < gameboard[i].length; j++) {
        if (gameboard[i][j] === null) {
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
    } else {
      play.disabled = true;
    }
  });
  playerTwoInput.addEventListener("input", () => {
    if (playerOneInput.value != "" && playerTwoInput.value != "") {
      play.disabled = false;
    } else {
      play.disabled = true;
    }
  });
  play.addEventListener("click", () => {
    playerOne = Person(playerOneInput.value, "X");
    playerTwo = Person(
      GameController.getGameMode() === "ai" ? "AI" : playerTwoInput.value,
      "0"
    );
    console.log(playerTwo.getName());
    form.classList.add("hidden");
    GameController.beginGame();
    playerOneInput.value = "";
    playerTwoInput.value = "";
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
      play.disabled = true;
    }

    form.innerHTML = "";
    form.appendChild(playerOneLabel);
    form.appendChild(playerOneInput);
    form.appendChild(play);
  };

  const toggleButtons = () => {
    buttons.classList.toggle("hidden");
  };

  return {
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
  };

  const HandleRestartButton = () => {
    GameController.beginGame();
  };
  return { HandlePlayerMove, HandleRestartButton };
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
