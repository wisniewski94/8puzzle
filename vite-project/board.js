const checkIfArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};

const swapElements = (array, index, offset) => {
  const arrayCopy = [...array];
  [arrayCopy[index], arrayCopy[index + offset]] = [arrayCopy[index + offset], arrayCopy[index]];
  return arrayCopy;
};

class Board {
  constructor(board) {
    this.board = board || [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const size = Math.sqrt(this.board.length);
    const goal = [...Array(this.board.length - 1).keys()].map((el) => el + 1);
    this.goal = goal;
    this.size = size;
    this.goal.push(0);
    this.moveMapping = {
      LEFT: -1,
      UP: -(size),
      RIGHT: 1,
      DOWN: size,
    };
  }

  get availableMoves() {
    return this.findAvailableMoves();
  }

  get nextAvailableStates() {
    const {
      availableMoves, board, emptyTileIndex, moveMapping, size,
    } = this;
    const possibleStates = [];

    availableMoves.forEach((move) => {
      const offset = moveMapping[move];
      const optionalBoard = swapElements(board, emptyTileIndex, offset);
      possibleStates.push(new Board(optionalBoard, size));
    });

    return possibleStates;
  }

  get emptyTileIndex() {
    const { board } = this;
    return board.indexOf(0);
  }

  checkIfMovable(index) {
    const movableTiles = this.findMovableTiles();
    return movableTiles.includes(index);
  }

  findAvailableMoves() {
    const { emptyTileIndex } = this;

    const positionInRow = Math.floor(emptyTileIndex / this.size);
    const positionInColumn = emptyTileIndex % this.size;

    const availableMoves = [];
    if (positionInColumn > 0) availableMoves.push('LEFT');
    if (positionInColumn < this.size - 1) availableMoves.push('RIGHT');
    if (positionInRow < this.size - 1) availableMoves.push('DOWN');
    if (positionInRow > 0) availableMoves.push('UP');

    return availableMoves;
  }

  findMovableTiles() {
    const { emptyTileIndex } = this;
    const positionInRow = Math.floor(emptyTileIndex / this.size);
    const positionInColumn = emptyTileIndex % this.size;

    const movableTilesIndex = [];
    if (positionInColumn > 0) movableTilesIndex.push(emptyTileIndex - 1);
    if (positionInColumn < this.size - 1) movableTilesIndex.push(emptyTileIndex + 1);
    if (positionInRow < this.size - 1) movableTilesIndex.push(emptyTileIndex + this.size);
    if (positionInRow > 0) movableTilesIndex.push(emptyTileIndex - this.size);

    const movableTiles = movableTilesIndex.map((el) => this.board[el]);

    return movableTiles;
  }

  getRandomMoveFrom(availableMoves) {
    const { moveMapping } = this;
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const randomMove = availableMoves[randomIndex];
    return moveMapping[randomMove];
  }

  moveTile(tile) {
    const { board, emptyTileIndex } = this;
    const tileToMove = tile;
    const index = board.indexOf(tileToMove);
    const offset = emptyTileIndex - index;
    this.board = swapElements(board, index, offset);
    return this.moveMapping[offset];
  }

  shuffleOnce() {
    const { board, emptyTileIndex } = this;
    const availableMoves = this.findAvailableMoves();
    const randomMove = this.getRandomMoveFrom(availableMoves);
    this.board = swapElements(board, emptyTileIndex, randomMove);
  }

  shuffleTimes(n) {
    for (let i = 0; i <= n; i += 1) {
      this.shuffleOnce();
    }
  }

  swapElements(index, offset) {
    const { board } = this;
    const newArray = [...board];

    [newArray[index], newArray[index + offset]] = [newArray[index + offset], newArray[index]];

    this.board = newArray;
  }

  checkIfWin() {
    const { board, goal } = this;
    const equalsGoal = checkIfArraysEqual(board, goal);
    return equalsGoal;
  }
}

export default Board;
