/* eslint-disable no-undef */
const Board = require('../board');

describe('Board class creation', () => {
  let instance = null;

  beforeEach(() => {
    instance = new Board();
  });

  it('is a Board class ', () => {
    expect(instance).toBeInstanceOf(Board);
  });

  it('has a board property', () => {
    expect(instance.board).toBeDefined();
  });

  it('has a board property with a length of 9', () => {
    expect(instance.board.length).toEqual(9);
  });

  it('has a size property that equals 3', () => {
    expect(instance.size).toEqual(3);
  });

  it('has a moveMapping property that contains all movements', () => {
    const moveMapping = {
      LEFT: -1,
      UP: -3,
      RIGHT: 1,
      DOWN: 3,
    };
    expect(instance.moveMapping).toEqual(moveMapping);
  });
});

describe('Board class methods', () => {
  let instance = null;
  beforeEach(() => {
    instance = new Board();
  });

  it('has a findAvailableMoves method that returns an array with length of 2', () => {
    expect(instance.findAvailableMoves().length).toEqual(2);
  });

  it('has a getRandomMove method that returns a random move', () => {
    const availableMoves = instance.findAvailableMoves();
    const randomMove = instance.getRandomMoveFrom(availableMoves);
    expect([-1, -3]).toContain(randomMove);
  });

  it('has a shuffleOnce method that updates board state', () => {
    const boardBefore = instance.board;
    instance.shuffleOnce();
    const boardAfter = instance.board;
    expect(boardBefore).not.toEqual(boardAfter);
  });

  it('has a shuffleTimes method that updates board state', () => {
    const boardBefore = instance.board;
    instance.shuffleTimes(10);
    const boardAfter = instance.board;
    expect(boardBefore).not.toEqual(boardAfter);
  });

  it('has a swapElements method that swaps elements in array', () => {
    instance.swapElements(0, 1);
    const boardAfter = instance.board;
    expect(boardAfter).toEqual([2, 1, 3, 4, 5, 6, 7, 8, 0]);
  });

  it('has a nextAvailableStates getter that returns next possible board', () => {
    const { nextAvailableStates } = instance;
    expect(nextAvailableStates).toBeDefined();
    expect(nextAvailableStates.length).toEqual(2);
    expect(nextAvailableStates[0]).toBeInstanceOf(Board);
  });
});
