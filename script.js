const body = document.querySelector("body");
const Person = (name, sign, turn) => {
  const getName = () => name;
  const getSign = () => sign;
  const getTurn = () => turn;
  const changeTurn = () => {
    turn = !turn;
  };
  return { getName, getSign, getTurn, changeTurn };
};

const playerOne = Person("Elvinas", "X", true);
const playerTwo = Person("Lukas", "O", false);

const GameBoard = (() => {
  let gameboard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

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
        return false;
      }
    }
    return gameboard[index][i - 1];
  };

  const checkHorizontal = (index) => {
    let i;
    for (i = 1; i < gameboard.length; i++) {
      if (
        gameboard[i][index] !== gameboard[i - 1][index] ||
        gameboard[i][index] === null
      ) {
        return false;
      }
    }
    return gameboard[i - 1][index];
  };

  const checkMainDiagonal = () => {
    let i;
    for (i = 1; i < gameboard.length; i++) {
      if (
        gameboard[i][i] !== gameboard[i - 1][i - 1] ||
        gameboard[i][i] === null
      ) {
        return false;
      }
    }
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
        return false;
      }
    }
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
  };
})();
const displayController = (() => {
  const container = document.createElement("div");
  const updateGameBoard = (gameBoard) => {
    container.innerHTML = "";
    container.classList.add("gameBoard");
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        const rect = document.createElement("div");
        rect.dataset.xcoord = i;
        rect.dataset.ycoord = j;
        const para = document.createElement("p");
        if (gameBoard[i][j] !== null) {
          para.textContent = gameBoard[i][j].getSign();
          para.classList.add("maxsize");
        }
        rect.appendChild(para);
        container.appendChild(rect);
      }
    }
    body.appendChild(container);
  };
  return { updateGameBoard, container };
})();

const EventHandler = (() => {
  const HandleClick = (e) => {
    if (e.target.hasAttribute("data-xcoord")) {
      GameBoard.updateGameBoard(
        e.target.dataset.xcoord,
        e.target.dataset.ycoord,
        playerOne.getTurn() ? playerOne : playerTwo
      );
      displayController.updateGameBoard(GameBoard.getGameBoard(), body);
      playerOne.changeTurn();
      playerTwo.changeTurn();
      if (GameBoard.checkIfWinner()) {
        const para = document.createElement("p");
        para.textContent = `${GameBoard.checkIfWinner().getName()} has won!`;
        body.appendChild(para);
        GameBoard.clearGameBoard();
        console.log(GameBoard.getGameBoard());
        displayController.updateGameBoard(GameBoard.getGameBoard());
        return;
      }
      if (GameBoard.checkIfDraw()) {
        const para = document.createElement("p");
        para.textContent = "It's a draw!";
        body.appendChild(para);
        GameBoard.clearGameBoard();
        console.log(GameBoard.getGameBoard());
        displayController.updateGameBoard(GameBoard.getGameBoard());
        return;
      }
    }
  };
  return { HandleClick };
})();

displayController.updateGameBoard(GameBoard.getGameBoard(), body);
displayController.container.addEventListener("click", (e) =>
  EventHandler.HandleClick(e)
);
