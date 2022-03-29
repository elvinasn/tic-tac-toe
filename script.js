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

  const updateGameBoard = (x, y, value) => {
    gameboard[x][y] = value;
  };

  const checkIfWinner = () => {};
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

  return { gameboard, updateGameBoard, checkIfWinner, checkIfDraw };
})();
const displayController = (() => {
  const container = document.createElement("div");
  const updateGameBoard = (gameBoard, body) => {
    container.innerHTML = "";
    container.classList.add("gameBoard");
    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[i].length; j++) {
        const rect = document.createElement("div");
        rect.dataset.xcoord = i;
        rect.dataset.ycoord = j;
        let text = gameBoard[i][j];
        if (gameBoard[i][j] === null) {
          text = "";
        }
        rect.innerHTML = `<p>${text}</p>`;
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
        playerOne.getTurn() ? playerOne.getSign() : playerTwo.getSign()
      );
      displayController.updateGameBoard(GameBoard.gameboard, body);
      playerOne.changeTurn();
      playerTwo.changeTurn();
      console.log(GameBoard.checkIfDraw());
    }
  };
  return { HandleClick };
})();

displayController.updateGameBoard(GameBoard.gameboard, body);
displayController.container.addEventListener("click", (e) =>
  EventHandler.HandleClick(e)
);
